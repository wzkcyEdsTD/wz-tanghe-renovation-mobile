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
        <img src="@/assets/images/mark/title.png" />
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
        <div class="desc">
          以下对各参比单位进行测评打分，每个打分项的分值区间均为0-100。请依次完成所有参比单位的评分后并提交。
        </div>
      </div>
      <div class="mark-content">
        <div class="title">
          <p>参比单位：{{ currentZrdw }}</p>
          <p class="total">总分：{{currentData.total}}</p>
        </div>
        <div class="mark-list">
          <div class="list-header">
            <div class="index">序号</div>
            <div class="norm">指标</div>
            <div class="score">得分</div>
          </div>
          <div class="list-content" v-for="(item,index) in currentData.items" :key="item.normxh">
            <div class="indexValue">{{item.normxh}}</div>
            <div class="normValue">
              {{item.normname}}
            </div>
            <div class="scoreValue">
              <el-input
                type="number"
                v-model="item.score"
                class="scoreInput"
                placeholder="请打分"
                size="small"
                @change="numberChange($event,index)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="desc">已打分：{{this.marked}}/{{this.totalLength}} 项</div>
        <div class="desc">未打分：{{this.totalLength - this.marked}}/{{this.totalLength}} 项</div>
        <button class="submit" :class="{active: marked==totalLength&&nameValue.length}" :disabled="marked<totalLength||!nameValue.length" @click="submit">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
