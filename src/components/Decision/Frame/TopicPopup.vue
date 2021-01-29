<template>
  <div
    :class="`topic-popup animated ${
      !infoShow ? `slideOutRight` : `slideInRight`
    }`"
  >
    <i
      v-show="!infoShow && currentIndex != null"
      class="popup-open"
      @click="toggle"
    ></i>
    <div class="popup-body" v-show="infoShow">
      <div class="tab-pane">
        <div
          v-for="(item, index) in fixTabList"
          :key="index"
          class="tab-pane-item"
          :class="{ active: currentIndex == index }"
          :style="{ 'z-index': tabList.length - index }"
          @click="changeTab(item, index)"
          v-show="item.show"
        >
          <span>{{ item.label }}</span>
        </div>
      </div>
      <div class="tab-body">
        <i class="popup-close" @click="toggle" />
        <TopicSub1 v-if="currentIndex == 0" />
        <TopicSub2 v-if="currentIndex == 1" />
        <TopicSub3 v-if="currentIndex == 2" />
        <TopicSub4 v-if="currentIndex == 3" />
      </div>
    </div>
  </div>
</template>

<script>
import { deepClone } from "@/common/js/util";
import TopicSub1 from "./TopicSub/TopicSub1";
import TopicSub2 from "./TopicSub/TopicSub2";
import TopicSub3 from "./TopicSub/TopicSub3";
import TopicSub4 from "./TopicSub/TopicSub4";
export default {
  data() {
    return {
      tabList: [
        {
          id: "滞后项目",
          label: "滞后项目",
          show: false,
        },
        {
          id: "问题项目",
          label: "问题项目",
          show: false,
        },
        {
          id: "项目分布",
          label: "项目分布",
          show: false,
        },
        {
          id: "投资分布",
          label: "投资分布",
          show: false,
        },
      ],
      currentIndex: null,
      infoShow: false,

      WarningTabShow: false,
      InvestTabShow: false,
    };
  },

  computed: {
    fixTabList() {
      let list = deepClone(this.tabList);

      list[0].show = this.WarningTabShow;
      list[1].show = this.WarningTabShow;

      list[2].show = this.InvestTabShow;
      list[3].show = this.InvestTabShow;

      return list;
    },
  },

  components: { TopicSub1, TopicSub2, TopicSub3, TopicSub4 },
  methods: {
    // 面板切换
    changeTab(item, index) {
      this.currentIndex = index;
    },

    // 面板开关
    toggle() {
      this.infoShow = !this.infoShow;
    },

    // 控制显示
    setTabList(typeId, show) {
      if (typeId == "进度预警") {
        this.WarningTabShow = show;

        if (show) {
          this.currentIndex = 0;
          this.infoShow = true;
        } else if (this.InvestTabShow) {
          ~[0, 1].indexOf(this.currentIndex) && (this.currentIndex = 2);
        }
      } else if (typeId == "项目投资") {
        this.InvestTabShow = show;

        if (show) {
          this.currentIndex = 2;
          this.infoShow = true;
        } else if (this.WarningTabShow) {
          ~[2, 3].indexOf(this.currentIndex) && (this.currentIndex = 0);
        }
      }
    },

    // 筛选地图元素
    filterData(array) {
      window.billboardMap["项目"]._billboards.forEach((v) => {
        v.show = false;
        array.forEach((item) => {
          if (v.id == `billboard@${item.attributes.SMID}@项目`) {
            v.show = true;
          }
        });
      });
      window.whiteLabelMap["项目"]._labels.forEach((v) => {
        v.show = false;
        array.forEach((item) => {
          if (v.id == `label@${item.attributes.SMID}@项目`) {
            v.show = true;
          }
        });
      });
    },
  },

  watch: {
    fixTabList: {
      handler(n, o) {
        const showList = [...new Set(n.map((item) => item.show))];

        // 无tab显示，则隐藏面板
        if (showList.length == 1 && showList[0] == false) {
          this.infoShow = false;
          this.currentIndex = null;
        }
      },
      deep: true,
    },

    infoShow: {
      handler(n, o) {
        // 控制图层按钮、图例显隐
        this.$parent.hubShow = !n;
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
.topic-popup {
  display: flex;
  position: fixed;
  top: 9.81vh;
  bottom: 9.06vh;
  right: 3.45vh;
  z-index: 1999;

  .popup-open {
    width: 4.2vh;
    height:  4.2vh;
    background-image: url("~@/assets/images/detail/topic-popup-open.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    z-index: 99;
  }

  .popup-body {
    display: flex;

    .tab-pane {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      color: #fff;

      .tab-pane-item {
        position: relative;
        box-sizing: border-box;
        padding: 2.44vh 0.43vh 2.81vh 1.1vh;
        margin-bottom: -1.2vh;
        color: #83aeff;
        cursor: pointer;
        perspective: 10vh;

        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #002c83;
          box-shadow: 0vh 0.13vh 0.5vh 0vh rgba(0, 0, 0, 0.46);
          transform-origin: 100% 0 0;
          transform: rotateY(-30deg);
          z-index: -1;
        }

        > span {
          display: block;
          width: 1.5vh;
          font-family: PingFang;
          font-size: 1.25vh;
          line-height: 1.38vh;
        }

        &.active {
          font-weight: 600;
          color: #fff;
          padding: 2.69vh 0.94vh 2.63vh 1.54vh;
          z-index: 10 !important;

          &::before {
            background-color: #165fea;
            transform: rotateY(-20deg);
          }
        }
      }
    }

    .tab-body {
      width: 35.63vh;
      height: 100%;
      position: relative;

      .popup-close {
        width: 1.65vh;
        height: 1.65vh;
        position: absolute;
        top: 1.25vh;
        right: 1.25vh;
        background-image: url("~@/assets/images/detail/topic-popup-close.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
        z-index: 99;
      }
    }
  }
}
</style>