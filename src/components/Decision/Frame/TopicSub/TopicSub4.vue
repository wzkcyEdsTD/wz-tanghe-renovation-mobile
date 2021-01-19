<template>
  <div class="topic-sub">
    <div class="info-container">
      <div class="panel-title">
        <img src="@/assets/images/detail/title-before.png" />
        <span>项目投资额分布</span>
      </div>
      <div class="panel-body">
        <header class="sub-title">
          <span></span>
          <span>各责任单位投资总额（亿元）</span>
        </header>
        <div class="dept-list">
          <div class="chart-box">
            <div
              class="chart-line"
              v-for="k in Math.ceil(fixListData.length / 2)"
              :key="k"
            >
              <section
                v-for="(item, index) in fixListData.slice(
                  (k - 1) * 2,
                  (k - 1) * 2 + 2
                )"
                :key="index"
              >
                <div>
                  <span>{{ item.label }}</span>
                  <span
                    class="chart-num"
                    :class="{ top: k * 2 + index - 1 < 4 }"
                    >{{ fixNum(Math.ceil(item.num / 10000)) }}
                  </span>
                </div>
              </section>
            </div>
          </div>
        </div>
        <header class="sub-title">
          <span></span>
          <span>项目投资额排名列表</span>
        </header>
        <div class="project-list">
          <div class="list-header">
            <span>项目名称</span>
            <span>总投资额</span>
            <span>责任单位</span>
          </div>
          <div class="list-body">
            <ul>
              <li v-for="(item, index) in projectList" :key="index">
                <span>{{ ++index }}</span>
                <span>{{ item.name }}</span>
                <span>{{
                  item.totalamount > 10000
                    ? `${(item.totalamount / 10000).toFixed(1)}亿元`
                    : `${item.totalamount.toFixed(0)}万元`
                }}</span>
                <span>{{ item.sysOrgCode_dictText }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-btn">
      <span
        v-for="(item, index) in yearList"
        :key="index"
        :class="{ active: currentYearIndex === index }"
        @click="yearChange(item, index)"
        >{{ item }}</span
      >
    </div>
  </div>
</template>

<script>
import { resourceProjectList, getProjStatusByDept } from "@/api/tangheAPI";
export default {
  data() {
    return {
      listData: [
        { label: "鹿城区政府", value: "A02A01", num: 0 },
        { label: "龙湾区政府", value: "A02A03", num: 0 },
        { label: "瓯海区政府", value: "A02A02", num: 0 },
        { label: "瑞安市政府", value: "A02A04", num: 0 },
        { label: "浙南产业区", value: "A02A05", num: 0 },
        { label: "温州城发集团", value: "A02A07", num: 0 },
        { label: "温州现代集团", value: "A02A06", num: 0 },
      ],
      yearList: [2020, 2021],
      currentYearIndex: 0,
      projectList: [],
    };
  },

  computed: {
    // 数据排序
    fixListData() {
      return this.listData.sort((a, b) => {
        return Number(b.num) - Number(a.num);
      });
    },
  },

  async mounted() {
    await this.getProjectList(this.yearList[this.currentYearIndex]);
  },

  methods: {
    // 数字补0
    fixNum(num) {
      return Number(num) < 10 ? `0${Number(num)}` : num;
    },

    // 年份切换事件
    yearChange(item, index) {
      this.currentYearIndex = index;
    },

    // 获取项目列表
    async getProjectList(year) {
      const { data } = await resourceProjectList({
        delFlag: 0,
        status,
        pageNo: 1,
        pageSize: 9999,
        tag: year,
        column: "totalamount",
        order: "desc",
      });

      if (data.code == 200) {
        this.projectList = data.result.records;

        // 项目统计
        this.listData.map((item) => {
          item.num = 0;
          data.result.records.map((v) => {
            if (item.value == v.sysOrgCode) {
              item.num += v.totalamount;
            }
          });
        });
      }
    },
  },

  watch: {
    currentYearIndex(n, o) {
      const year = this.yearList[n];
      this.getProjectList(year);
    },
  },
};
</script>

<style lang="less" scoped>
.topic-sub {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .info-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    border: solid 0.06vh #0f4dd8;
    box-sizing: border-box;
    padding: 1.44vh 1.38vh 1.75vh 2.38vh;
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
      margin-top: 1.84vh;

      .sub-title {
        display: flex;
        align-items: center;
        text-align: left;
        font-family: PingFang;
        font-size: 1.5vh;
        color: #62abff;
        margin-bottom: 1.41vh;

        span {
          &:first-child {
            display: block;
            width: 0.94vh;
            height: 1vh;
            border-radius: 50%;
            background-color: #0dc7ff;
            margin-right: 0.63vh;
          }

          &:last-child {
            flex: 1;
          }
        }
      }

      .dept-list {
        box-sizing: border-box;
        margin-bottom: 2.63vh;

        .chart-box {
          width: 100%;

          .chart-line {
            width: 100%;
            display: flex;

            &:not(:last-child) {
              margin-bottom: 2.76vh;
            }

            > section {
              position: relative;
              width: 50%;
              text-align: left;
              color: #fff;
              box-sizing: border-box;

              > div {
                display: flex;
                align-items: center;

                span {
                  text-align: left;
                  display: block;
                  font-family: PingFang;
                  font-size: 1.63vh;
                  line-height: 1.9vh;
                  color: #fff;

                  &:first-child {
                    width: 5vh;
                  }

                  &.chart-num {
                    position: relative;
                    width: 10vh;
                    height: 5.31vh;
                    line-height: 5.31vh;
                    text-align: center;
                    font-family: YouSheBiaoTiHei;
                    font-size: 4.06vh;
                    color: #00a2bf;

                    &::after {
                      content: "";
                      width: 5.06vh;
                      height: 4.25vh;
                      position: absolute;
                      left: 50%;
                      bottom: 0;
                      transform: translateX(-50%);
                      background-image: url("~@/assets/images/detail/blue-bg@2x.png");
                      background-repeat: no-repeat;
                      background-size: 100% 100%;
                    }

                    &.top {
                      color: #ff006c;

                      &::after {
                        background-image: url("~@/assets/images/detail/red-bg@2x.png");
                      }
                    }
                  }
                }
              }

              &:nth-child(even) {
                padding-left: 1vh;
              }

              &:not(:last-child)::after {
                content: "";
                width: 0.05vh;
                height: 3.81vh;
                position: absolute;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
                background-color: #707070;
              }
            }
          }
        }
      }

      .project-list {
        flex: 1;
        height: 0;

        .list-header {
          display: flex;
          height: 3.5vh;
          line-height: 3.5vh;
          background-image: url("~@/assets/images/detail/list-header.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;

          span {
            display: block;
            text-align: left;
            font-family: PingFang;
            font-size: 1.25vh;
            color: #16e8e8;
            box-sizing: border-box;

            &:first-child {
              width: 8vh;
              margin-left: 4.94vh;
            }

            &:nth-child(2) {
              width: 8.5vh;
            }

            &:last-child {
              width: calc(100% - 22vh);
            }
          }
        }

        .list-body {
          height: calc(100% - 3.5vh);
          overflow-y: auto;

          > ul {
            > li {
              display: flex;
              font-family: PingFang;
              font-size: 1.25vh;
              color: #fff;
              height: 3.5vh;
              line-height: 3.5vh;

              &:nth-child(even) {
                background-color: rgba(22, 95, 234, 0.24);
              }

              span {
                display: block;
                text-align: left;
                font-size: 1.25vh;
                box-sizing: border-box;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                &:first-child {
                  width: 4.94vh;
                  text-align: center;
                  position: relative;
                  z-index: 1999;

                  &::after {
                    content: "";
                    position: absolute;
                    width: 1.75vh;
                    height: 1.75vh;
                    background-color: #1e31c4;
                    border-radius: 0.13vh;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: -1;
                  }
                }

                &:nth-child(2) {
                  width: 8vh;
                  padding-right: 1vh;
                }

                &:nth-child(3) {
                  width: 8.5vh;
                  padding-right: 1vh;
                }

                &:last-child {
                  width: calc(100% - 22vh);
                }
              }

              &:first-child {
                > span:first-child::after {
                  background-color: #ff361c;
                }
              }

              &:nth-child(2) {
                > span:first-child::after {
                  background-color: #ff961c;
                }
              }

              &:nth-child(3) {
                > span:first-child::after {
                  background-color: #f8c900;
                }
              }
            }
          }

          // 滚动条
          &::-webkit-scrollbar {
            width: 0.63vh;
          }

          &::-webkit-scrollbar-thumb {
            background-color: #165fea;
            border-radius: 0.31vh;
          }

          &::-webkit-scrollbar-track {
            border-radius: 0;
            background-color: #212e58;
          }
        }
      }
    }
  }

  .bottom-btn {
    display: flex;
    margin-top: 1.25vh;
    background-color: rgba(0, 0, 0, 0.8);
    border: solid 0.06vh #0f4dd8;
    box-sizing: border-box;
    padding: 0.94vh 1.25vh;

    > span {
      display: block;
      width: 50%;
      height: 4.13vh;
      line-height: 4.13vh;
      font-family: YouSheBiaoTiHei;
      font-size: 2.88vh;
      color: #999;
      cursor: pointer;

      &.active {
        color: #00f5ff;
        background-color: rgba(5, 159, 255, 0.6);
      }
    }
  }
}
</style>