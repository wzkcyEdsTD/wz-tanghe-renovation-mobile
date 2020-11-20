<template>
  <div class="cesiumMap">
    <div id="cesiumContainer"></div>
    <div v-if="mapLoaded">
      <LayerHub ref="LayerHub" />
      <Search ref="Search" />
      <CommonDetailPopup ref="CommonDetailPopup" />
      <ProjectDetailPopup ref="ProjectDetailPopup" />
      <NamePopup ref="NamePopup" />
      <Legend ref="Legend" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { ServiceUrl } from "@/config/mapConfig";
import {
  initMapConfig,
  addGDLayer,
  addRiverLayer,
  addGreenwayLayer,
  initCamera,
  resetCamera,
  addLocationIcon,
  cleanLocationIcon,
} from "./cesium_map_init";

import LayerHub from "@/components/SourceLayer/MapTools/LayerHub";
import Search from "@/components/SourceLayer/MapTools/Search";
import Legend from "@/components/SourceLayer/MapTools/Legend";
import NamePopup from "@/components/SourceLayer/Frame/NamePopup";
import CommonDetailPopup from "@/components/SourceLayer/Frame/CommonDetailPopup";
import ProjectDetailPopup from "@/components/SourceLayer/Frame/ProjectDetailPopup";

export default {
  data() {
    return {
      mapLoaded: false,
      maplayer: {
        river: undefined,
        white: undefined,
        img: undefined,
        roadnet: undefined,
        greenway: undefined,
      },
    };
  },
  components: {
    LayerHub,
    Search,
    Legend,
    NamePopup,
    CommonDetailPopup,
    ProjectDetailPopup,
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
  methods: {
    ...mapActions("map", ["setSourceMap", "setSejList"]),
    async init3DMap(fn) {
      window.earth = new Cesium.Viewer("cesiumContainer", {
        infoBox: false,
        selectionIndicator: false,
        shadows: false,
      });

      // 地图初始配置
      initMapConfig();
      // 矢量图叠加
      this.maplayer.white = addGDLayer({
        url: ServiceUrl.GDVEC,
        layer: "GDVectorLayer",
      });
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
      this.$bus.$off("map-layer-change");
      this.$bus.$on("map-layer-change", ({ value }) => {
        if (value == "vector") {
          this.maplayer.white && (this.maplayer.white.show = true);
          this.maplayer.img && (this.maplayer.img.show = false);
          this.maplayer.roadnet && (this.maplayer.roadnet.show = false);
        } else if (value == "img") {
          this.maplayer.white && (this.maplayer.white.show = false);
          this.maplayer.img
            ? (this.maplayer.img.show = true)
            : (this.maplayer.img = addGDLayer({
                url: ServiceUrl.GDIMG,
                layer: "GDImgLayer",
              }));

          this.maplayer.roadnet
            ? (this.maplayer.roadnet.show = true)
            : (this.maplayer.roadnet = addGDLayer({
                url: ServiceUrl.GDROADNET,
                layer: "GDRoadnetLayer",
              }));

          window.earth.imageryLayers.lowerToBottom(this.maplayer.roadnet);
          window.earth.imageryLayers.lowerToBottom(this.maplayer.img);
        } else if (value == "reset") {
          resetCamera();
        }
      });

      this.$bus.$off("map-greenway-change");
      this.$bus.$on("map-greenway-change", ({ value }) => {
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