import { addBatch } from "@/api/tangheAPI";
export default {
  data() {
    return {
      nameValue: "",
      zrdwList: [
        {
          title: "鹿城区政府",
          value: "lucheng",
          items: [
            { normxh: 1, normname: "第一指标", score: "" },
            { normxh: 2, normname: "第二指标", score: "" },
            { normxh: 3, normname: "第三指标", score: "" },
            { normxh: 4, normname: "第四指标", score: "" },
            { normxh: 5, normname: "第五指标", score: "" },
          ],
          total: 0
        },
        {
          title: "龙湾区政府",
          value: "longwan",
          items: [
            { normxh: 1, normname: "第一指标", score: "" },
            { normxh: 2, normname: "第二指标", score: "" },
            { normxh: 3, normname: "第三指标", score: "" },
            { normxh: 4, normname: "第四指标", score: "" },
            { normxh: 5, normname: "第五指标", score: "" },
          ],
          total: 0
        },
        {
          title: "瓯海区政府",
          value: "ouhai",
          items: [
            { normxh: 1, normname: "第一指标", score: "" },
            { normxh: 2, normname: "第二指标", score: "" },
            { normxh: 3, normname: "第三指标", score: "" },
            { normxh: 4, normname: "第四指标", score: "" },
            { normxh: 5, normname: "第五指标", score: "" },
          ],
          total: 0
        },
        {
          title: "瑞安市政府",
          value: "ruian",
          items: [
            { normxh: 1, normname: "第一指标", score: "" },
            { normxh: 2, normname: "第二指标", score: "" },
            { normxh: 3, normname: "第三指标", score: "" },
            { normxh: 4, normname: "第四指标", score: "" },
            { normxh: 5, normname: "第五指标", score: "" },
          ],
          total: 0
        },
        {
          title: "浙南产业区",
          value: "zhenan",
          items: [
            { normxh: 1, normname: "第一指标", score: "" },
            { normxh: 2, normname: "第二指标", score: "" },
            { normxh: 3, normname: "第三指标", score: "" },
            { normxh: 4, normname: "第四指标", score: "" },
            { normxh: 5, normname: "第五指标", score: "" },
          ],
          total: 0
        },
        {
          title: "市城发集团",
          value: "chengfa",
          items: [
            { normxh: 1, normname: "第一指标", score: "" },
            { normxh: 2, normname: "第二指标", score: "" },
            { normxh: 3, normname: "第三指标", score: "" },
            { normxh: 4, normname: "第四指标", score: "" },
            { normxh: 5, normname: "第五指标", score: "" },
          ],
          total: 0
        },
        {
          title: "市现代集团",
          value: "xiandai",
          items: [
            { normxh: 1, normname: "第一指标", score: "" },
            { normxh: 2, normname: "第二指标", score: "" },
            { normxh: 3, normname: "第三指标", score: "" },
            { normxh: 4, normname: "第四指标", score: "" },
            { normxh: 5, normname: "第五指标", score: "" },
          ],
          total: 0
        },
      ],
      currentZrdw: "鹿城区政府",
      date: '',
      marked: 0
    };
  },
  computed: {
    currentData() {
      let result = []
      this.zrdwList.forEach(item => {
        if (item.title === this.currentZrdw) {
          result = item
        }
      })
      return result
    },
    totalLength() {
      let result = 0
      this.zrdwList.forEach(item => {
        result += item.items.length
      })
      return result
    }
  },
  methods: {
    selectZrdw(item) {
      this.currentZrdw = item.title;
    },
    getCurrentDate() {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let date = now.getDate();
      month < 10 ? '0' + month : month
      date < 10 ? '0' + date : date
      this.date = `${year}-${month}-${date}`
    },
    numberChange(val, index) {
      let integer = /^(-|\+)?\d+$/;
      if (integer.test(val)) {
        if (val > 100) {
          this.currentData.items[index].score = 100
        }
        if (val < 0) {
          this.currentData.items[index].score = 0
        }
        this.marked++
      } else {
        this.marked--
      }
      let temp = 0
      this.currentData.items.forEach(item => {
        temp += Number(item.score)
      })
      this.currentData.total = temp
    },
    async submit() {
      let data = []
      this.zrdwList.forEach(zrdw => {
        zrdw.items.forEach(item => {
          data.push({
            meetDate: this.date,
            name: this.nameValue,
            normxh: item.normxh,
            normname: item.normname,
            score: item.score,
            sysOrgCode: zrdw.title
          })
        })
      })
      console.log('submit', data)
      let res = await addBatch(data)
      console.log('res', res)
      if (res.data.code === 200) {
        this.$message({
          message: '评测打分成功！',
          type: 'success',
          offset: 300,
          showClose: true,
          duration: 0
        });
      } else {
        this.$message({
          message: '评测打分失败！',
          type: 'error',
          offset: 300,
          showClose: true,
          duration: 0
        });
      }
    }
  },
  mounted() {
    this.getCurrentDate()
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
  background-color: #010c27;
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
      margin-top: 2vh;
      > img {
        width: 80%;
      }
    }
    .info {
      margin-top: 2vh;
      .name-wrapper {
        width: 60%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        .text {
          color: #52fef2;
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
        color: #52fef2;
        text-align: left;
      }
    }
    .mark-content {
      margin-top: 10px;
      text-align: left;
      .title {
        display: flex;
        height: 3vh;
        line-height: 3vh;
        font-family: YouSheBiaoTiHei;
        font-size: 18px;
        letter-spacing: 0px;
        color: #ffffff;
        text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.64);
        position: relative;
        padding-left: 10px;
        .total {
          margin-left: 70px;
          font-family: auto;
          font-size: 12px;
        }
      }
      .title::before {
        content: "";
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 1.5vh;
        z-index: -1;
        background-image: linear-gradient(90deg, #1950b9 0%, transparent 100%);
        transform: skewX(-30deg);
      }
      .mark-list {
        margin-top: 15px;
        .list-header {
          display: flex;
          font-size: 12px;
          color: #52fef2;
          text-align: center;
          .index {
            flex: 1;
          }
          .norm {
            flex: 5;
            border-left: 1px solid #52fef2;
            border-right: 1px solid #52fef2;
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
          border: 1px solid #3e73d8;
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
        color: #52fef2;
      }
      .submit {
        margin-left: 20px;
        width: 60px;
        height: 32px;
        line-height: 32px;
        background-color: #396390;
        border: 1px solid #3e73d8;
        color: #233357;
        font-weight: bold;
        &.active {
          background-color: #52FEF2;
        }
      }
    }
  }
}
</style>
<style>
.el-input__inner {
  background: transparent !important;
  padding: 0 10px !important;
  border: 1px solid #52fef2 !important;
  border-radius: 0 !important;
  color: white !important;
}
.el-message {
  min-width: 0 !important;
}
</style>