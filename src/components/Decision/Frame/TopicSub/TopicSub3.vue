<template>
  <div class="topic-sub">
    <div class="info-container">
      <div class="panel-title">
        <img src="@/assets/images/detail/title-before.png" />
        <span>项目分布</span>
      </div>
      <div class="panel-body">
        <div class="select-tool">
          <TopSelect
            :list="deptList"
            :value="currentDept"
            @change="changeDept"
          />
        </div>
        <div class="chart-box">
          <div id="chart">
            <table class="chart-table">
              <tr v-for="(item, index) in fixChartData" :key="index">
                <td class="axis-label">{{ item.label }}</td>
                <td class="chart-series">
                  <div>
                    <div
                      class="chart-bar"
                      :style="{ width: maxLength * (item.num / maxNum) + 'vh' }"
                    ></div>
                    <span class="chart-bar-label">{{ item.num }}</span>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopSelect from "./TopSelect";
export default {
  data() {
    return {
      chartData: [
        {
          label: "景山街道",
          num: 11,
        },
        {
          label: "景山街道",
          num: 10,
        },
        {
          label: "景山街道",
          num: 9,
        },
        {
          label: "景山街道",
          num: 8,
        },
        {
          label: "景山街道",
          num: 7,
        },
        {
          label: "景山街道",
          num: 9,
        },
        {
          label: "景山街道",
          num: 8,
        },
        {
          label: "景山街道",
          num: 7,
        },
        {
          label: "景山街道",
          num: 0,
        },
      ],

      // 柱状图最大长度，单位vh
      maxLength: 20.13,

      deptList: [
        "鹿城区政府",
        "瓯海区政府",
        "龙湾区政府",
        "瑞安市政府",
        "浙南产业区",
        "市现代集团",
        "市城发集团",
      ],
      currentDept: "鹿城区政府",
    };
  },

  components: { TopSelect },

  computed: {
    // 柱状图最大值
    maxNum() {
      return this.fixChartData[0].num;
    },

    // 数据排序
    fixChartData() {
      return this.chartData.sort((a, b) => {
        return Number(b.num) - Number(a.num);
      });
    },
  },
  mounted() {},
  methods: {
    // 更新图表
    updateChart() {},

    // 监听事件
    changeDept(val) {
      console.log("val", val);
      this.currentDept = val;
    },
  },
};
</script>

<style lang="less" scoped>
.topic-sub {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  border: solid 0.06vh #0f4dd8;
  box-sizing: border-box;
  padding: 1.44vh 1.38vh 1.88vh 2.38vh;

  .info-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;

    .panel-title {
      display: flex;
      align-items: flex-end;
      padding-right: 1.68vh;

      img {
        width: 2.13vh;
        height: 3.44vh;
      }

      span {
        flex: 1;
        text-align: left;
        display: block;
        position: relative;
        height: 3.44vh;
        font-family: YouSheBiaoTiHei;
        font-size: 2.38vh;
        color: #fff;
        padding-left: 1.16vh;

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 0;
          border-bottom: solid 0.25vh #165fea;
        }
      }
    }

    .panel-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-top: 1.69vh;

      .select-tool {
        width: 100%;
        height: 2.56vh;
        box-sizing: border-box;
        padding: 0 0.68vh 0 1.13vh;
      }

      .chart-box {
        flex: 1;
        margin-top: 2.25vh;

        #chart {
          width: 100%;
          height: 100%;

          .chart-table {
            width: 100%;
            height: 100%;
            color: #fff;
            padding: 0 0.56vh 0 0.44vh;

            tr {
              td {
                display: table-cell;
                vertical-align: middle;
                font-family: PingFang;
                font-size: 1.38vh;

                &.axis-label {
                  width: 30%;
                  text-align: left;
                }

                &.chart-series {
                  > div {
                    display: flex;
                    align-items: center;

                    .chart-bar {
                      min-width: 1.5vh;
                      height: 1.5vh;
                      background-image: linear-gradient(
                        270deg,
                        #67edff 0%,
                        #0093ff 100%
                      );
                      border-radius: 0.75vh;
                      transition: width 2s;
                    }

                    .chart-bar-label {
                      display: block;
                      padding-left: 0.56vh;
                    }
                  }
                }
              }

              &:nth-child(-n + 3) {
                .axis-label {
                  font-family: YouSheBiaoTiHei;
                  font-size: 1.88vh;
                }
                .chart-series {
                  .chart-bar {
                    background-image: linear-gradient(
                      270deg,
                      #dc67ff 0%,
                      #c400ff 100%
                    );
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>