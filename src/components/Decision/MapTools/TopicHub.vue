<template>
  <div class="topichub">
    <div class="topichub-list">
      <div
        v-for="(item, index) in topicList"
        :key="index"
        class="topic-item"
        @click="topicChange(item)"
      >
        <img
          :src="
            require(`@/assets/images/topichub/${
              item.check ? `${item.icon}高亮` : `${item.icon}`
            }@2x.png`)
          "
        />
        <span :class="{ active: item.check }">{{ item.label }}</span>
      </div>
    </div>

    <Supervise ref="Supervise" v-show="superviseShow" />
    <Around v-show="aroundShow" />
    <Analyze v-if="analyzeShow" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { ServiceUrl, ServerDatasource } from "@/config/mapConfig";
import { addMapImgLayer } from "@/components/Decision/cesium_map_init";

import Supervise from "@/components/Decision/Frame/TopicSub/Supervise";
import Around from "@/components/Decision/Frame/TopicSub/Around";
import Analyze from "@/components/Decision/Frame/TopicSub/Analyze";

export default {
  data() {
    return {
      topicList: [
        {
          id: "进度预警",
          label: "进度预警专题",
          icon: "进度预警专题",
          check: false,
          doFun: "warningHandle",
        },
        {
          id: "项目投资",
          label: "项目投资专题",
          icon: "项目投资专题",
          check: false,
          doFun: "investHandle",
        },
        {
          id: "绿化覆盖",
          label: "绿化覆盖专题",
          icon: "绿化覆盖专题",
          check: false,
          doFun: "greeningHandle",
        },
        {
          id: "城市规划",
          label: "城市规划专题",
          icon: "城市规划专题",
          check: false,
          doFun: "cityplanningHandle",
        },
        {
          id: "领导督办",
          label: "领导督办专题",
          icon: "领导督办专题",
          check: false,
          doFun: "superviseHandle",
        },
        {
          id: "周边活跃度",
          label: "周边活跃度分析",
          icon: "周边活跃度分析",
          check: false,
          doFun: "aroundHandle",
        },
        {
          id: "考核分析",
          label: "考核分析",
          icon: "考核分析",
          check: false,
          doFun: "analyzeHandle",
        },
      ],
      topicLayer: {
        greening: undefined,
        greeningLine: undefined,
        cityplanning: undefined,
      },

      superviseShow: false,
      aroundShow: false,
      analyzeShow: false,
    };
  },

  components: { Supervise, Around, Analyze },

  mounted() {
    this.eventRegsiter();
  },

  methods: {
    ...mapActions("decision", ["setBufferFlag"]),

    //  事件绑定
    eventRegsiter() {
      this.$bus.$off("set-supervise");
      this.$bus.$on("set-supervise", ({ feature }) => {
        // console.log(feature);
        this.superviseShow = true;
        this.$refs.Supervise.fixData(feature);
      });
    },

    // 专题事件
    topicChange(item) {
      if (!("check" in item)) return;
      item.check = !item.check;

      // 调用对应handle
      item.doFun && this[item.doFun](item);
    },

    // 绿化覆盖
    greeningHandle({ check }) {
      if (!check) {
        this.topicLayer.greening && (this.topicLayer.greening.show = false);
        this.topicLayer.greeningLine &&
          (this.topicLayer.greeningLine.show = false);
      } else {
        this.topicLayer.greening
          ? (this.topicLayer.greening.show = true)
          : (this.topicLayer.greening = addMapImgLayer(ServiceUrl.GREENING));
        this.topicLayer.greening.alpha = 0.6;
        this.topicLayer.greeningLine
          ? (this.topicLayer.greeningLine.show = true)
          : (this.topicLayer.greeningLine = addMapImgLayer(
              ServiceUrl.GREENING_LINE
            ));
      }
    },

    // 城市规划
    cityplanningHandle({ check }) {
      if (!check) {
        this.topicLayer.cityplanning &&
          (this.topicLayer.cityplanning.show = false);
      } else {
        this.topicLayer.cityplanning
          ? (this.topicLayer.cityplanning.show = true)
          : (this.topicLayer.cityplanning = addMapImgLayer(
              ServiceUrl.CITYPLANNING
            ));
        this.topicLayer.cityplanning.alpha = 0.8;
      }
    },

    // 领导督办
    superviseHandle({ check }) {
      !check && (this.superviseShow = false);
      if (window.billboardMap["supervise"]) {
        window.billboardMap["supervise"]._billboards.map(
          (v) => (v.show = check)
        );
      } else if (check && !window.billboardMap["supervise"]) {
        this.addProjectLayer();
      }
    },

    // 周边活跃度分析
    aroundHandle({ check }) {
      this.setBufferFlag(check);
      !check && (this.aroundShow = false);
    },

    // 考核分析
    analyzeHandle({ check }) {
      this.analyzeShow = check;
    },

    // 进度预警
    warningHandle(obj) {
      this.$parent.$refs.TopicPopup.setTabList(obj.id, obj.check);
    },

    // 项目投资
    investHandle(obj) {
      this.$parent.$refs.TopicPopup.setTabList(obj.id, obj.check);
    },

    // 添加项目图层
    async addProjectLayer() {
      const { result } = await this.fetchProjectData();
      window.billboardMap["supervise"] = window.earth.scene.primitives.add(
        new Cesium.BillboardCollection()
      );

      const forceDrawFeatures = result.features;
      forceDrawFeatures.map((item) => {
        !window.featureMap["supervise"] &&
          (window.featureMap["supervise"] = {});
        window.featureMap["supervise"][item.attributes.SMID] = {
          name:
            item.attributes.SHORT_NAME ||
            item.attributes.NAME ||
            item.attributes.MC ||
            item.attributes.JC,
          attributes: item.attributes,
          geometry: item.geometry,
          type: "supervise",
        };

        const position = Cesium.Cartesian3.fromDegrees(
          item.geometry.x,
          item.geometry.y,
          4
        );

        window.billboardMap["supervise"].add({
          id: `billboard@${item.attributes.SMID}@supervise`,
          image: `/libs/images/map-ico/${item.attributes.STATUS.trim()}-问题.png`,
          width: 34,
          height: 34,
          scaleByDistance: new Cesium.NearFarScalar(500, 1.5, 6000, 1),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          position,
        });
      });
    },

    // 获取项目数据
    fetchProjectData() {
      return new Promise((resolve, reject) => {
        const getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(
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
        getFeatureBySQLService.processAsync(
          new SuperMap.REST.GetFeaturesBySQLParameters({
            queryParameter: new SuperMap.REST.FilterParameter({
              attributeFilter: "",
            }),
            toIndex: -1,
            datasetNames: [`${ServerDatasource}th_spatial_project_view`],
          })
        );
      });
    },
  },
};
</script>

<style lang="less" scoped>
.topichub {
  .topichub-list {
    position: fixed;
    bottom: 4.06vh;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    z-index: 99;

    .topic-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;

      img {
        width: 8.26vh;
        height: 8.26vh;
      }

      span {
        font-family: PingFang;
        font-size: 1.5vh;
        color: #c3c3c3;
        text-shadow: 0vh 0vh 0.16vh rgba(0, 0, 0, 0.4);
        margin-top: 0.88vh;

        &.active {
          color: #00e2ff;
        }
      }

      &:not(:last-child) {
        margin-right: 2.5vh;
      }
    }
  }
}
</style>