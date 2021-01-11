<template>
  <div class="cesiumMap">
    <div id="cesiumContainer"></div>
    <div v-if="mapLoaded">
      <LayerHub v-show="hubShow" ref="LayerHub" />
      <Search ref="Search" />
      <CommonDetailPopup ref="CommonDetailPopup" />
      <ProjectDetailPopup ref="ProjectDetailPopup" />
      <TopicPopup ref="TopicPopup" />
      <NamePopup ref="NamePopup" />
      <Legend v-show="hubShow" ref="Legend" />
      <TopicHub ref="TopicHub" />
      <SpaceTool ref="SpaceTool" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { ServiceUrl } from "@/config/mapConfig";
import {
  initMapConfig,
  addMapImgLayer,
  addRiverLayer,
  addGreenwayLayer,
  initCamera,
  resetCamera,
  addLocationIcon,
  cleanLocationIcon,
} from "./cesium_map_init";

import LayerHub from "@/components/Decision/MapTools/LayerHub";
import Search from "@/components/Decision/MapTools/Search";
import Legend from "@/components/Decision/MapTools/Legend";
import TopicHub from "@/components/Decision/MapTools/TopicHub";
import SpaceTool from "@/components/Decision/MapTools/SpaceTool";
import NamePopup from "@/components/Decision/Frame/NamePopup";
import CommonDetailPopup from "@/components/Decision/Frame/CommonDetailPopup";
import ProjectDetailPopup from "@/components/Decision/Frame/ProjectDetailPopup";
import TopicPopup from "../../components/Decision/Frame/TopicPopup";

export default {
  data() {
    return {
      mapLoaded: false,
      maplayer: {
        black: undefined,
        blackMark: undefined,
        img: undefined,
        river: undefined,
        roadnet: undefined,
        greenway: undefined,
      },
      hubShow: true,
    };
  },
  components: {
    LayerHub,
    Search,
    Legend,
    TopicHub,
    SpaceTool,
    NamePopup,
    CommonDetailPopup,
    ProjectDetailPopup,
    TopicPopup,
  },
  created() {
    // 点位信息 hash
    window.featureMap = {};
    // 点位icon hash
    window.billboardMap = {};
    // 点位浅色label hash
    window.whiteLabelMap = {};
    // 点位深色label hash
    window.blackLabelMap = {};
  },
  async mounted() {
    this.eventRegsiter();

    await this.init3DMap(() => {
      this.mapLoaded = true;

      this.initPostRender();
      this.initHandler();
      this.createEntityCollection();
    });
  },
  destroyed() {
    // 路由切换，组件销毁，清空store十二景
    this.setSejList([]);
  },
  methods: {
    ...mapActions("decision", ["setSourceMap", "setSejList"]),
    async init3DMap(fn) {
      window.earth = new Cesium.Viewer("cesiumContainer", {
        infoBox: false,
        selectionIndicator: false,
        shadows: false,
      });

      // 地图初始配置
      initMapConfig();

      // 大数据风格底图
      this.maplayer.black = addMapImgLayer(ServiceUrl.BDIMG);

      // 大数据风格注记
      this.maplayer.blackMark = addMapImgLayer(ServiceUrl.BDIMGMARK);
      this.maplayer.blackMark.alpha = 0.9;

      // 塘河
      this.maplayer.river = addRiverLayer();
      // 相机视角初始化
      initCamera();

      fn && fn();
    },

    // 点位渲染
    initPostRender() {
      window.earth.scene.postRender.addEventListener(() => {
        if (!window.earth || !this.mapLoaded || !Object.keys(this.$refs).length)
          return;

        // 十二景名称点位
        if (this.$refs.NamePopup) {
          this.$refs.NamePopup.fixPopup();
        }
      });
    },

    initHandler() {
      const that = this;
      this.handler = new Cesium.ScreenSpaceEventHandler(
        window.earth.scene.canvas
      );
      // 监听左键点击事件
      this.handler.setInputAction((e) => {
        const pick = window.earth.scene.pick(e.position);
        if (!pick || !pick.id) {
          cleanLocationIcon();
          return;
        }
        if (typeof pick.id == "string") {
          const [_TYPE_, _SMID_, _NODEID_] = pick.id.split("@");

          if (~["label", "billboard"].indexOf(_TYPE_)) {
            const feature = window.featureMap[_NODEID_][_SMID_];

            // 定位图标
            const geometry = feature.geometry;
            addLocationIcon(geometry, _NODEID_);

            this.$refs.Search.results = [];
            this.$refs.Search.resultShow = false;
            if (~_NODEID_.indexOf("项目") || _NODEID_ == "绿道断点") {
              this.$refs.ProjectDetailPopup.isSearch = false;
              this.$refs.ProjectDetailPopup.getForceEntity({ ...feature });
              this.$refs.CommonDetailPopup.closeInfo();
            } else {
              this.$refs.CommonDetailPopup.isSearch = false;
              this.$refs.CommonDetailPopup.getForceEntity({ ...feature });
              this.$refs.ProjectDetailPopup.closeInfo();
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },

    eventRegsiter() {
      // 地图切换
      this.$bus.$off("decision-layer-change");
      this.$bus.$on("decision-layer-change", ({ value }) => {
        if (value == "vector") {
          this.maplayer.black && (this.maplayer.black.show = true);
          this.maplayer.blackMark && (this.maplayer.blackMark.show = true);
          this.maplayer.img && (this.maplayer.img.show = false);
          this.maplayer.roadnet && (this.maplayer.roadnet.show = false);
        } else if (value == "img") {
          this.maplayer.black && (this.maplayer.black.show = false);
          this.maplayer.blackMark && (this.maplayer.blackMark.show = false);
          this.maplayer.img
            ? (this.maplayer.img.show = true)
            : (this.maplayer.img = addMapImgLayer(ServiceUrl.TDTIMG));
          this.maplayer.roadnet
            ? (this.maplayer.roadnet.show = true)
            : (this.maplayer.roadnet = addMapImgLayer(ServiceUrl.ROADNET));

          window.earth.imageryLayers.lowerToBottom(this.maplayer.roadnet);
          window.earth.imageryLayers.lowerToBottom(this.maplayer.img);
        } else if (value == "reset") {
          resetCamera();
        }
      });

      this.$bus.$off("decision-greenway-change");
      this.$bus.$on("decision-greenway-change", ({ value }) => {
        if (value) {
          this.maplayer.greenway
            ? (this.maplayer.greenway.show = true)
            : (this.maplayer.greenway = addGreenwayLayer());
        } else {
          this.maplayer.greenway && (this.maplayer.greenway.show = false);
        }
      });
    },

    // 创建datasource
    createEntityCollection() {
      // 定位
      const locationEntityCollection = new Cesium.CustomDataSource("location");
      window.earth.dataSources.add(locationEntityCollection);
    },
  },
};
</script>

<style lang="less" scoped>
.cesiumMap {
  width: 100%;
  height: 100%;

  #cesiumContainer {
    width: 100%;
    height: 100%;
  }
}
</style>