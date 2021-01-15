<template>
  <div class="analyze">
    <div class="analyze-header">
      <i class="analyze-close" @click="closeInfo"></i>
      <img class="star-left" src="@/assets/images/map-ico/star-left.png" />
      <img class="star-right" src="@/assets/images/map-ico/star-right.png" />
      <span class="analyze-title">项目评分</span>
      <div class="analyze-select">
        <el-popover
          placement="bottom"
          trigger="click"
          v-model="visible"
          :visible-arrow="false"
          popper-class="analyze-select-pop"
        >
          <ul>
            <li
              v-for="item in deptList"
              :key="item.value"
              :class="{ selected: item.label == currentDept.label }"
              @click="selected(item)"
            >
              <span>{{ item.label }}</span>
            </li>
          </ul>
          <el-input
            slot="reference"
            placeholder="请选择"
            readonly="readonly"
            v-model="currentDept.label"
          >
            <i
              slot="suffix"
              class="el-input__icon input-suffix"
              :class="{ active: visible }"
              @click="$parent.visible = !$parent.visible"
            ></i>
          </el-input>
        </el-popover>
      </div>
    </div>

    <div class="analyze-bg">
      <div class="analyze-row">
        <div class="analyze-item star1">
          <span class="item-num">{{ fixListData.starData.star1 || 0 }}</span>
          <span class="item-unit">个</span>
        </div>
      </div>
      <div class="analyze-row">
        <div class="analyze-item star2">
          <span class="item-num">{{ fixListData.starData.star2 || 0 }}</span>
          <span class="item-unit">个</span>
        </div>
        <div class="analyze-item star3">
          <span class="item-num">{{ fixListData.starData.star3 || 0 }}</span>
          <span class="item-unit">个</span>
        </div>
      </div>
      <div class="analyze-row">
        <div class="analyze-item star4">
          <span class="item-num">{{ fixListData.starData.star4 || 0 }}</span>
          <span class="item-unit">个</span>
        </div>
        <div class="analyze-item star5">
          <span class="item-num">{{ fixListData.starData.star5 || 0 }}</span>
          <span class="item-unit">个</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { countProjectStar } from "@/api/tangheAPI";
