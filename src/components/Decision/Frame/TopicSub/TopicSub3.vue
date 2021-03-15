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
            :options="deptList"
            :value="currentDept.label"
            @change="changeDept"
          />
        </div>
        <div class="chart-box">
          <div id="chart">
            <table class="chart-table">
              <tr v-for="(item, index) in fixChartData" :key="index">
                <td class="axis-label">{{ item.name }}</td>
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
import { ServiceUrl } from "@/config/mapConfig";
import { switchHeatMap } from "@/components/Decision/HeatMap";
import { countProjectStreetNum } from "@/api/tangheAPI";
import TopSelect from "./TopSelect";
export default {
  data() {
    return {
      streetData: [],
      chartData: [],

      // 柱状图最大长度，单位vh
      maxLength: 20.13,

      deptList: [
        { label: "鹿城区", value: "A02A01" },
        { label: "龙湾区", value: "A02A03" },
        { label: "瓯海区", value: "A02A02" },
        { label: "瑞安市", value: "A02A04" },
      ],
      currentDept: { label: "鹿城区", value: "A02A01" },
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
      const res = this.streetData.find((item) => {
        return item.name == this.currentDept.label;
      });

      this.chartData =
        res && "countBaseRespList" in res ? res.countBaseRespList : [];

      return this.chartData.sort((a, b) => {
        return Number(b.num) - Number(a.num);
      });
    },
  },

  async mounted() {
    await this.getStreetData();
    this.addHeatMap()
  },

  beforeDestroy() {
    switchHeatMap(false, "k1");
  },

  methods: {
    // 监听事件
    changeDept(obj) {
      this.currentDept = obj;
    },

    // 获取街道数据
    async getStreetData() {
      const { data } = await countProjectStreetNum();
      if (data.code == 200) {
        this.streetData = data.result;
      }
    },

    async addHeatMap() {
      const { result } = await this.fetchProjectData();
      let areaArr = [];
      result.features.forEach((v) => {
        areaArr.push([v.geometry.x, v.geometry.y, 1]);
      });
      switchHeatMap(true, "k1", areaArr, 0, 2);
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
            datasetNames: ["thxm:th_spatial_project_view"],
          })
        );
      });
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
                      transition: width .8s;
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