<template>
  <div class="cal-tools"></div>
</template>
<script>
import { ServiceUrl } from "@/config/mapConfig";
export default {
  data() {
    return {
      clampMode: 0,
      analyzeActive: false,
    };
  },
  created() {
    // 测距
    window.handlerDis = new Cesium.MeasureHandler(
      window.earth,
      Cesium.MeasureMode.Distance,
      this.clampMode
    );

    // 测面
    window.handlerArea = new Cesium.MeasureHandler(
      window.earth,
      Cesium.MeasureMode.Area,
      this.clampMode
    );

    // 空间分析
    window.handlerAreaAnalyze = new Cesium.MeasureHandler(
      window.earth,
      Cesium.MeasureMode.Area,
      this.clampMode
    );
  },
  mounted() {
    this.eventRegsiter();
  },
  beforeDestroy() {
    this.clearGauge();
  },
  methods: {
    //  事件绑定
    eventRegsiter() {
      // 测距
      window.handlerDis.measureEvt.addEventListener((result) => {
        const dis = Number(result.distance);
        const positions = result.positions;
        const distance =
          dis > 1000 ? (dis / 1000).toFixed(2) + "km" : dis.toFixed(2) + "m";
        window.handlerDis.disLabel.text = "距离:" + distance;
      });

      window.handlerDis.activeEvt.addEventListener((isActive) => {
        if (isActive == true) {
          window.earth.enableCursorStyle = false;
          window.earth._element.style.cursor = "";
        } else {
          window.earth.enableCursorStyle = true;
        }
      });

      // 测面
      window.handlerArea.measureEvt.addEventListener((result) => {
        const mj = Number(result.area);
        const positions = result.positions;
        const area =
          mj > 1000000
            ? (mj / 1000000).toFixed(2) + "km²"
            : mj.toFixed(2) + "㎡";
        window.handlerArea.areaLabel.text = "面积:" + area;
      });
      window.handlerArea.activeEvt.addEventListener((isActive) => {
        if (isActive == true) {
          window.earth.enableCursorStyle = false;
          window.earth._element.style.cursor = "";
        } else {
          window.earth.enableCursorStyle = true;
        }
      });

      // 空间分析
      window.handlerAreaAnalyze.measureEvt.addEventListener(async (result) => {
        if (!this.analyzeActive) {
          const scene = window.earth.scene;
          const ellipsoid = scene.globe.ellipsoid;
          const positions = result.positions;
          const points = [];

          positions.forEach((item) => {
            const cartesian3 = new Cesium.Cartesian3(item.x, item.y, item.z);
            const cartographic = ellipsoid.cartesianToCartographic(cartesian3);
            const lat = Cesium.Math.toDegrees(cartographic.latitude);
            const lng = Cesium.Math.toDegrees(cartographic.longitude);
            points.push(new SuperMap.Geometry.Point(lng, lat));
          });

          const linearRings = new SuperMap.Geometry.LinearRing(points);
          const region = new SuperMap.Geometry.Polygon([linearRings]);
          const res = await this.fetchFromDataSets(region);

          this.$bus.$emit("areaAnalyze", { result: res });
        }
      });

      window.handlerAreaAnalyze.activeEvt.addEventListener((isActive) => {
        if (isActive == true) {
          this.analyzeActive = true;
          window.earth.enableCursorStyle = false;
          window.earth._element.style.cursor = "";
        } else {
          this.analyzeActive = false;
          window.earth.enableCursorStyle = true;
        }
      });
    },

    // 测距
    gaugeDistance() {
      this.deactiveAll();
      window.handlerDis && window.handlerDis.activate();
    },

    // 测面
    gaugeArea() {
      this.deactiveAll();
      window.handlerArea && window.handlerArea.activate();
    },

    //  面分析
    gaugeAreaAnalyze() {
      this.deactiveAll();
      window.handlerAreaAnalyze && window.handlerAreaAnalyze.activate();
    },

    //  清除分析结果
    clearGauge() {
      this.deactiveAll();
      window.handlerDis && window.handlerDis.clear();
      window.handlerArea && window.handlerArea.clear();
      window.handlerAreaAnalyze && window.handlerAreaAnalyze.clear();
    },

    // 关闭所有量测处理器
    deactiveAll() {
      window.handlerDis && window.handlerDis.deactivate();
      window.handlerArea && window.handlerArea.deactivate();
      window.handlerAreaAnalyze && window.handlerAreaAnalyze.deactivate();
    },

    // 绘面查询
    fetchFromDataSets(geometry) {
      return new Promise((resolve, reject) => {
        const getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
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
          new SuperMap.REST.GetFeaturesByGeometryParameters({
            datasetNames: [`${ServerDatasource}th_spatial_query`],
            geometry,
            toIndex: -1,
          })
        );
      });
    },
  },
};
</script>
<style lang="less" scoped>
</style>

