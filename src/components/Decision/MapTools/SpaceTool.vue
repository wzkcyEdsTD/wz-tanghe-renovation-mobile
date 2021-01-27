<template>
  <div class="space-tool">
    <div class="space-tool-wrapper">
      <div class="space-tool-inner">
        <div
          class="tool-item"
          :class="{ active: currentIndex == index }"
          v-for="(item, index) in toolList"
          :key="index"
          @click="changeSpace(item, index)"
        >
          <span>{{ item.label }}</span>
        </div>
      </div>

      <!-- <div class="space-sub-tool-draw" v-show="drawToolShow">
        <div
          class="sub-tool-item"
          v-for="(item, index) in drawToolList"
          :key="index"
          :class="{ active: item.check }"
          @mousedown="changeDrawTool(item, index)"
          @mouseup="item.check = false"
        >
          <img
            :src="
              require(`@/assets/images/spacetools/${
                item.check ? `${item.icon}高亮` : item.icon
              }@2x.png`)
            "
          />
          <span>{{ item.label }}</span>
        </div>
      </div> -->

      <div class="space-sub-tool-measure" v-show="measureToolShow">
        <div
          class="sub-tool-item"
          v-for="(item, index) in measureToolList.filter(
            (item) => item.id != '清除'
          )"
          :key="item.id"
          :class="{ active: item.check }"
          @click="changeMeasureTool(item)"
        >
          <img
            :src="
              require(`@/assets/images/spacetools/${
                item.check ? `${item.icon}高亮` : item.icon
              }@2x.png`)
            "
          />
          <span>{{ item.label }}</span>
        </div>
        <div
          class="sub-tool-item"
          v-for="(item, index) in measureToolList.filter(
            (item) => item.id == '清除'
          )"
          :key="item.id"
          :class="{ active: item.check }"
          @mousedown="changeMeasureTool(item)"
          @mouseup="item.check = false"
        >
          <img
            :src="
              require(`@/assets/images/spacetools/${
                item.check ? `${item.icon}高亮` : item.icon
              }@2x.png`)
            "
          />
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>

    <CalTools ref="CalTools" v-show="false" />

    <div class="space-result" v-show="spaceShow">
      <span class="space-result-title">空间分析结果</span>
      <i class="space-result-close" @click="closeAreaAnalyze(true)"></i>
      <div class="space-result-body">
        <div class="space-result-left">
          <div class="project">
            <div class="label-bg">
              <span class="label">项目</span>
            </div>
            <div class="number-box">
              <div class="number-box-row">
                <span class="number">{{ analyzeData.projectTotal }}</span>
                <span class="unit">总数(个)</span>
              </div>
              <div class="number-box-row">
                <span class="number">{{
                  (analyzeData.projectAmount / 10000).toFixed(1)
                }}</span>
                <span class="unit">金额(亿元)</span>
              </div>
            </div>
          </div>
          <div class="breakpoint">
            <div class="label-bg">
              <span class="label">断点</span>
            </div>
            <div class="number-box">
              <div class="number-box-row">
                <span class="number">{{ analyzeData.pointTotal }}</span>
                <span class="unit">总数(个)</span>
              </div>
              <div class="number-box-row">
                <span class="number">{{
                  parseInt(analyzeData.pointLength)
                }}</span>
                <span class="unit">长度(米)</span>
              </div>
            </div>
          </div>
        </div>

        <div class="space-result-right">
          <div class="space-result-tab-pane">
            <span
              v-for="(item, index) in ['区县', '街道']"
              :key="index"
              :class="{ active: currentTab == item }"
              @click="currentTab = item"
              >{{ item }}</span
            >
          </div>
          <div class="space-result-tab">
            <div class="header">
              <span class="label">统计结果</span>
              <div class="space-result-select">
                <el-popover
                  placement="bottom"
                  trigger="click"
                  v-model="visible"
                  :visible-arrow="false"
                  popper-class="space-result-select-pop"
                >
                  <ul>
                    <li
                      v-for="(item, index) in ['项目', '断点']"
                      :key="index"
                      :class="{ selected: item == currentType }"
                      @click="selected(item)"
                    >
                      <span>{{ item }}</span>
                    </li>
                  </ul>
                  <div slot="reference" class="space-result-select-input">
                    <span>{{ currentType }}</span>
                    <i
                      class="input-suffix"
                      :class="{ active: visible }"
                      @click="$parent.visible = !$parent.visible"
                    ></i>
                  </div>
                </el-popover>
              </div>
            </div>
            <div class="chart">
              <div id="pieChart"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { vhToPx } from "@/common/js/util";
