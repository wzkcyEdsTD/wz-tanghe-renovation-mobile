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
        img: undefined,
        river: undefined,
        roadnet: undefined,
        greenway: undefined,
      },
      hubShow: true,
    };
  },
  computed: {
    ...mapGetters("decision", ["bufferFlag"]),
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
      this.handler.setInputAction(async (e) => {
        const pick = window.earth.scene.pick(e.position);

        // 判断是否开启周边查询
        if (this.bufferFlag) {
          const scene = window.earth.scene;
          const ellipsoid = scene.globe.ellipsoid;
          const cartesian3 = window.earth.scene.pickPosition(e.position);
          const cartographic = ellipsoid.cartesianToCartographic(cartesian3);
          const lat = Cesium.Math.toDegrees(cartographic.latitude);
          const lng = Cesium.Math.toDegrees(cartographic.longitude);
          const geometry = new SuperMap.Geometry.Point(lng, lat);

          window.earth.scene.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
              geometry.x,
              geometry.y,
              1200
            ),
            orientation: {
              heading: 0.01768860454315663,
              pitch: Cesium.Math.toRadians(-90),
              roll: 0,
            },
          });

          this.drawBuffer(geometry);
          const res = await this.bufferQuery(geometry);
          this.$bus.$emit("change-around-chart", { result: res });
          return;
        }

        if (!pick || !pick.id) {
          cleanLocationIcon();
          return;
        }
        if (typeof pick.id == "string") {
          const [_TYPE_, _SMID_, _NODEID_] = pick.id.split("@");

          if (~["label", "billboard"].indexOf(_TYPE_)) {
            if (_NODEID_ != "supervise") {
              const feature = window.featureMap[_NODEID_][_SMID_];
              const geometry = feature.geometry;

              // 定位图标
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
            } else {
              const feature = window.featureMap[_NODEID_][_SMID_];
              this.$bus.$emit("set-supervise", { feature });

              // console.log(feature);
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
          this.maplayer.img && (this.maplayer.img.show = false);
          this.maplayer.roadnet && (this.maplayer.roadnet.show = false);
        } else if (value == "img") {
          this.maplayer.black && (this.maplayer.black.show = false);
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

    // 画缓冲区
    drawBuffer(geometry) {
      // 清除原有图形
      this.removeBuffer();
      const { x, y } = geometry;

      const datasource = window.earth.dataSources.getByName("buffer")[0];
      const circleEntity = new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(x, y, 0),
        ellipse: {
          semiMinorAxis: 200,
          semiMajorAxis: 200,
          height: 0,
          material: Cesium.Color.fromCssColorString("#A0F4FF").withAlpha(0.6),
          outline: true,
          outlineWidth: 4,
          outlineColor: Cesium.Color.WHITE,
        },
        id: "circle",
      });
      datasource.entities.add(circleEntity);

      const pointEntity = new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(x, y, 0),
        billboard: {
          image: `/libs/images/map-ico/buffer-point.png`,
          width: 40,
          height: 40,
          scaleByDistance: new Cesium.NearFarScalar(3000, 1.5, 6000, 1.2),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        id: "point",
      });
      datasource.entities.add(pointEntity);
    },

    // 移除缓冲区
    removeBuffer() {
      const datasource = window.earth.dataSources.getByName("buffer")[0];
      datasource.entities.removeAll();
    },

    // 周边查询
    bufferQuery(geometry) {
      return new Promise((resolve, reject) => {
        const getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByBufferService(
          ServiceUrl.FEATUREMVT,
          {
            eventListeners: {
              processCompleted: (data) => {
                data && resolve(data);
              },
              processFailed: (err) => reject(err),
            },
          }
        );

        getFeaturesByGeometryService.processAsync(
          new SuperMap.REST.GetFeaturesByBufferParameters({
            // 缓冲距离单位疑似十万米！！！图形单位米！！！
            bufferDistance: 0.002,
            datasetNames: ["thxm2:wz_jd"],
            geometry,
            returnContent: true,
            toIndex: -1,
          })
        );
      });
    },

    // 创建datasource
    createEntityCollection() {
      // 定位
      const locationEntityCollection = new Cesium.CustomDataSource("location");
      window.earth.dataSources.add(locationEntityCollection);

      // 周边查询
      const bufferEntityCollection = new Cesium.CustomDataSource("buffer");
      window.earth.dataSources.add(bufferEntityCollection);
    },
  },

  watch: {
    bufferFlag(val) {
      if (!val) {
        this.removeBuffer();
      }
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