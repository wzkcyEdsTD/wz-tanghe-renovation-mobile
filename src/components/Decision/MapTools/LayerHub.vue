<template>
  <div class="layerhub">
    <div class="select-wrapper" v-if="menu">
      <el-select
        class="filter-select"
        v-show="menu == '项目' || menu == '绿道断点'"
        style="width: 120px"
        v-model="yearValue"
        placeholder="年份"
        @change="changeYear"
      >
        <el-option
          v-for="item in yearOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        class="filter-select"
        v-show="menu == '项目'"
        style="margin: 0 10px; width: 150px"
        v-model="importantValue"
        placeholder="类型"
        @change="changeImportant"
      >
        <el-option
          v-for="item in importantOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        class="filter-select"
        v-show="menu == '绿道断点'"
        style="margin: 0 10px; width: 90px"
        v-model="ddtypeValue"
        placeholder="类型"
        @change="changeType"
      >
        <el-option
          v-for="item in ddtypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
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
      yearOptions: [
        {
          label: "2020",
          value: 2020,
        },
        {
          label: "2021",
          value: 2021,
        },
      ],
      yearValue: "",
      importantOptions: [
        {
          label: "重点项目",
          value: "1",
        },
        {
          label: "非重点项目",
          value: "0",
        },
      ],
      importantValue: "",
      ddtypeOptions: [
        {
          label: "断点",
          value: "breakpoint",
        },
        {
          label: "贯通",
          value: "through",
        },
        {
          label: "提升",
          value: "promote",
        },
      ],
      ddtypeValue: "",
      menu: "",
    };
  },

  mounted() {
    // 深拷贝
    this.LayerHubs = deepClone(LayerList);

    // this.nodeChange(this.LayerHubs[1]);
    // this.nodeChange(this.LayerHubs[3]);
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
    nodeChange(node, fn) {
      node.check = !node.check;

      if (node.id == "绿道") {
        this.$bus.$emit("decision-greenway-change", {
          value: node.check,
        });
      } else {
        if (node.check) {
          this.yearValue = "";
          this.ddtypeValue = "";
          this.importantValue = "";
          this.menu = node.id;
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
            this.addFeatures(node, fn);
          }
        } else {
          this.menu == node.id && (this.menu = "");
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
    addFeatures(node, fn) {
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
            drawFeatures(this, res, node, fn);
          },
          processFailed: (msg) => console.log(msg),
        },
      });
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },

    changeYear(val) {
      let res = [];
      for (let key in window.featureMap[this.menu]) {
        let item = window.featureMap[this.menu][key];
        if (this.menu == "绿道断点" && this.ddtypeValue) {
          if (
            ~item.attributes.TAG.indexOf(val) &&
            item.attributes.TYPE == this.ddtypeValue
          ) {
            res.push(item);
          }
        } else if (this.menu == "项目" && this.importantValue) {
          if (
            ~item.attributes.TAG.indexOf(val) &&
            item.attributes.IS_IMPORTANT == this.importantValue
          ) {
            res.push(item);
          }
        } else {
          if (~item.attributes.TAG.indexOf(val)) {
            res.push(item);
          }
        }
      }
      this.filterData(res);
    },
    changeImportant(val) {
      let res = [];
      for (let key in window.featureMap[this.menu]) {
        let item = window.featureMap[this.menu][key];
        if (this.yearValue) {
          if (
            item.attributes.IS_IMPORTANT == val &&
            ~item.attributes.TAG.indexOf(this.yearValue)
          ) {
            res.push(item);
          }
        } else {
          if (item.attributes.IS_IMPORTANT == val) {
            res.push(item);
          }
        }
      }
      this.filterData(res);
    },
    changeType(val) {
      let res = [];
      for (let key in window.featureMap[this.menu]) {
        let item = window.featureMap[this.menu][key];
        if (this.yearValue) {
          if (
            item.attributes.TYPE == val &&
            ~item.attributes.TAG.indexOf(this.yearValue)
          ) {
            res.push(item);
          }
        } else {
          if (item.attributes.TYPE == val) {
            res.push(item);
          }
        }
      }
      this.filterData(res);
    },
    filterData(array) {
      // console.log('array', array)
      window.billboardMap[this.menu]._billboards.forEach((v) => {
        v.show = false;
        array.forEach((item) => {
          if (v.id == `billboard@${item.attributes.SMID}@${this.menu}`) {
            v.show = true;
          }
        });
      });
      window.whiteLabelMap[this.menu]._labels.forEach((v) => {
        v.show = false;
        array.forEach((item) => {
          if (v.id == `label@${item.attributes.SMID}@${this.menu}`) {
            v.show = true;
          }
        });
      });
      window.blackLabelMap[this.menu]._labels.forEach((v) => {
        v.show = false;
        array.forEach((item) => {
          if (v.id == `label@${item.attributes.SMID}@${this.menu}`) {
            v.show = true;
          }
        });
      });
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
  .filter-select {
    border: 1px solid #0f4dd8;
    /deep/.el-input__inner {
      background-color: rgba(5, 13, 50, 0.9) !important;
      color: white !important;
      border: none !important;
      text-align: center !important;
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
.el-select-dropdown__wrap.el-scrollbar__wrap {
  overflow: hidden;
}
</style>