import CalTools from "@/components/Widget/CalTools";
export default {
  data() {
    return {
      toolList: [
        // {
        //   id: "标绘",
        //   label: "空间标绘",
        // },
        {
          id: "量算",
          label: "空间量算",
        },
        {
          id: "分析",
          label: "空间分析",
        },
      ],
      drawToolList: [
        {
          id: "点",
          label: "点",
          icon: "点",
          check: false,
        },
        {
          id: "线",
          label: "线",
          icon: "线",
          check: false,
        },
        {
          id: "面",
          label: "面",
          icon: "面",
          check: false,
        },
        {
          id: "历史查询",
          label: "历史查询",
          icon: "历史查询",
          check: false,
        },
      ],
      // drawToolShow: false,

      measureToolList: [
        {
          id: "测距",
          label: "测距",
          icon: "测距",
          check: false,
        },
        {
          id: "测面",
          label: "测面",
          icon: "测面",
          check: false,
        },
        {
          id: "清除",
          label: "清除",
          icon: "清除",
          check: false,
        },
      ],
      measureToolShow: false,

      spaceShow: false,
      visible: false,
      currentIndex: null,
      currentTab: "区县",
      currentType: "项目",
      analyzeData: {
        projectTotal: 0,
        projectAmount: 0,
        pointTotal: 0,
        pointLength: 0,
        projectDistrict: [],
        pointDistrict: [],
        projectStreet: [],
        pointStreet: [],
      },
      pieChart: undefined,
    };
  },

  components: { CalTools },

  mounted() {
    this.eventRegsiter();

    // 图表自适应
    window.addEventListener("resize", () => {
      this.pieChart && this.pieChart.resize();
      this.pieChart &&
        this.pieChart.setOption({
          legend: {
            itemWidth: vhToPx(1.72),
            itemHeight: vhToPx(1.35),
            top: vhToPx(1.45),
            itemGap: vhToPx(1.96),
            textStyle: {
              fontSize: vhToPx(1.5),
            },
          },
          series: [
            {
              type: "pie",
              radius: vhToPx(6.96),
              label: {
                fontSize: vhToPx(1.57),
              },
              left: vhToPx(11.85),
              right: vhToPx(4.57),
            },
          ],
        });
    });
  },
  methods: {
    // 空间工具操作
    changeSpace(item, index) {
      if (!("id" in item)) return;

      // 单选，可点击关闭
      this.currentIndex = this.currentIndex == index ? null : index;

      // 清空
      // this.drawToolShow = false;
      this.closeMeasureTool();
      this.closeAreaAnalyze(false);

      // if (this.currentIndex == 0) {
      //   this.drawToolShow = true;
      // }
      if (this.currentIndex == 0) {
        this.measureToolShow = true;
      } else if (this.currentIndex == 1) {
        this.$refs.CalTools.gaugeAreaAnalyze();
      }
    },

    // 标绘工具选择
    changeDrawTool(item, index) {
      item.check = true;
    },

    // 测量工具选择
    changeMeasureTool(item) {
      // 清空测量
      this.$refs.CalTools.clearGauge();
      this.measureToolList.map((_item) => {
        if (_item.id != item.id) {
          _item.check = false;
        }
      });

      if (item.id == "测距") {
        item.check = !item.check;
        item.check && this.$refs.CalTools.gaugeDistance();
      } else if (item.id == "测面") {
        item.check = !item.check;
        item.check && this.$refs.CalTools.gaugeArea();
      } else if (item.id == "清除") {
        item.check = true;
      }
    },

    // 下拉选择
    selected(value) {
      this.currentType = value;
      this.visible = false;
    },

    // 关闭标绘工具
    closeDrawTool() {},

    // 关闭测量工具
    closeMeasureTool() {
      this.measureToolShow = false;
      this.$refs.CalTools.clearGauge();
      this.measureToolList.map((item) => {
        item.check = false;
      });
    },

    // 关闭空间分析
    closeAreaAnalyze(flag) {
      // 是否由按钮关闭
      flag && (this.currentIndex = null);
      this.spaceShow = false;
      this.$refs.CalTools.clearGauge();
    },

    // 事件注册
    eventRegsiter() {
      this.$bus.$off("areaAnalyze");
      this.$bus.$on("areaAnalyze", ({ result }) => {
        this.fixData(result);
      });
    },

    // 组装数据
    fixData(res) {
      this.currentType = "项目";
      this.analyzeData = {
        projectTotal: 0,
        projectAmount: 0,
        pointTotal: 0,
        pointLength: 0,
        projectDistrict: [],
        pointDistrict: [],
        projectStreet: [],
        pointStreet: [],
      };

      res.result.features.forEach((feature) => {
        if (feature.attributes.RESOURCE_TYPE == "project_all") {
          this.analyzeData.projectTotal += 1;
          this.analyzeData.projectAmount += Number(
            feature.attributes.TOTALAMOUNT
          );

          const districtIndex = this.analyzeData.projectDistrict.findIndex(
            (item) => {
              return item.name == feature.attributes.DISTRICT;
            }
          );
          if (districtIndex >= 0) {
            this.analyzeData.projectDistrict[districtIndex].value += 1;
          } else {
            this.analyzeData.projectDistrict.push({
              name: feature.attributes.DISTRICT,
              value: 1,
            });
          }

          const streetIndex = this.analyzeData.projectStreet.findIndex(
            (item) => {
              return item.name == feature.attributes.STREET;
            }
          );
          if (streetIndex >= 0) {
            this.analyzeData.projectStreet[streetIndex].value += 1;
          } else {
            this.analyzeData.projectStreet.push({
              name: feature.attributes.STREET,
              value: 1,
            });
          }
        }

        if (feature.attributes.RESOURCE_TYPE == "greenway_all") {
          this.analyzeData.pointTotal += 1;
          this.analyzeData.pointLength += Number(feature.attributes.LENGTH);

          const districtIndex = this.analyzeData.pointDistrict.findIndex(
            (item) => {
              return item.name == feature.attributes.DISTRICT;
            }
          );
          if (districtIndex >= 0) {
            this.analyzeData.pointDistrict[districtIndex].value += 1;
          } else {
            this.analyzeData.pointDistrict.push({
              name: feature.attributes.DISTRICT,
              value: 1,
            });
          }

          const streetIndex = this.analyzeData.pointStreet.findIndex((item) => {
            return item.name == feature.attributes.STREET;
          });
          if (streetIndex >= 0) {
            this.analyzeData.pointStreet[streetIndex].value += 1;
          } else {
            this.analyzeData.pointStreet.push({
              name: feature.attributes.STREET,
              value: 1,
            });
          }
        }
      });

      this.initChart();
    },

    // 初始化图表
    initChart() {
      let data;
      if (this.currentTab == "区县") {
        if (this.currentType == "项目") {
          data = this.analyzeData.projectDistrict;
        }
        if (this.currentType == "断点") {
          data = this.analyzeData.pointDistrict;
        }
      }
      if (this.currentTab == "街道") {
        if (this.currentType == "项目") {
          data = this.analyzeData.projectStreet;
        }
        if (this.currentType == "断点") {
          data = this.analyzeData.pointStreet;
        }
      }

      this.spaceShow = true;
      this.$nextTick(() => {
        !this.pieChart &&
          (this.pieChart = echarts.init(document.getElementById("pieChart")));

        // 清空图表
        this.pieChart.clear();
        this.pieChart.setOption({
          color: ["#00b1ff", "#baffff", "#4e4eff", "#AC88FF"],
          legend: {
            type: "scroll",
            selectedMode: false,
            orient: "vertical",
            icon: "roundRect",
            itemWidth: vhToPx(1.72),
            itemHeight: vhToPx(1.35),
            left: 0,
            top: vhToPx(1.45),
            itemGap: vhToPx(1.96),
            textStyle: {
              color: "#fff",
              fontSize: vhToPx(1.5),
            },
          },
          series: [
            {
              type: "pie",
              radius: vhToPx(6.96),
              center: ["50%", "50%"],
              animation: false,
              label: {
                formatter: "{b}\n{d}%",
                position: "outer",
                alignTo: "none",
                fontFfamily: "PingFang",
                fontSize: vhToPx(1.57),
              },
              left: vhToPx(11.85),
              right: vhToPx(4.57),
              data: data,
            },
          ],
        });
      });
    },
  },

  watch: {
    // tab切换
    currentTab(n, o) {
      this.currentType = "项目";
      this.initChart();
    },

    // 下拉菜单切换
    currentType(n, o) {
      this.initChart();
    },
  },
};
</script>

