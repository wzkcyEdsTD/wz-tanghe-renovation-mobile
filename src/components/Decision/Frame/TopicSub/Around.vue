<template>
  <div class="around">
    <div class="around-header">
      <i class="around-close" @click="closeInfo"></i>
      <span class="around-title">附近人口</span>
    </div>
    <div class="around-sex-box">
      <div class="circle left-circle">
        <div class="circle-inner">
          <img src="@/assets/images/map-ico/male.png" />
        </div>
      </div>
      <div class="circle right-circle">
        <div class="circle-inner">
          <img src="@/assets/images/map-ico/female.png" />
        </div>
      </div>

      <div class="sex-bar">
        <div
          class="left-bar"
          :style="{ width: (100 * maleNum) / (maleNum + femaleNum) + '%' }"
        >
          <span>{{ maleNum }}</span>
        </div>
        <div class="right-bar">
          <span>{{ femaleNum }}</span>
        </div>
      </div>
    </div>
    <div class="around-bg">
      <div id="aroundChart"></div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import echarts from "echarts";
import { vhToPx } from "@/common/js/util";
export default {
  data() {
    return {
      maleNum: 0,
      femaleNum: 0,
      chartData: [],
      aroundChart: undefined,
    };
  },

  mounted() {
    this.eventRegsiter();

    // 图表自适应
    window.addEventListener("resize", () => {
      this.aroundChart && this.aroundChart.resize();
      this.aroundChart &&
        this.aroundChart.setOption({
          legend: {
            padding: [vhToPx(1.13), vhToPx(1.88), vhToPx(1.13), vhToPx(1.88)],
            itemWidth: vhToPx(2.94),
            itemHeight: vhToPx(2.06),
            itemGap: vhToPx(2.89),
            textStyle: {
              fontSize: vhToPx(1.68),
            },
          },
          series: [
            {
              type: "pie",
              radius: vhToPx(7.5),
              label: {
                fontSize: vhToPx(1.88),
              },
              left: vhToPx(2.96),
              right: vhToPx(20.31),
            },
          ],
        });
    });
  },

  methods: {
    ...mapActions("decision", ["setBufferFlag"]),

    //  事件绑定
    eventRegsiter() {
      this.$bus.$off("change-around-chart");
      this.$bus.$on("change-around-chart", ({ result }) => {
        this.fixData(result);
      });
    },

    // 组装数据
    fixData(res) {
      this.maleNum = 0;
      this.femaleNum = 0;
      this.chartData = [
        {
          name: "18岁以下",
          value: 0,
        },
        {
          name: "18-60岁",
          value: 0,
        },
        {
          name: "60岁以上",
          value: 0,
        },
      ];

      res.result.features.map((feature) => {
        this.maleNum += Number(feature.attributes.NX);
        this.femaleNum += Number(feature.attributes.NVX);

        this.chartData[0].value += Number(feature.attributes.YX);
        this.chartData[1].value += Number(feature.attributes.ZJ);
        this.chartData[2].value += Number(feature.attributes.YS);
      });

      // 显示弹框
      this.$parent.aroundShow = true;
      this.$nextTick(() => {
        this.initChart();
      });
    },

    //   初始化图表
    initChart() {
      !this.aroundChart &&
        (this.aroundChart = echarts.init(
          document.getElementById("aroundChart")
        ));

      // 清空图表
      this.aroundChart.clear();
      this.aroundChart.setOption({
        color: ["#00b1ff", "#baffff", "#4e4eff", "#AC88FF"],
        legend: {
          backgroundColor: "#000724",
          padding: [vhToPx(1.13), vhToPx(1.88), vhToPx(1.13), vhToPx(1.88)],
          selectedMode: false,
          orient: "vertical",
          icon: "rect",
          itemWidth: vhToPx(2.94),
          itemHeight: vhToPx(2.06),
          right: 0,
          top: "center",
          itemGap: vhToPx(2.89),
          textStyle: {
            color: "#fff",
            fontFfamily: "PingFang",
            fontSize: vhToPx(1.68),
          },
        },
        series: [
          {
            type: "pie",
            radius: vhToPx(7.5),
            center: ["50%", "50%"],
            animation: false,
            label: {
              formatter: "{b}\n{d}%",
              position: "outer",
              alignTo: "none",
              fontFfamily: "PingFang",
              fontSize: vhToPx(1.88),
            },
            left: vhToPx(2.96),
            right: vhToPx(20.31),
            data: this.chartData,
          },
        ],
      });
    },

    closeInfo() {
      // 仅关闭弹框
      this.$parent.aroundShow = false;
      this.$parent.$parent.removeBuffer();
    },
  },
};
</script>

