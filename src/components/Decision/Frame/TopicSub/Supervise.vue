<template>
  <div class="supervise">
    <span class="supervise-title">打分</span>
    <i class="supervise-close" @click="$parent.superviseShow = false"></i>
    <div class="supervise-body">
      <div class="rate-box-header">
        <div class="left">
          <img class="item-thumb" :src="
              detailData.photos && detailData.photos.length
                ? `${MediaServer}/${detailData.photos[0].path}`
                : require(`@/assets/images/maptools/暂无图片.png`)
            " />
        </div>
        <div class="right">
          <span class="name">{{ detailData.name }}</span>
          <div class="rate-box">
            <span>总体评分</span>
            <el-rate v-model="detailData.star"></el-rate>
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
            <div
              class="comment-item"
              v-for="item in commentList"
              :key="item.id"
            >
              <div class="comment-header">
                <div class="left">
                  <img class="avatar" src="@/assets/images/detail/avatar.png" />
                </div>
                <div class="right">
                  <span class="name">{{ item.name }}</span>
                  <div class="right-rate">
                    <el-rate
                      class="comment-rate"
                      disabled
                      v-model="item.star"
                    ></el-rate>
                    <span class="time">{{ item.createTime }}</span>
                  </div>
                </div>
              </div>
              <div class="comment-content">{{ item.commend }}</div>
            </div>
            <div class="comment-item" v-if="!commentList.length">
              <span class="no-data">暂无评论</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MediaServer } from "@/config/mapConfig";
import { getProjectDetail, resourceComment } from "@/api/tangheAPI";
export default {
  data() {
    return {
      MediaServer,
      // value: null,
      detailData: {},
      commentList: [],
    };
  },
  methods: {
    fixData(res) {
      // this.detailData = res;
      // this.value = res.attributes.STAR || 0;
      this.initData(res.attributes.RESOURCE_ID);
    },
    async initData(id) {
      let {data} = await getProjectDetail({ id });
      if (data.code === 200) {
        this.detailData = data.result;
        this.getCommentList(id);
        this.showSupervise = true;
      }
    },
    // 获取评论
    async getCommentList(id) {
      this.commentList = [];
      const { data } = await resourceComment({
        resourceId: id
      });

      if (data.code === 200) {
        this.commentList = data.result.records;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.supervise {
  display: flex;
  flex-direction: column;
  width: 51.34vh;
  height: 38.36vh;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  z-index: 2999;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 0.7vh);
    .bg-image("~@/assets/images/map-ico/map-rate-bg");
    z-index: -1;
  }

  .supervise-title {
    display: block;
    text-align: left;
    height: 2.78vh;
    line-height: 2.78vh;
    font-family: YouSheBiaoTiHei;
    font-size: 2.13vh;
    font-weight: 600;
    text-shadow: 0vh 0.13vh 0.27vh rgba(0, 0, 0, 0.8);
    padding-left: 1.32vh;
  }

  .supervise-close {
    width: 1.6vh;
    height: 1.6vh;
    position: absolute;
    top: 0.63vh;
    right: 0.05vh;
    .bg-image("~@/assets/images/detail/space-result-close");
    cursor: pointer;
    z-index: 99;
  }

  .supervise-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 2.51vh 1.7vh 1.39vh;

    .rate-box-header {
      display: flex;
      align-items: center;
      padding-bottom: 1.44vh;
      border-bottom: solid 0.05vh #4a4949;

      .left {
        width: 10.26vh;
        height: 6.47vh;

        .item-thumb {
          width: 100%;
          height: 100%;
          border-radius: 0.27vh;
        }
      }

      .right {
        flex: 1;
        padding-left: 1.02vh;
        font-family: PingFang;

        .name {
          display: block;
          width: 100%;
          height: 2.57vh;
          line-height: 2.57vh;
          text-align: left;
          font-weight: 600;
          font-size: 1.81vh;
          margin-bottom: 0.74vh;
        }

        .rate-box {
          display: flex;
          align-items: center;

          > span {
            font-size: 1.61vh;
            color: #fff;
            padding-right: 2.72vh;
          }

          .el-rate {
            display: flex;
            align-items: center;

            /deep/ .el-rate__icon {
              font-size: 1.29vh !important;
              margin-right: 0.62vh !important;
            }
          }
        }
      }
    }

    .comment-history {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding-top: 1.22vh;

      .comment-title {
        display: flex;
        align-items: center;
        text-align: left;
        font-family: PingFang;
        font-size: 1.61vh;
        margin-bottom: 0.74vh;

        span {
          &:first-child {
            display: block;
            width: 0.54vh;
            height: 0.48vh;
            background-color: #21b2ff;
            border-radius: 50%;
            margin-right: 0.54vh;
          }
        }
      }

      .comment-body {
        flex: 1;
        height: 0;

        .comment-list {
          height: 100%;
          overflow-y: auto;
          padding: 0 1.87vh;
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
              margin-bottom: 0.43vh;

              .left {
                width: 3.53vh;
                height: 3.53vh;

                .avatar {
                  width: 100%;
                  height: 100%;
                }
              }

              .right {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 3.53vh;
                padding-left: 0.89vh;
                font-family: PingFang;

                .name {
                  display: block;
                  width: 100%;
                  height: 1.8vh;
                  line-height: 1.8vh;
                  text-align: left;
                  font-size: 1.31vh;
                }

                .right-rate {
                  width: 100%;
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;

                  .comment-rate {
                    height: unset;
                    /deep/ .el-rate__icon {
                      font-size: 0.67vh;
                      margin-right: 0.22vh;
                    }
                  }

                  .time {
                    display: block;
                    height: 1.17vh;
                    line-height: 1.17vh;
                    font-size: 0.85vh;
                  }
                }
              }
            }

            .comment-content {
              text-align: justify;
              font-family: PingFang;
              font-size: 1.28vh;
              color: #fff;
            }

            .no-data {
              display: block;
              height: 3vh;
              line-height: 3vh;
              text-align: center;
              font-family: YouSheBiaoTiHei;
              font-size: 1.5vh;
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