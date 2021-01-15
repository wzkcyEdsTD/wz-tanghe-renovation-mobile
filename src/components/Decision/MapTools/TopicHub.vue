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

    <Supervise v-show="superviseShow" />
    <Around v-show="aroundShow" />
    <Analyze v-if="analyzeShow" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { ServiceUrl } from "@/config/mapConfig";
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
        },
        {
          id: "项目投资",
          label: "项目投资专题",
          icon: "项目投资专题",
          check: false,
        },
        {
          id: "绿化覆盖",
          label: "绿化覆盖专题",
          icon: "绿化覆盖专题",
          check: false,
        },
        {
          id: "城市规划",
          label: "城市规划专题",
          icon: "城市规划专题",
          check: false,
        },
        {
          id: "领导督办",
          label: "领导督办专题",
          icon: "领导督办专题",
          check: false,
        },
        {
          id: "周边活跃度",
          label: "周边活跃度分析",
          icon: "周边活跃度分析",
          check: false,
        },
        {
          id: "考核分析",
          label: "考核分析",
          icon: "考核分析",
          check: false,
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

  async mounted() {
    // await this.addProjectLayer();
  },

  methods: {
    ...mapActions("decision", ["setBufferFlag"]),
    // 专题事件
    topicChange(item) {
      if (!("check" in item)) return;
      item.check = !item.check;

      if (item.id == "进度预警") {
        this.warningHandle(item);
      } else if (item.id == "项目投资") {
        this.investHandle(item);
      } else if (item.id == "绿化覆盖") {
        this.greeningHandle(item.check);
      } else if (item.id == "城市规划") {
        this.cityplanningHandle(item.check);
      } else if (item.id == "领导督办") {
        this.superviseHandle(item.check);
      } else if (item.id == "周边活跃度") {
        this.aroundHandle(item.check);
      } else if (item.id == "考核分析") {
        this.analyzeHandle(item.check);
      }
    },

    // 绿化覆盖
    greeningHandle(show) {
      if (!show) {
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
    cityplanningHandle(show) {
      if (!show) {
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
    superviseHandle(show) {
      this.superviseShow = show;

      if (show) {
        if (window.billboardMap["supervise"]) {
          window.billboardMap["supervise"]._billboards.map(
            (v) => (v.show = true)
          );
        } else {
          this.addProjectLayer();
        }
      } else {
        if (window.billboardMap["supervise"]) {
          window.billboardMap["supervise"]._billboards.map(
            (v) => (v.show = false)
          );
        }
      }
    },

    // 周边活跃度分析
    aroundHandle(show) {
      this.setBufferFlag(show);
      !show && (this.aroundShow = false);
    },

    // 考核分析
    analyzeHandle(show) {
      this.analyzeShow = show;
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
      console.log(result);

      window.billboardMap["supervise"] = window.earth.scene.primitives.add(
        new Cesium.BillboardCollection()
      );

      const forceDrawFeatures = result.features;
      forceDrawFeatures.map((item) => {
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
            datasetNames: ["172.168.3.181_thxm_manage:th_spatial_project_view"],
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
        width: 6.88vh;
        height: 6.88vh;
      }

      span {
        font-family: PingFang;
        font-size: 1.25vh;
        color: #c3c3c3;
        text-shadow: 0vh 0vh 0.13vh rgba(0, 0, 0, 0.4);
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