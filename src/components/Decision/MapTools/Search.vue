<template>
  <div class="search">
    <div class="search-box">
      <input
        type="text"
        class="input"
        placeholder="请输入关键字"
        v-model="input"
        @keyup.enter="search"
      />
      <img src="@/assets/images/maptools/clean.png" @click="clean" />
      <span class="btn-split" />
      <img src="@/assets/images/maptools/search.png" @click="search" />
    </div>
    <div class="result" v-show="resultShow">
      <div class="result-inner">
        <ul id="itemResultContent" v-show="results.length">
          <li
            class="result-item"
            v-for="(item, index) in results"
            :key="index"
            @click="itemClick(item)"
          >
            <img
              v-if="item.img"
              class="item-thumb"
              :src="`${MediaServer}/images/${item.img_dir}/${item.img}`"
            />
            <img
              v-else
              class="item-thumb"
              src="@/assets/images/maptools/暂无图片.png"
            />
            <div class="item-body">
              <div class="line">
                <img
                  v-if="item.icon"
                  :src="
                    require(`@/assets/images/maptools/type_${
                      searchIconHash[item.icon]
                    }.png`)
                  "
                />
                <span class="item-name">{{ item.name }}</span>
              </div>
              <div class="item-dep">
                <span>责任单位</span>
                <span>{{ item.dep }}</span>
              </div>
            </div>
          </li>
          <li class="result-item" v-show="moreShow" @click="checkMore">
            查看更多结果
          </li>
        </ul>
        <ul
          id="addressResultContent"
          style="margin-top: 1.31vh"
          v-show="addressResults.length"
        >
          <li
            class="result-item"
            v-for="(item, i) in addressResults"
            :key="i"
            @click="resultClick(item)"
          >
            {{ item.result }}
          </li>
        </ul>
      </div>
    </div>
    <div class="back" v-show="!resultShow && results.length" @click="back">
      <span>{{ `&lt;` }}</span>
      <span>{{ `返回&quot;${input}&quot;的搜索结果` }}</span>
    </div>
    <div
      class="none"
      v-if="resultShow && !results.length && !addressResults.length"
    >
      <span>未找到相应地点</span>
    </div>
  </div>
</template>