<style lang="less" scoped>
.around {
  width: 59vh;
  height: 44.75vh;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  z-index: 2999;

  .around-header {
    .around-close {
      width: 1.44vh;
      height: 1.5vh;
      position: absolute;
      top: 1vh;
      right: 3.25vh;
      .bg-image("~@/assets/images/detail/space-result-close");
      cursor: pointer;
      z-index: 99;
    }

    .around-title {
      position: absolute;
      top: 0;
      left: 3.69vh;
      display: block;
      height: 3.56vh;
      line-height: 3.56vh;
      font-family: YouSheBiaoTiHei;
      font-size: 2.75vh;
      color: #fff;
      text-shadow: 0vh 0.19vh 0.38vh rgba(0, 0, 0, 0.5);

      &::after {
        content: "";
        position: absolute;
        top: 0.19vh;
        left: -1.25vh;
        width: 20.25vh;
        height: 3.19vh;
        .bg-image("~@/assets/images/map-ico/around-header-bg");
        z-index: -1;
      }
    }
  }

  .around-sex-box {
    position: absolute;
    top: 3.88vh;
    left: 0;
    width: 59vh;
    height: 7.38vh;
    box-sizing: border-box;
    background-image: linear-gradient(0deg, #2f6add 0%, #13439d 100%);
    border-radius: 3.69vh;

    .circle {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
      width: 6.31vh;
      height: 6.38vh;
      box-sizing: border-box;
      border-radius: 50%;
      border: solid 0.38vh #000214;
      z-index: 99;

      .circle-inner {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 5vh;
        height: 5vh;
        box-sizing: border-box;
        border-radius: 50%;
        border: solid 0.25vh #fff;

        img {
          width: 1.88vh;
          height: 3.13vh;
        }
      }
    }

    .left-circle {
      left: 1.19vh;
      background-color: #3994ff;
    }

    .right-circle {
      right: 1.19vh;
      background-color: #d1144e;
    }

    .sex-bar {
      display: flex;
      align-items: center;
      position: absolute;
      top: 1.69vh;
      bottom: 1.94vh;
      left: 5.19vh;
      right: 5.19vh;
      background-color: #000214;
      padding: 0.5vh;

      > div {
        min-width: 7vh;
        height: 100%;
        transition: width 0.8s;

        > span {
          position: absolute;
          display: block;
          height: 2.75vh;
          line-height: 2.75vh;
          font-family: YouSheBiaoTiHei;
          font-size: 2.63vh;
        }
      }

      .left-bar {
        background-color: #3994ff;

        > span {
          left: 3.25vh;
        }
      }

      .right-bar {
        flex: 1;
        background-color: #d1144e;

        > span {
          right: 3.25vh;
        }
      }
    }
  }

  .around-bg {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 55.75vh;
    height: 37vh;
    box-sizing: border-box;
    background-image: linear-gradient(
      0deg,
      rgba(0, 20, 114, 0.8) 0%,
      rgba(0, 6, 43, 0.8) 100%
    );
    border: solid 0.06vh #1748a6;
    z-index: -1;

    #aroundChart {
      position: absolute;
      bottom: 3vh;
      left: 50%;
      transform: translateX(-50%);
      width: 50.75vh;
      height: 27vh;
    }
  }
}
</style>