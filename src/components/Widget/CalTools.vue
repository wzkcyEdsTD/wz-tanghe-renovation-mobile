<template>
  <div class="cal-tools"></div>
</template>
<script>
export default {
  data() {
    return {
      clampMode: 0,
      analyzeActive: false,
    };
  },
  created() {
    // 空间分析工具
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

    //  面分析
    gaugeAreaAnalyze() {
      this.deactiveAll();
      window.handlerAreaAnalyze && window.handlerAreaAnalyze.activate();
    },

    //  清除分析结果
    clearGauge() {
      window.handlerAreaAnalyze && window.handlerAreaAnalyze.clear();
    },

    // 关闭所有量测处理器
    deactiveAll() {
      window.handlerAreaAnalyze && window.handlerAreaAnalyze.deactivate();
    },

    // 绘面查询
    fetchFromDataSets(geometry) {
      return new Promise((resolve, reject) => {
        const getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
          "http://172.168.3.183:8090/iserver/services/data-alldata/rest/data",
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
            datasetNames: ["172.168.3.181_thxm_manage:th_spatial_query"],
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

