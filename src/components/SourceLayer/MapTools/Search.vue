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
            <span class="check-more">查看更多结果</span>
          </li>
        </ul>
        <ul id="addressResultContent" v-show="addressResults.length">
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
} from "@/components/SourceLayer/cesium_map_init";
import { getAddressList } from "@/api/addressAPI";
export default {
  data() {
    return {
      MediaServer,
      searchIconHash,
      input: "",
      resultShow: false,
      results: [],
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
      const datasource = "172.168.3.181_thxm_manage:";
      const url = ServiceUrl.FEATUREMVT;
      const getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: `NAME like '%${word}%'`,
      });
      const getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters(
        {
          queryParameter: getFeatureParam,
          toIndex: -1,
          datasetNames: [
            `${datasource}sp_point_resource`,
            `${datasource}th_spatial_project_view`,
          ],
        }
      );
      const getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(
        url,
        {
          eventListeners: {
            processCompleted: async (res) => {
              const features = res.result.features;
              if (features.length) {
                this.moreShow = true;
                this.addressResults = [];
                this.fixData(features);
              } else {
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
      this.addressResults = records;
    },

    // 组装数据
    fixData(data) {
      if (!data) return;

      this.results = [];
      data.map(({ attributes, geometry }) => {
        const type = attributes.RESOURCE_TYPE;
        if (
          type == "project_all" ||
          type == "greenway_all" ||
          type == "scenicspot12"
        ) {
          this.results.push({
            id: `${attributes.SMID}@${type}`,
            type: type,
            icon: ~type.indexOf("scenicspot12")
              ? `十二景`
              : ~type.indexOf("greenway_all")
              ? `断点`
              : attributes.STATUS,
            img_dir: ~type.indexOf("scenicspot12")
              ? `十二景`
              : ~type.indexOf("greenway_all")
              ? `绿道断点`
              : "项目",
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
            name: attributes.SHORT_NAME || attributes.NAME,
            dep: attributes.STREET || `无`,
            attributes,
            geometry,
          });
        }
      });
    },

    // 结果点击
    itemClick(item) {
      this.resultShow = false;
      const { x, y } = item.geometry;

      // 定位图标
      addLocationIcon(item.geometry, item.id);

      // 详情
      if (item.type == "scenicspot12") {
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
        destination: Cesium.Cartesian3.fromDegrees(x + 0.004, y - 0.004, 1200),
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
    width: 36.75vh;
    height: 4.2vh;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0vh 0.13vh 0.25vh 0vh rgba(10, 73, 120, 0.4);
    border: solid 0.07vh #0f4dd8;
    border-radius: 0.75vh;
    box-sizing: border-box;
    padding: 0.75vh 1vh;

    .input {
      flex: 1;
      background: transparent;
      border: none;
      font-family: PingFang;
      font-size: 1.8vh;
      color: #000;
      outline: none;
    }

    img {
      height: 1.8vh;
      cursor: pointer;
    }

    .btn-split {
      display: inline-block;
      width: 0.15vh;
      height: 1.8vh;
      background-color: #4b588e;
      margin: 0 1.12vh;
    }
  }

  .result {
    width: 36.75vh;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0vh 0.13vh 0.25vh 0vh rgba(10, 73, 120, 0.4);
    border: solid 0.07vh #0f4dd8;
    border-radius: 0.75vh;
    box-sizing: border-box;
    margin-top: 0.5vh;
    padding: 1.56vh 1.25vh 1.31vh;

    .result-inner {
      max-height: 60vh;
      overflow-x: hidden;
      overflow-y: auto;

      .result-item {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        position: relative;
        box-sizing: border-box;
        margin-top: 1.57vh;
        padding: 0 1.95vh 1.5vh 1.27vh;
        text-align: left;
        cursor: pointer;

        .item-thumb {
          width: 12.6vh;
          height: 8.03vh;
          padding-right: 1.57vh;
        }

        .item-body {
          flex: 1;
          text-align: left;

          .line {
            display: flex;
            align-items: center;

            img {
              margin-right: 0.75vh;
              width: 2.4vh;
              height: 2.4vh;
            }

            > span {
              flex: 1;
              display: block;
              height: 3vh;
              line-height: 3vh;
              font-family: PingFang;
              font-weight: 600;
              font-size: 2.1vh;
              color: #165fea;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }

          .item-dep {
            background-color: #def1ff;
            box-sizing: border-box;
            margin-top: 0.6vh;
            padding: 0.12vh 0.6vh 0.36vh;

            span {
              height: 2.25vh;
              line-height: 2.25vh;
              font-family: PingFang;
              font-weight: 600;
              font-size: 1.65vh;
              color: #000;

              &:first-child {
                margin-right: 1.2vh;
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
          height: 0.07vh;
          background-image: linear-gradient(
            to right,
            #666 0%,
            #666 50%,
            transparent 50%
          );
          background-size: 0.96vh 0.07vh;
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

        .check-more {
          display: block;
          text-align: center;
          font-family: YouSheBiaoTiHei;
          font-size: 1.8vh;
          color: #165fea;
        }
      }

      #addressResultContent {
        margin-top: 1.57vh;

        .result-item {
          font-family: PingFang;
          font-weight: 600;
          font-size: 1.65vh;
        }
      }
    }
  }

  .back {
    display: flex;
    width: 36.75vh;
    height: 3vh;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 0.6vh;
    border: solid 0.07vh #0f4dd8;
    box-sizing: border-box;
    margin-top: 0.5vh;
    padding: 0 1.2vh;
    cursor: pointer;

    span {
      display: block;
      height: 3vh;
      line-height: 3vh;
      font-family: PingFang;
      font-weight: 600;
      font-size: 1.35vh;
      color: #165fea;

      &:first-child {
        padding-right: 0.97vh;
      }

      &:last-child {
        flex: 1;
        text-align: left;
        text-overflow: ellipsis;
      }
    }
  }

  .none {
    width: 36.75vh;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0vh 0.13vh 0.25vh 0vh rgba(10, 73, 120, 0.4);
    border: solid 0.07vh #0f4dd8;
    border-radius: 0.6vh;
    box-sizing: border-box;
    margin-top: 0.5vh;
    padding: 1.2vh;

    span {
      text-align: center;
      font-family: YouSheBiaoTiHei;
      font-size: 1.5vh;
      color: #165fea;
    }
  }
}
</style>