export default {
  data() {
    return {
      listData: [
        { label: "鹿城区政府", value: "A02A01", starData: {} },
        { label: "龙湾区政府", value: "A02A03", starData: {} },
        { label: "瓯海区政府", value: "A02A02", starData: {} },
        { label: "瑞安市政府", value: "A02A04", starData: {} },
        { label: "浙南产业区", value: "A02A05", starData: {} },
        { label: "温州城发集团", value: "A02A07", starData: {} },
        { label: "温州现代集团", value: "A02A06", starData: {} },
      ],
      deptList: [
        { label: "鹿城区政府", value: "A02A01" },
        { label: "龙湾区政府", value: "A02A03" },
        { label: "瓯海区政府", value: "A02A02" },
        { label: "瑞安市政府", value: "A02A04" },
        { label: "浙南产业区", value: "A02A05" },
        { label: "温州城发集团", value: "A02A07" },
        { label: "温州现代集团", value: "A02A06" },
      ],
      currentDept: { label: "鹿城区政府", value: "A02A01" },
      visible: false,
    };
  },

  computed: {
    // 筛选数据
    fixListData() {
      return this.listData.find((item) => {
        return item.value == this.currentDept.value;
      });
    },
  },

  async mounted() {
    await this.getProjectList();
  },

  methods: {
    selected(obj) {
      this.visible = false;
      this.currentDept = obj;
    },

    closeInfo() {
      this.$parent.analyzeShow = false;
      this.$parent.topicList[6].check = false;
    },

    // 获取项目列表
    async getProjectList() {
      const { data } = await countProjectStar();
      if (data.code == 200) {
        this.listData.map((item) => {
          data.result.map((v) => {
            if (item.label == v.name) {
              const starData = {};

              // 增加评分数据
              v.countBaseRespList.map(({ name, num }) => {
                name == "1" && (starData["star1"] = num);
                name == "2" && (starData["star2"] = num);
                name == "3" && (starData["star3"] = num);
                name == "4" && (starData["star4"] = num);
                name == "5" && (starData["star5"] = num);
              });

              item.starData = starData;
            }
          });
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.analyze {
  display: flex;
  flex-direction: column;
  width: 50vh;
  height: 38.81vh;
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  z-index: 2999;

  .analyze-header {
    .analyze-close {
      width: 1.44vh;
      height: 1.5vh;
      position: absolute;
      top: -1.2vh;
      right: 0.04vh;
      .bg-image("~@/assets/images/detail/space-result-close");
      cursor: pointer;
      z-index: 99;
    }

    .star-left {
      position: absolute;
      left: 0;
      top: 0;
      width: 5.56vh;
      height: 7.56vh;
    }

    .star-right {
      position: absolute;
      left: 20.63vh;
      top: 5.38vh;
      width: 4.31vh;
      height: 4.13vh;
    }

    .analyze-title {
      position: absolute;
      left: 5.06vh;
      top: 1.31vh;
      height: 6.25vh;
      line-height: 6.25vh;
      font-family: YouSheBiaoTiHei;
      font-size: 4.81vh;
    }

    .analyze-select {
      position: absolute;
      left: 3.69vh;
      top: 7vh;
      .el-input {
        width: 17.06vh;

        /deep/ input {
          position: relative;
          height: 3.56vh;
          line-height: 3.56vh;
          background-image: linear-gradient(270deg, #0065cb 0%, #002b8b 100%);
          border-radius: 1.81vh;
          border: solid 0.06vh #05bcff;
          box-sizing: border-box;
          font-family: PingFang;
          font-size: 1.88vh;
          color: #fff;
          padding: 0.5vh 2.44vh 0.44vh;
          cursor: pointer;
        }

        /deep/ .el-input__suffix {
          right: 0;
        }

        .input-suffix {
          position: absolute;
          width: 1vh;
          height: 0.69vh;
          top: 50%;
          right: 1.56vh;
          transform: translateY(-50%);
          background-image: url("~@/assets/images/detail/topic-select.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;
          cursor: pointer;

          &.active {
            transform: translateY(-50%) rotate(180deg);
          }
        }
      }
    }
  }

  .analyze-bg {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 49.38vh;
    height: 38.25vh;
    background-image: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 24, 123, 0.8) 100%
    );
    z-index: -1;
    box-sizing: border-box;
    padding: 1.88vh 2.5vh 1.94vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 0.63vh;
      background-color: #0522ff;
    }

    .analyze-row {
      display: flex;
      justify-content: space-between;
      width: 100%;

      .analyze-item {
        width: 20.31vh;
        height: 10.56vh;
        line-height: 10.56vh;
        text-align: right;
        box-sizing: border-box;
        padding-right: 3.38vh;
        font-family: YouSheBiaoTiHei;

        .item-num {
          font-size: 3.5vh;
        }

        .item-unit {
          font-size: 1.44vh;
        }
      }

      .star1 {
        .bg-image("~@/assets/images/map-ico/star1");
        margin-left: auto;
      }

      .star2 {
        .bg-image("~@/assets/images/map-ico/star2");
      }

      .star3 {
        .bg-image("~@/assets/images/map-ico/star3");
      }

      .star4 {
        .bg-image("~@/assets/images/map-ico/star4");
      }

      .star5 {
        .bg-image("~@/assets/images/map-ico/star5");
      }
    }
  }
}
</style>
<style lang="less">
.analyze-select-pop {
  width: 15vh;
  min-width: 0;
  box-sizing: border-box;
  background-color: rgba(0, 14, 60, 0.9);
  border-radius: 0.63vh;
  border: solid 0.06vh #05bcff;
  font-family: PingFang;
  font-size: 1.88vh;
  color: #fff;
  margin-top: 0.38vh !important;
  padding: 0.81vh 0.63vh;
  z-index: 3999 !important;

  li {
    cursor: pointer;

    > span {
      display: block;
      width: 100%;
      height: 2.63vh;
      line-height: 2.63vh;
      padding: 0 0.38vh;
    }

    &.selected,
    &:hover {
      color: #00f5ff;
      background-color: rgba(82, 209, 254, 0.4);
    }

    &:not(:last-child) {
      margin-bottom: 0.75vh;
    }
  }
}
</style>