<style lang="less" scoped>
.space-tool {
  .space-tool-wrapper {
    position: fixed;
    top: 9.81vh;
    left: 50%;
    transform: translateX(-50%);
    width: 76.2vh;
    height: 4.2vh;
    .bg-image("~@/assets/images/spacetools/spacetool-bg");
    z-index: 99;

    .space-tool-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 30vh;
      height: 100%;
      margin: auto;
      padding: 0 5vh;
      box-sizing: border-box;

      .tool-item {
        height: 2.77vh;
        line-height: 2.77vh;
        font-family: PingFang;
        font-size: 2vh;
        color: #fff;
        opacity: 0.6;
        cursor: pointer;

        &.active {
          position: relative;
          color: #69fee5;
          opacity: 1;

          &::before {
            content: "";
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: -1.5vh;
            width: 0.75vh;
            height: 0.75vh;
            border-radius: 50%;
            background-color: #69fee5;
          }
        }
      }
    }

    .space-sub-tool-draw {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: fixed;
      top: 5vh;
      left: 50%;
      transform: translateX(-50%);
      width: 43.96vh;
      height: 3.6vh;
      box-sizing: border-box;
      border-radius: 1.88vh;
      background-color: #0454c1;
      padding: 0 6.22vh;
      opacity: 0.8;
      z-index: 99;

      .sub-tool-item {
        display: flex;
        align-items: center;
        font-family: PingFang;
        font-size: 1.8vh;
        color: #fff;
        opacity: 0.6;
        cursor: pointer;

        > img {
          width: 1.5vh;
          height: 1.5vh;
          margin-right: 0.6vh;
        }

        &.active {
          color: #69fee5;
          opacity: 1;
        }
      }
    }

    .space-sub-tool-measure {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: fixed;
      top: 5vh;
      left: 50%;
      transform: translateX(-50%);
      width: 43.96vh;
      height: 3.6vh;
      box-sizing: border-box;
      border-radius: 1.88vh;
      background-color: #0454c1;
      padding: 0 8.63vh;
      opacity: 0.8;
      z-index: 99;

      .sub-tool-item {
        display: flex;
        align-items: center;
        font-family: PingFang;
        font-size: 1.8vh;
        color: #fff;
        opacity: 0.6;
        cursor: pointer;

        > img {
          width: 1.5vh;
          height: 1.5vh;
          margin-right: 0.6vh;
        }

        &.active {
          color: #69fee5;
          opacity: 1;
        }
      }
    }
  }

  .space-result {
    position: fixed;
    bottom: 17.77vh;
    left: 50%;
    transform: translateX(-50%);
    width: 80.63vh;
    height: 35.84vh;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      border-bottom: solid 0.38vh #16eaea;
    }

    .space-result-close {
      width: 1.73vh;
      height: 1.8vh;
      position: absolute;
      top: 1.57vh;
      right: -0.83vh;
      .bg-image("~@/assets/images/detail/space-result-close");
      cursor: pointer;
      z-index: 99;
    }

    .space-result-title {
      position: absolute;
      top: 0;
      left: 2.77vh;
      height: 3.97vh;
      font-family: YouSheBiaoTiHei;
      font-size: 3.07vh;
      color: #fff;

      &::before {
        content: "";
        position: absolute;
        left: -1.5vh;
        top: 0.53vh;
        width: 2.4vh;
        height: 3.9vh;
        .bg-image("~@/assets/images/detail/title-before");
        z-index: -1;
      }
    }

    .space-result-body {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 30.76vh;
      background-color: rgba(0, 0, 0, 0.8);

      .space-result-left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 50%;
        height: 100%;
        box-sizing: border-box;
        padding: 3.56vh 0 3.81vh 3.56vh;

        .project,
        .breakpoint {
          display: flex;
          align-items: center;
          color: #fff;

          .label-bg {
            display: flex;
            align-items: center;
            width: 5.17vh;
            height: 8.77vh;
            background-color: #007281;

            .label {
              font-family: YouSheBiaoTiHei;
              font-size: 3.3vh;
              line-height: 3.3vh;
            }
          }

          .number-box {
            display: flex;
            flex-direction: column;
            margin-left: 1.56vh;

            .number-box-row {
              display: flex;
              flex-direction: row;
              align-items: center;

              .number {
                display: block;
                min-width: 13.5vh;
                text-align: left;
                height: 5.55vh;
                line-height: 5.55vh;
                font-family: YouSheBiaoTiHei;
                font-size: 4.27vh;
                color: #00e2ff;
              }

              .unit {
                font-family: PingFang;
                font-size: 2.02vh;
              }
            }
          }
        }

        .breakpoint {
          .label-bg {
            background-color: #007e4e;
          }

          .number-box .number-box-row .number {
            color: #00ff9d;
          }
        }
      }

      .space-result-right {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: -4.57vh;
        right: -0.9vh;
        width: 43.87vh;
        height: 33.3vh;

        .space-result-tab-pane {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          width: 15vh;
          height: 3.6vh;
          box-sizing: border-box;
          .bg-image("~@/assets/images/detail/space-tab-pane-bg");
          padding: 0.31vh 3.45vh 0.31vh 2.02vh;

          > span {
            display: block;
            height: 2.77vh;
            line-height: 2.77vh;
            font-family: PingFang;
            font-size: 1.5vh;
            color: #fff;
            z-index: 4999;
            cursor: pointer;
          }

          > span:first-child {
            &::after {
              content: "";
              position: absolute;
              top: 50%;
              left: 0.69vh;
              transform: translateY(-50%);
              width: 6.45vh;
              height: 2.77vh;
              .bg-image("~@/assets/images/detail/区县@2x");
              z-index: -1;
            }
          }

          > span:last-child {
            &::after {
              content: "";
              position: absolute;
              top: 50%;
              right: 1.06vh;
              transform: translateY(-50%);
              width: 7.65vh;
              height: 2.77vh;
              .bg-image("~@/assets/images/detail/街道@2x");
              z-index: -1;
            }
          }

          .active:first-child::after {
            .bg-image("~@/assets/images/detail/区县高亮@2x");
          }

          .active:last-child::after {
            .bg-image("~@/assets/images/detail/街道高亮@2x");
          }
        }

        .space-result-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
          background-color: #001346;
          box-sizing: border-box;
          border: solid 0.06vh #00414a;
          padding: 1.13vh 2.13vh 1.13vh 1.88vh;

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;

            .label {
              display: block;
              height: 2.63vh;
              line-height: 2.63vh;
              font-family: YouSheBiaoTiHei;
              font-size: 2.03vh;
              color: #fff;
              border-bottom: solid 0.07vh #00b1ff;
            }

            .space-result-select {
              .space-result-select-input {
                position: relative;
                display: flex;
                align-items: center;
                width: 5.76vh;
                height: 2.4vh;
                line-height: 2.25vh;
                background-color: #000514;
                border-radius: 0.06vh;
                box-sizing: border-box;
                font-family: PingFang;
                font-size: 1.2vh;
                color: #fff;
                outline: none;
                padding-left: 0.5vh;
                cursor: pointer;

                span {
                  display: block;
                }

                .input-suffix {
                  position: absolute;
                  width: 0.84vh;
                  height: 0.6vh;
                  top: 50%;
                  right: 0.56vh;
                  transform: translateY(-50%);
                  transition: all 0.3s;
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

          .chart {
            flex: 1;
            padding-top: 1.73vh;

            #pieChart {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.space-result-select-pop {
  width: 5.76vh;
  min-width: 0;
  box-sizing: border-box;
  background-color: #000514;
  border: solid 0.07vh #00323c;
  border: none;
  font-family: PingFang;
  font-size: 1.2vh;
  color: #fff;
  outline: none;
  margin-top: 0.16vh !important;
  padding: 0.44vh 0.31vh;
  z-index: 3999 !important;

  li {
    cursor: pointer;

    > span {
      display: block;
      width: 100%;
      height: 2.22vh;
      line-height: 2.22vh;
      box-sizing: border-box;
      padding: 0 0.45vh;
    }

    &.selected,
    &:hover {
      color: #00f5ff;
      background-color: rgba(0, 86, 101, 0.6);
    }

    &:not(:last-child) {
      margin-bottom: 0.45vh;
    }
  }
}
</style>