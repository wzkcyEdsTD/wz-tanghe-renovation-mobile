<template>
  <div class="supervise">
    <span class="supervise-title">打分</span>
    <i class="supervise-close" @click="$parent.superviseShow = false"></i>
    <div class="supervise-body">
      <div class="rate-box-header">
        <div class="left">
          <img class="item-thumb" src="@/assets/images/maptools/暂无图片.png" />
        </div>
        <div class="right">
          <span class="name">高联大厦</span>
          <div class="rate-box">
            <span>总体评分</span>
            <el-rate v-model="value"></el-rate>
          </div>
        </div>
      </div>
      <div class="comment-history">
        <div class="comment-title">
          <span></span>
          <span>历史评论</span>
        </div>
        <div class="comment-body">
          <div class="comment-list">
            <div class="comment-item" v-for="k in 5" :key="k">
              <div class="comment-header">
                <div class="left">
                  <img class="avatar" src="@/assets/images/detail/avatar.png" />
                </div>
                <div class="right">
                  <span class="name">XXX</span>
                  <div class="right-rate">
                    <el-rate
                      class="comment-rate"
                      disabled
                      v-model="rateValue"
                    ></el-rate>
                    <span class="time">2020.12.20 14:40:00</span>
                  </div>
                </div>
              </div>
              <div class="comment-content">
                评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: 4,
      rateValue: 4,
    };
  },
};
</script>

<style lang="less" scoped>
.supervise {
  display: flex;
  flex-direction: column;
  width: 42.79vh;
  height: 31.97vh;
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  z-index: 2999;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 0.58vh);
    .bg-image("~@/assets/images/map-ico/map-rate-bg");
    z-index: -1;
  }

  .supervise-title {
    display: block;
    text-align: left;
    height: 2.32vh;
    line-height: 2.32vh;
    font-family: YouSheBiaoTiHei;
    font-size: 1.78vh;
    font-weight: 600;
    text-shadow: 0vh 0.13vh 0.27vh rgba(0, 0, 0, 0.8);
    padding-left: 1.1vh;
  }

  .supervise-close {
    width: 1.34vh;
    height: 1.34vh;
    position: absolute;
    top: 0.53vh;
    right: 0.04vh;
    .bg-image("~@/assets/images/detail/space-result-close");
    cursor: pointer;
    z-index: 99;
  }

  .supervise-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 2.09vh 1.42vh 1.16vh;

    .rate-box-header {
      display: flex;
      align-items: center;
      padding-bottom: 1.2vh;
      border-bottom: solid 0.04vh #4a4949;

      .left {
        width: 8.55vh;
        height: 5.39vh;

        .item-thumb {
          width: 100%;
          height: 100%;
          border-radius: 0.27vh;
        }
      }

      .right {
        flex: 1;
        padding-left: 0.85vh;
        font-family: PingFang;

        .name {
          display: block;
          width: 100%;
          height: 2.14vh;
          line-height: 2.14vh;
          text-align: left;
          font-weight: 600;
          font-size: 1.51vh;
          margin-bottom: 0.62vh;
        }

        .rate-box {
          display: flex;
          align-items: center;

          > span {
            font-size: 1.34vh;
            color: #fff;
            padding-right: 2.27vh;
          }

          > div {
            display: flex;
            align-items: center;
          }
        }
      }
    }

    .comment-history {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding-top: 1.02vh;

      .comment-title {
        display: flex;
        align-items: center;
        text-align: left;
        font-family: PingFang;
        font-size: 1.34vh;
        margin-bottom: 0.62vh;

        span {
          &:first-child {
            display: block;
            width: 0.45vh;
            height: 0.4vh;
            background-color: #21b2ff;
            border-radius: 50%;
            margin-right: 0.45vh;
          }
        }
      }

      .comment-body {
        flex: 1;
        height: 0;

        .comment-list {
          height: 100%;
          overflow-y: auto;
          padding: 0 1.56vh;
          background-color: rgba(0, 33, 54, 0.8);

          .comment-item {
            padding: 0.93vh 0.8vh 2vh 0.45vh;
            border-bottom: solid 0.04vh #4a4949;

            &:last-child {
              padding-bottom: 1.11vh;
              border: 0;
            }

            .comment-header {
              display: flex;
              align-items: center;
              margin-bottom: 0.31vh;

              .left {
                width: 2.94vh;
                height: 2.94vh;

                .avatar {
                  width: 100%;
                  height: 1005;
                }
              }

              .right {
                flex: 1;
                padding-left: 0.89vh;
                font-family: PingFang;

                .name {
                  display: block;
                  width: 100%;
                  height: 1.87vh;
                  line-height: 1.87vh;
                  text-align: left;
                  font-size: 1.34vh;
                }

                .right-rate {
                  width: 100%;
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;

                  .time {
                    font-size: 0.71vh;
                  }
                }
              }
            }

            .comment-content {
              text-align: justify;
              font-family: PingFang;
              font-size: 1.07vh;
              color: #fff;
            }
          }
        }
      }
    }
  }
}

// 滚动条
*::-webkit-scrollbar {
  width: 0.38vh;
}

*::-webkit-scrollbar-thumb {
  border-radius: 0.19vh;
  background-color: #165fea;
}

*::-webkit-scrollbar-track {
  border-radius: 0;
  background-color: #000;
}
</style>