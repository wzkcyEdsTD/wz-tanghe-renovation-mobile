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
          :src="require(`@/assets/images/maptools/${item.value}-sel.png`)"
        />
        <img
          v-else
          :src="require(`@/assets/images/maptools/${item.value}-unsel.png`)"
        />
        <span :class="{ active: currentMap == index }">{{ item.label }}</span>
      </div>
    </div>

    <div class="catalog">
      <el-popover
        placement="bottom-end"
        trigger="click"
        popper-class="layer-popper"
      >
        <div class="panel">
          <span class="panel-title">塘河沿线</span>
          <div class="panel-body">
            <div
              v-for="k in Math.ceil(LayerList.length / 2)"
              :key="k"
              class="line"
            >
              <div
                v-for="(item, index) in LayerList.slice(
                  (k - 1) * 2,
                  (k - 1) * 2 + 2
                )"
                :key="index"
                @click="change(item)"
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
import { ServiceUrl, LayerList } from "@/config/mapConfig";
import { drawFeatures } from "@/components/SourceLayer/cesium_map_draw";
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
      LayerList,
      saveDataMap: {},
      currentMap: 0,
    };
  },

  mounted() {
    // 默认显示
    this.change(LayerList[0]);
    this.change(LayerList[1]);
    this.change(LayerList[2]);
    this.change(LayerList[3]);
  },

  methods: {
    ...mapActions("map", ["setSejList"]),
    mapChange(item, index) {
      if (item.value != "reset") {
        this.currentMap = index;
      }
      this.$bus.$emit("map-layer-change", {
        value: item.value,
      });
    },

    change(node) {
      node.check = !node.check;

      if (node.id == "绿道") {
        this.$bus.$emit("map-greenway-change", {
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
        attributeFilter: `SMID <= 1000`,
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
  right: 3.5vh;
  z-index: 999;

  .map-list {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 3.5vh;
    background: #fff;
    border: 1px solid #255cdb;
    border-radius: 0.8vh;

    .map-item {
      display: flex;
      align-items: center;
      position: relative;
      font-size: 1.5vh;
      box-sizing: border-box;
      padding: 0 1.25vh;
      cursor: pointer;

      img {
        width: 1.5vh;
        height: 1.5vh;
      }

      span {
        display: inline-block;
        font-family: PingFang;
        font-size: 1.5vh;
        color: #666;
        margin-left: 0.5vh;

        &.active {
          font-weight: 600;
          color: #0f4dd8;
        }
      }

      &::after {
        content: "";
        width: 0.12vh;
        height: 1.5vh;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        background-color: #666;
      }

      &:last-child::after {
        width: 0;
      }
    }
  }

  .catalog {
    .catalog-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 3.5vh;
      height: 3.5vh;
      background-color: rgba(255, 255, 255, 0.9);
      box-shadow: 0vh 0.13vh 0.25vh 0vh rgba(10, 73, 120, 0.4);
      border: solid 0.06vh #0f4dd8;
      border-radius: 50%;
      margin-left: 1vh;
      cursor: pointer;

      .catalog-icon-inner {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3vh;
        height: 3vh;
        background-color: rgba(15, 77, 216, 0.9);
        border-radius: 50%;

        img {
          width: 1.63vh;
          height: 1.38vh;
        }
      }
    }
  }
}
</style>