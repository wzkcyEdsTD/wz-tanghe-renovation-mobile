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
        <ul class="children-list" v-show="item.check && item.children">
          <li
            class="children-item"
            :class="{ active: child.check }"
            v-for="(child, index) in item.children"
            :key="index"
            @click.stop="childClick(child, item.children)"
          >
            {{ child.label }}
          </li>
        </ul>
      </div>
    </div>

    <Supervise ref="Supervise" v-show="superviseShow" />
    <Around v-show="aroundShow" />
    <Analyze v-if="analyzeShow" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { ServiceUrl, ServerDatasource, LayerList } from "@/config/mapConfig";
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
          // doFun: "cityplanningHandle",
          // children: ["用地现状", "用地性规划", "用地分析", "2020贯通绿道"],
          children: [
            {
              label: "用地现状",
              check: false,
            },
            {
              label: "用地性规划",
              check: false,
            },
            {
              label: "用地分析",
              check: false,
            },
            {
              label: "2020贯通绿道",
              check: false,
            },
          ],
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
        {
          id: "一键清除",
          label: "一键清除",
          icon: "清除",
          check: false,
        }
      ],
      topicLayer: {
        greening: undefined,
        greeningLine: undefined,
        cityplanning: undefined,
        ydxz: undefined,
        ydfx: undefined,
        ld2020: undefined,
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

    closeAllLayer() {
      this.topicLayer.cityplanning && (this.topicLayer.cityplanning.show = false);
      this.topicLayer.ydxz && (this.topicLayer.ydxz.show = false);
      this.topicLayer.ydfx && (this.topicLayer.ydfx.show = false);
      this.topicLayer.ld2020 && (this.topicLayer.ld2020.show = false);
    },

    // 专题事件
    topicChange(item) {
      if (item.id == '一键清除') {
        this.topicList.forEach(topic => {
          topic.check = false
          topic.doFun && this[topic.doFun](topic);
        })
        this.closeAllLayer()
        return
      }

      if (!("check" in item)) return;
      item.check = !item.check;

      if (!item.children) {
        // 调用对应handle
        item.doFun && this[item.doFun](item);
      } else {
        if (item.id == '城市规划' && !item.check) {
          this.closeAllLayer()
          item.children.forEach((child) => {
            child.check = false;
          });
        }
      }
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
    // cityplanningHandle({ check }) {
    //   if (!check) {
    //     this.topicLayer.cityplanning &&
    //       (this.topicLayer.cityplanning.show = false);
    //   } else {
    //     this.topicLayer.cityplanning
    //       ? (this.topicLayer.cityplanning.show = true)
    //       : (this.topicLayer.cityplanning = addMapImgLayer(
    //           ServiceUrl.CITYPLANNING
    //         ));
    //     this.topicLayer.cityplanning.alpha = 0.8;
    //   }
    // },

    // 领导督办
    superviseHandle({ check }) {
      // !check && (this.superviseShow = false);
      if (check && this.topicList[0].check) {
        this.topicList[0].check = false
        this.warningHandle(this.topicList[0])
      }

      window.billboardMap["项目"]._billboards.map((v) => (v.show = false));
      if (!check) {
        this.superviseShow = false;
        if (LayerList[1].check && !this.topicList[0].check) {
          window.billboardMap["项目"]._billboards.map((v) => (v.show = true));
        }
      }
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
      if (obj.check && this.topicList[4].check) {
        this.topicList[4].check = false
        this.superviseHandle(this.topicList[4])
      }
      this.$parent.$refs.TopicPopup.setTabList(obj.id, obj.check);
    },

    // 项目投资
    investHandle(obj) {
      this.$parent.$refs.TopicPopup.setTabList(obj.id, obj.check);
    },

    childClick(item, list) {
      // if (!("check" in item)) return;
      this.topicLayer.cityplanning && (this.topicLayer.cityplanning.show = false);
      this.topicLayer.ydxz && (this.topicLayer.ydxz.show = false);
      this.topicLayer.ydfx && (this.topicLayer.ydfx.show = false);
      this.topicLayer.ld2020 && (this.topicLayer.ld2020.show = false);
      if (item.check) {
        list.forEach((item) => {
          item.check = false;
          if (item.label == '2020贯通绿道') {
            this.$bus.$emit("decision-greenway-change", {
              value: true,
            });
          }
        });
      } else {
        list.forEach((item) => {
          item.check = false;
        });
        item.check = !item.check;
        if (item.label == "用地现状") {
          this.topicLayer.ydxz
            ? (this.topicLayer.ydxz.show = true)
            : (this.topicLayer.ydxz = addMapImgLayer(ServiceUrl.YDXZ));
          this.topicLayer.ydxz.alpha = 0.8;
        }
        if (item.label == "用地性规划") {
          this.topicLayer.cityplanning
            ? (this.topicLayer.cityplanning.show = true)
            : (this.topicLayer.cityplanning = addMapImgLayer(
                ServiceUrl.CITYPLANNING
              ));
          this.topicLayer.cityplanning.alpha = 0.8;
        }
        if (item.label == "用地分析") {
          this.topicLayer.ydfx
            ? (this.topicLayer.ydfx.show = true)
            : (this.topicLayer.ydfx = addMapImgLayer(ServiceUrl.YDFX));
          this.topicLayer.ydfx.alpha = 0.8;
        }
        if (item.label == "2020贯通绿道") {
          this.topicLayer.ld2020
            ? (this.topicLayer.ld2020.show = true)
            : (this.topicLayer.ld2020 = addMapImgLayer(ServiceUrl.LD2020));
          this.$bus.$emit("decision-greenway-change", {
            value: false,
          });
        }
      }
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
  watch: {
    topicList: {
      handler(newVal, oldVal) {
        if (oldVal && !newVal[0].check && !newVal[4].check) {
          window.billboardMap["项目"]._billboards.map((v) => (v.show = true));
          window.whiteLabelMap["项目"].setAllLabelsVisible(true);
        }
      },
      immediate: true,
      deep: true
    }
  }
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
      position: relative;
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

      .children-list {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 105%;
        padding: 0 7px;
        width: 80%;
        background-color: rgba(15, 77, 216, 0.5);
        border-radius: 10px;
        .children-item {
          font-size: 1.2vh;
          margin: 10px 0;
          color: #fff;
          &.active {
            color: #00e2ff;
          }
        }
      }

      &:not(:last-child) {
        margin-right: 2.5vh;
      }
    }
  }
}
</style>