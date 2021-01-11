<template>
  <div class="topic-sub">
    <div class="info-container">
      <div class="panel-title">
        <img src="@/assets/images/detail/title-before.png" />
        <span>延期项目</span>
      </div>
      <div class="panel-body">
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
                    >{{ fixNum(item.num) }}
                  </span>
                </div>
              </section>
            </div>
          </div>
        </div>
        <div class="select-tool">
          <TopSelect
            :list="deptList"
            :value="currentDept"
            @change="changeDept"
          />
        </div>
        <div class="project-list">
          <div class="list-header">
            <span>项目名称</span>
            <span>计划开工时间</span>
            <span>计划建成时间</span>
            <span>当前状态</span>
          </div>
          <div class="list-body">
            <ul>
              <!-- 模拟数据，重复15次 -->
              <li v-for="k in 15" :key="k">
                <span>葡萄8-5地块</span>
                <span>2020-02-04</span>
                <span>2021-02-04</span>
                <span>延期</span>
              </li>
            </ul>
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
      listData: [
        {
          label: "鹿城区政府",
          num: 1,
        },
        {
          label: "鹿城区政府",
          num: 9,
        },
        {
          label: "区政府",
          num: 2,
        },
        {
          label: "鹿城区政府",
          num: 9,
        },
        {
          label: "鹿城区政府",
          num: 8,
        },
        {
          label: "鹿城区政府",
          num: 9,
        },
        {
          label: "鹿城区政府",
          num: 9,
        },
      ],

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
    // 数据排序
    fixListData() {
      return this.listData.sort((a, b) => {
        return Number(b.num) - Number(a.num);
      });
    },
  },

  methods: {
    // 数字补0
    fixNum(num) {
      return Number(num) < 10 ? `0${Number(num)}` : num;
    },

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

      .dept-list {
        box-sizing: border-box;

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
                justify-content: space-between;
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
                    width: 6vh;
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

              &:nth-child(odd) {
                padding-right: 2.69vh;
              }

              &:nth-child(even) {
                padding: 0 1.63vh 0 1.56vh;
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

      .select-tool {
        width: 100%;
        height: 2.56vh;
        box-sizing: border-box;
        margin: 1.56vh 0 1.13vh;
        padding: 0 0.68vh 0 1.13vh;
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
              padding-left: 1.19vh;
            }

            &:nth-child(2),
            &:nth-child(3) {
              width: 8.5vh;
            }

            &:last-child {
              width: calc(100% - 26vh);
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
                box-sizing: border-box;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                &:first-child {
                  width: 8vh;
                  padding-left: 1.19vh;
                }

                &:nth-child(2),
                &:nth-child(3) {
                  width: 8.5vh;
                }

                &:last-child {
                  width: calc(100% - 26vh);
                  text-align: center;
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
}
</style>