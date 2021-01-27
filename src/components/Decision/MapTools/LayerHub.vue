<template>
  <div class="layerhub">
    <div class="map-list">
      <div
        v-for="(item, index) in mapList"
        :key="index"
        @click="mapChange(item, index)"
        class="map-item"
      >
        <img
          v-if="currentMap == index"
          :src="
            require(`@/assets/images/maptools/${item.value}-sel-decision.png`)
          "
        />
        <img
          v-else
          :src="require(`@/assets/images/maptools/${item.value}-sel.png`)"
        />
        <span :class="{ active: currentMap == index }">{{ item.label }}</span>
      </div>
    </div>

    <div class="catalog">
      <el-popover
        placement="bottom-end"
        trigger="click"
        popper-class="layer-popper-decision"
      >
        <div class="panel">
          <span class="panel-title">塘河沿线</span>
          <div class="panel-body">
            <div
              v-for="k in Math.ceil(LayerHubs.length / 2)"
              :key="k"
              class="line"
            >
              <div
                v-for="(item, index) in LayerHubs.slice(
                  (k - 1) * 2,
                  (k - 1) * 2 + 2
                )"
                :key="index"
                @click="nodeChange(item)"
                :class="{ active: item.check }"
                class="card"
              >
                <img
                  :src="require(`@/assets/images/maptools/${item.icon2}.png`)"
                />
                <span class="card-label">{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="catalog-icon" slot="reference">
          <div class="catalog-icon-inner">
            <img src="@/assets/images/maptools/catalog.png" />
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { deepClone } from "@/common/js/util";
import { ServiceUrl, LayerList } from "@/config/mapConfig";
import { drawFeatures } from "@/components/Decision/cesium_map_draw";
export default {
  data() {
    return {
      mapList: [
        {
          label: "矢量",
          value: "vector",
        },
        {
          label: "影像",
          value: "img",
        },
        {
          label: "复位",
          value: "reset",
        },
      ],
      LayerHubs: [],
      saveDataMap: {},
      currentMap: 0,
    };
  },

  mounted() {
    // 深拷贝
    this.LayerHubs = deepClone(LayerList);
    
    this.nodeChange(this.LayerHubs[1]);
    this.nodeChange(this.LayerHubs[3]);
  },

  methods: {
    ...mapActions("decision", ["setSejList"]),

    // 地图工具
    mapChange(item, index) {
      if (item.value != "reset") {
        this.currentMap = index;
      }
      this.$bus.$emit("decision-layer-change", {
        value: item.value,
      });
    },

    // 节点事件
    nodeChange(node) {
      node.check = !node.check;

      if (node.id == "绿道") {
        this.$bus.$emit("decision-greenway-change", {
          value: node.check,
        });
      } else {
        if (node.check) {
          if (node.id && window.billboardMap[node.id]) {
            node.saveData
              ? this[node.saveData](this.saveDataMap[node.id])
              : null;
            window.billboardMap[node.id]._billboards.map(
              (v) => (v.show = true)
            );
            window.blackLabelMap[node.id].setAllLabelsVisible(true);
            window.whiteLabelMap[node.id].setAllLabelsVisible(true);
          } else {
            this.addFeatures(node);
          }
        } else {
          if (window.billboardMap[node.id]) {
            window.billboardMap[node.id]._billboards.map(
              (v) => (v.show = false)
            );
            const datasource = window.earth.dataSources.getByName(
              "location"
            )[0];
            const entity = datasource.entities.values[0];
            if (node && entity && node.id == entity.id) {
              datasource.entities.removeAll();
            }
            if (node.id == "十二景") {
              node.saveData && this[node.saveData]([]);
            } else {
              window.blackLabelMap[node.id].setAllLabelsVisible(false);
              window.whiteLabelMap[node.id].setAllLabelsVisible(false);
            }
          }
        }
      }
    },

    // 添加要素
    addFeatures(node) {
      const url = ServiceUrl.FEATUREMVT;
      let getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: node.param,
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: [node.dataset],
      });
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
        eventListeners: {
          processCompleted: async (res) => {
            drawFeatures(this, res, node);
          },
          processFailed: (msg) => console.log(msg),
        },
      });
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },
  },
};
</script>

<style lang="less" scoped>
.layerhub {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: fixed;
  top: 9.81vh;
  right: 5vh;
  z-index: 999;

  .map-list {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 4.2vh;
    background: rgba(6, 16, 53, 0.8);
    border: solid 0.06vh #0f4dd8;
    border-radius: 0.96vh;

    .map-item {
      display: flex;
      align-items: center;
      position: relative;
      font-size: 1.8vh;
      box-sizing: border-box;
      padding: 0 1.5vh;
      cursor: pointer;

      img {
        width: 1.8vh;
        height: 1.8vh;
      }

      span {
        display: inline-block;
        font-family: PingFang;
        font-size: 1.8vh;
        color: #2283fc;
        margin-left: 0.6vh;

        &.active {
          font-weight: 600;
          color: #69fee5;
        }
      }

      &:not(:last-child):after {
        content: "";
        width: 0.14vh;
        height: 1.8vh;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        background-color: #2283fc;
      }
    }
  }

  .catalog {
    .catalog-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 4.2vh;
      height: 4.2vh;
      background-color: rgba(255, 255, 255, 0.9);
      box-shadow: 0vh 0.13vh 0.25vh 0vh rgba(10, 73, 120, 0.4);
      border: solid 0.06vh #0f4dd8;
      border-radius: 50%;
      margin-left: 1.2vh;
      cursor: pointer;

      .catalog-icon-inner {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3.6vh;
        height: 3.6vh;
        background-color: rgba(15, 77, 216, 0.9);
        border-radius: 50%;

        img {
          width: 1.95vh;
          height: 1.65vh;
        }
      }
    }
  }
}
</style>
<style lang="less">
// 弹出框
.layer-popper-decision {
  width: 17vh;
  min-width: 0;
  border-radius: 0.8vh;
  background-color: rgba(6, 16, 53, 0.8);
  box-shadow: 0vh 0.13vh 0.25vh 0vh rgba(10, 73, 120, 0.4);
  border: solid 0.06vh #0f4dd8;
  box-sizing: border-box;
  padding: 1.38vh 1.63vh 1.75vh;

  .panel {
    .panel-title {
      display: block;
      height: 2.1vh;
      line-height: 2.1vh;
      font-family: PingFang;
      font-weight: 600;
      font-size: 1.5vh;
      color: #fff;
      margin-bottom: 0.75vh;
    }

    .panel-body {
      .line {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1.5vh;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 6vh;
        height: 8.1vh;
        background-color: transparent;
        border: dashed 0.07vh #255dda;
        border-radius: 0.45vh;
        cursor: pointer;

        img {
          width: 4.2vh;
          height: 4.2vh;
          margin-bottom: 0.75vh;
        }

        .card-label {
          display: block;
          height: 1.65vh;
          line-height: 1.65vh;
          font-family: PingFang;
          font-size: 1.2vh;
          color: #fff;
        }

        &.active {
          background-color: rgba(0, 65, 168, 0.8);
          border: solid 0.15vh #255dda;
        }
      }
    }
  }

  .popper__arrow {
    border-color: transparent transparent #0f4dd8 !important;
    border-style: solid dashed dashed !important;

    &::after {
      border-bottom-color: rgba(6, 16, 53, 0.8) !important;
    }
  }
}
</style>