<script>
import { ServiceUrl, MediaServer } from "@/config/mapConfig";
import { searchIconHash } from "@/common/js/hash";
import {
  addLocationIcon,
  cleanLocationIcon,
} from "@/components/Decision/cesium_map_init";
import { getAddressList } from "@/api/addressAPI";
export default {
  data() {
    return {
      MediaServer,
      searchIconHash,
      input: "",
      resultShow: false,
      results: [],
      // addressResultShow: false,
      addressResults: [],
      moreShow: false,
    };
  },

  methods: {
    // 搜索
    search() {
      document.querySelector(".result-inner").scrollTop = 0;
      this.results = [];
      if (!this.input) return;
      this.multSqlQuery(this.input);
      this.$parent.$refs.ProjectDetailPopup.closeInfo();
      this.$parent.$refs.CommonDetailPopup.closeInfo();
    },

    // 清除
    clean() {
      this.input = "";
      this.results = [];
      this.resultShow = false;
    },

    // 多数据集查询
    multSqlQuery(word) {
      const datasource = "172.168.3.181_thxm:";
      const url = ServiceUrl.FEATUREMVT;
      const getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: `NAME like '%${word}%'`,
      });
      const getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters(
        {
          queryParameter: getFeatureParam,
          toIndex: -1,
          datasetNames: [
            `${datasource}十二景`,
            `${datasource}项目`,
            `${datasource}绿道断点`,
          ],
        }
      );
      const getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(
        url,
        {
          eventListeners: {
            processCompleted: async (res) => {
              const features = res.result.features;
              console.log("features~~~~~~~~~~~~~", features);
              if (features.length) {
                // this.addressResultShow = false
                this.moreShow = true;
                this.addressResults = [];
                this.fixData(features);
              } else {
                console.log("addressAPI");
                this.addressQuery();
              }
              this.resultShow = true;
            },
            processFailed: (msg) => console.log(msg),
          },
        }
      );
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },

    // 地名地址查询
    async addressQuery() {
      this.addressResults = [];
      const { records } = await getAddressList(this.input);
      console.log("records!!!!", records);
      // this.addressResultShow = true
      this.addressResults = records;
    },

    // 组装数据
    fixData(data) {
      if (!data) return;

      this.results = [];
      data.map(({ attributes, geometry }) => {
        this.results.push({
          id: `${attributes.SMID}@${
            ~attributes.GUID.indexOf("sej")
              ? `十二景`
              : ~attributes.GUID.indexOf("xm")
              ? `项目`
              : "断点"
          }`,
          type: ~attributes.GUID.indexOf("sej")
            ? `十二景`
            : ~attributes.GUID.indexOf("xm")
            ? `项目`
            : "断点",
          icon: ~attributes.GUID.indexOf("sej")
            ? `十二景`
            : ~attributes.GUID.indexOf("xm")
            ? attributes.CURRENT_STATE
            : "断点",
          img_dir: ~attributes.GUID.indexOf("sej")
            ? `十二景`
            : ~attributes.GUID.indexOf("xm")
            ? `项目`
            : "绿道断点",
          img:
            (attributes.JGT
              ? ~attributes.JGT.indexOf(";")
                ? attributes.JGT.split(";")[0]
                : attributes.JGT
              : null) ||
            (attributes.PHOTO
              ? ~attributes.PHOTO.indexOf(";")
                ? attributes.PHOTO.split(";")[0]
                : attributes.PHOTO
              : null) ||
            null,
          name:
            attributes.SHORTNAME ||
            attributes.NAME ||
            attributes.MC ||
            attributes.JC,
          dep: attributes.ZRDW || attributes.ZR_DEPTID || `无`,
          attributes,
          geometry,
        });
      });
    },

    // 结果点击
    itemClick(item) {
      console.log("item", item);
      this.resultShow = false;
      const { x, y } = item.geometry;

      // 定位图标
      addLocationIcon(item.geometry, item.id);

      // 详情
      if (item.type == "十二景") {
        this.$parent.$refs.CommonDetailPopup.isSearch = true;
        this.$parent.$refs.CommonDetailPopup.getForceEntity({ ...item });
        this.$parent.$refs.ProjectDetailPopup.closeInfo();
      } else {
        this.$parent.$refs.ProjectDetailPopup.isSearch = true;
        this.$parent.$refs.ProjectDetailPopup.getForceEntity({ ...item });
        this.$parent.$refs.CommonDetailPopup.closeInfo();
      }

      // 移动
      window.earth.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(x, y, 1200),
        orientation: {
          heading: 0.01768860454315663,
          pitch: Cesium.Math.toRadians(-90),
          roll: 0.0,
        },
      });
    },

    // 地址结果点击
    resultClick({ lng, lat, result }) {
      window.earth.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lng, lat, 1200),
        orientation: {
          heading: 0.01768860454315663,
          pitch: Cesium.Math.toRadians(-90),
          roll: 0.0,
        },
      });
      window.earth.entities.removeById("address-location");
      cleanLocationIcon();

      const addressLocationEntity = new Cesium.Entity({
        id: "address-location",
        position: Cesium.Cartesian3.fromDegrees(lng, lat, 4),
        geometry: { lng, lat },
        billboard: {
          image: "/libs/images/map-ico/location.png",
          width: 40,
          height: 40,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text: result,
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLUE,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          font: "11px",
          scale: 1,
          outlineWidth: 2,
          pixelOffset: new Cesium.Cartesian2(0, -40),
          scaleByDistance: new Cesium.NearFarScalar(5000, 1, 10000, 0.5),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      });
      window.earth.entities.add(addressLocationEntity);
    },

    // 查看更多结果
    checkMore() {
      this.moreShow = false;
      this.addressQuery();
    },

    // 返回搜索结果列表
    back() {
      this.resultShow = true;
      this.$parent.$refs.ProjectDetailPopup.closeInfo();
      this.$parent.$refs.CommonDetailPopup.closeInfo();
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  position: absolute;
  left: 3.69vh;
  top: 9.81vh;
  z-index: 999;

  .search-box {
    display: flex;
    align-items: center;
    width: 33.75vh;
    height: 3.5vh;
    background-color: rgba(6, 16, 53, 0.9);
    box-shadow: 0vh 0.13vh 0.25vh 0vh rgba(10, 73, 120, 0.4);
    border: solid 0.06vh #0f4dd8;
    border-radius: 0.63vh;
    box-sizing: border-box;
    padding: 0.75vh 1vh;

    .input {
      flex: 1;
      background: transparent;
      border: none;
      font-family: PingFang;
      font-size: 1.5vh;
      margin: 0.4vh 1vh 0.4vh 0;
      color: #fff;
      outline: none;
    }

    ::-webkit-input-placeholder,
    ::-moz-placeholder,
    :-moz-placeholder,
    :-ms-input-placeholder {
      color: #fff;
      opacity: 0.6;
    }

    img {
      height: 1.5vh;
      cursor: pointer;
    }

    .btn-split {
      display: inline-block;
      width: 0.13vh;
      height: 1.5vh;
      background-color: #4b588e;
      margin: 0 0.94vh;
    }
  }

  .result {
    width: 33.75vh;
    background-color: rgba(6, 16, 53, 0.9);
    box-shadow: 0vh 0.13vh 0.25vh 0vh rgba(10, 73, 120, 0.4);
    border: solid 0.06vh #0f4dd8;
    border-radius: 0.63vh;
    box-sizing: border-box;
    margin-top: 0.5vh;
    padding: 1.56vh 1.25vh 1.31vh;

    .result-inner {
      max-height: 68.75vh;
      overflow-x: hidden;
      overflow-y: auto;

      .result-item {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        position: relative;
        box-sizing: border-box;
        margin-top: 1.31vh;
        padding: 0 1.63vh 1.25vh 1.06vh;
        text-align: left;
        cursor: pointer;
        color: #fff;

        .item-thumb {
          width: 10.5vh;
          height: 6.69vh;
          padding-right: 1.31vh;
        }

        .item-body {
          width: 16.75vh;
          text-align: left;

          .line {
            display: flex;
            align-items: center;

            img {
              margin-right: 0.63vh;
              width: 2vh;
            }

            > span {
              flex: 1;
              display: block;
              height: 2.5vh;
              line-height: 2.5vh;
              font-family: PingFang;
              font-weight: 600;
              font-size: 1.75vh;
              color: #fff;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }

          .item-dep {
            box-sizing: border-box;
            margin-top: 0.5vh;
            padding: 0.1vh 0.5vh 0.3vh;

            span {
              height: 1.88vh;
              line-height: 1.88vh;
              font-family: PingFang;
              font-weight: 600;
              font-size: 1.38vh;
              color: #fff;

              &:first-child {
                margin-right: 1vh;
              }

              &:last-child {
                text-overflow: ellipsis;
              }
            }
          }
        }

        &::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 0.06vh;
          background-image: linear-gradient(
            to right,
            #165fea 0%,
            #165fea 50%,
            transparent 50%
          );
          background-size: 0.8vh 0.06vh;
          background-repeat: repeat-x;
        }

        &:first-child {
          margin-top: 0;
        }

        &:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          &::after {
            height: 0;
          }
        }
      }
    }
  }

  .back {
    display: flex;
    width: 33.75vh;
    height: 2.5vh;
    background-color: rgba(6, 16, 53, 0.9);
    border-radius: 0.5vh;
    border: solid 0.06vh #0f4dd8;
    box-sizing: border-box;
    margin-top: 0.5vh;
    padding: 0 1vh;
    cursor: pointer;

    span {
      display: block;
      height: 2.5vh;
      line-height: 2.5vh;
      font-family: PingFang;
      font-weight: 600;
      font-size: 1.13vh;
      color: #fff;
      opacity: 0.6;

      &:first-child {
        padding-right: 0.81vh;
      }

      &:last-child {
        flex: 1;
        text-align: left;
        text-overflow: ellipsis;
      }
    }
  }

  .none {
    width: 33.75vh;
    background-color: rgba(6, 16, 53, 0.9);
    box-shadow: 0vh 0.13vh 0.25vh 0vh rgba(10, 73, 120, 0.4);
    border: solid 0.06vh #0f4dd8;
    border-radius: 0.63vh;
    box-sizing: border-box;
    margin-top: 0.5vh;
    padding: 1vh;

    span {
      text-align: center;
      font-family: YouSheBiaoTiHei;
      font-size: 1.5vh;
      color: #fff;
    }
  }
}
</style>



