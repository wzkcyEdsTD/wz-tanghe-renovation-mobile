<template>
  <div class="mark">
    <div class="left">
      <ul class="zrdw-list">
        <li
          class="zrdw-item"
          :class="{ active: currentZrdw == item.title }"
          v-for="(item, index) in zrdwList"
          :key="index"
          @click="selectZrdw(item)"
        >
          <span>{{ item.title }}</span>
        </li>
      </ul>
    </div>
    <div class="right">
      <div class="header">
        <img src="@/assets/images/mark/title.png">
      </div>
      <div class="info">
        <div class="name-wrapper">
          <span class="text">您的名字：</span>
          <el-input
            v-model="nameValue"
            class="nameInput"
            placeholder="请输入您的姓名"
            size="small"
          />
        </div>
        <div class="desc">以下对各参比单位进行测评打分，每个打分项的分值区间均为0-100。请依次完成所有参比单位的评分后并提交。</div>
      </div>
      <div class="mark-content">
        <div class="title">
          参比单位：{{currentZrdw}}
        </div>
        <div class="mark-list">
          <div class="list-header">
            <div class="index">序号</div>
            <div class="norm">指标</div>
            <div class="score">得分</div>
          </div>
          <div class="list-content">
            <div class="indexValue">1</div>
            <div class="normValue">是否是否是否是否是否是否是否是否是否是否</div>
            <div class="scoreValue">
              <el-input
                v-model="scoreValue"
                class="scoreInput"
                placeholder="请打分"
                size="small"
              />
            </div>
          </div>
          <div class="list-content">
            <div class="indexValue">2</div>
            <div class="normValue">是否是否是否是否是否是否是否是否是否是否</div>
            <div class="scoreValue">
              <el-input
                v-model="scoreValue"
                class="scoreInput"
                placeholder="请打分"
                size="small"
              />
            </div>
          </div>
          <div class="list-content">
            <div class="indexValue">3</div>
            <div class="normValue">是否是否是否是否是否是否是否是否是否是否</div>
            <div class="scoreValue">
              <el-input
                v-model="scoreValue"
                class="scoreInput"
                placeholder="请打分"
                size="small"
              />
            </div>
          </div>
          <div class="list-content">
            <div class="indexValue">4</div>
            <div class="normValue">是否是否是否是否是否是否是否是否是否是否</div>
            <div class="scoreValue">
              <el-input
                v-model="scoreValue"
                class="scoreInput"
                placeholder="请打分"
                size="small"
              />
            </div>
          </div>
          <div class="list-content">
            <div class="indexValue">5</div>
            <div class="normValue">是否是否是否是否是否是否是否是否是否是否</div>
            <div class="scoreValue">
              <el-input
                v-model="scoreValue"
                class="scoreInput"
                placeholder="请打分"
                size="small"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="desc">
          已打分：1/35 项
        </div>
        <div class="desc">
          未打分：1/35 项
        </div>
        <div class="submit">提交</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nameValue: '',
      scoreValue: '',
      currentZrdw: '鹿城区政府',
      zrdwList: [
        { title: "鹿城区政府", value: "lucheng" },
        { title: "龙湾区政府", value: "longwan" },
        { title: "瓯海区政府", value: "ouhai" },
        { title: "瑞安市政府", value: "ruian" },
        { title: "浙南产业区", value: "zhenan" },
        { title: "市城发集团", value: "chengfa" },
        { title: "市现代集团", value: "xiandai" },
      ],
    };
  },
  methods: {
    selectZrdw(item) {
      this.currentZrdw = item.title
    }
  }
};
</script>

<style lang="less" scoped>
.mark {
  .bg-image(@url) {
    background: url("@{url}.png") no-repeat center;
    background-size: 100% 100%;
  }
  width: 100%;
  height: 100%;
  background-color: #010C27;
  display: flex;
  .left {
    padding: 0.5vh 0;
    .zrdw-list {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #fff;
      .zrdw-item {
        display: flex;
        align-items: center;
        width: 20px;
        height: 13vh;
        line-height: 1;
        padding: 0 1vh;
        font-size: 2vh;
        font-family: YouSheBiaoTiHei;
        text-align: center;
        .bg-image("../assets/images/mark/zrdw-bg");
        cursor: pointer;
        &.active {
          .bg-image("../assets/images/mark/zrdw-active-bg");
        }
      }
    }
  }
  .right {
    position: relative;
    flex: 1;
    padding: 0 10px;
    z-index: 999;
    .header {
      >img {
        width: 80%;
      }
    }
    .info {
      .name-wrapper {
        width: 60%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        .text {
          color: #52FEF2;
          white-space: nowrap;
        }
        .nameInput {
          width: 125px;
        }
      }
      .desc {
        margin-top: 10px;
        line-height: 1.5;
        font-size: 12px;
        color: #52FEF2;
        text-align: left;
      }
    }
    .mark-content {
      margin-top: 10px;
      text-align: left;
      .title {
        height: 3vh;
        line-height: 3vh;
        font-family: YouSheBiaoTiHei;
        font-size: 18px;
        letter-spacing: 0px;
        color: #ffffff;
        text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.64);
        position: relative;
        padding-left: 10px;
      }
      .title::before {
        content: "";
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 1.5vh;
        z-index: -1;
        background-image: linear-gradient(90deg, #1950B9 0%, transparent 100%);
        transform: skewX(-30deg);
      }
      .mark-list {
        margin-top: 15px;
        .list-header {
          display: flex;
          font-size: 12px;
          color: #52FEF2;
          text-align: center;
          .index {
            flex: 1;
          }
          .norm {
            flex: 5;
            border-left: 1px solid #52FEF2;
            border-right: 1px solid #52FEF2;
          }
          .score {
            flex: 2;
          }
        }
        .list-content {
          display: flex;
          align-items: center;
          text-align: center;
          height: 55px;
          margin-top: 15px;
          border: 1px solid #3E73D8;
          background-color: #233357;
          font-size: 12px;
          .indexValue {
            width: 20px;
            height: 20px;
            margin: 0 10px;
            color: #fff;
            border: 1px solid #fff;
            border-radius: 50%;
          }
          .normValue {
            flex: 6;
            color: #fff;
            text-align: left;
          }
          .scoreValue {
            flex: 2;
            padding: 0 5px;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 55px;
      padding-left: 15px;
      .bg-image("../assets/images/mark/bottom-bg");
      display: flex;
      align-items: center;
      .desc {
        margin-left: 20px;
        font-size: 12px;
        color: #52FEF2;
      }
      .submit {
        margin-left: 20px;
        width: 70px;
        height: 32px;
        line-height: 32px;
        background-color: #396390;
        border: 1px solid #3E73D8;
        color: #233357;
      }
    }
  }
}
</style>
<style>
.el-input__inner {
  background: transparent !important;
  padding: 0 10px !important;
  border: 1px solid #52FEF2 !important;
  border-radius: 0 !important;
  color: white !important;
}
</style>