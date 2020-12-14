<template>
  <div class="mark">
    <div class="header">
      <div class="logo-wrapper">
        <img src="@/assets/images/mark/left-logo.png" />
      </div>
      <div class="title">智慧塘河</div>
      <div class="logo-wrapper">
        <img src="@/assets/images/mark/right-logo.png" />
      </div>
    </div>
    <div class="content">
      <div class="title-wrapper">
        <img src="@/assets/images/mark/title2.png" />
      </div>
      <div class="list-wrapper">
        <div class="input-wrapper">
          <el-input
            class="name-input"
            v-model="nameValue"
            placeholder="请输入姓名"
            :disabled="submited"
          ></el-input>
        </div>
        <div class="list-box">
          <div class="mark-list">
            <div
              class="mark-item"
              v-for="(item, index) in zrdwList"
              :key="index"
            >
              <div class="top">
                <img
                  :src="require(`@/assets/images/mark/index${index + 1}.png`)"
                />
              </div>
              <div class="center">
                <img :src="require(`@/assets/images/mark/${item.value}.png`)" />
                <p class="name">{{ item.label }}</p>
              </div>
              <div class="bottom">
                <el-input
                  type="number"
                  v-model="item.score"
                  placeholder="请打分"
                  onkeyup="value=value.replace(/[^\d]/g,'')"
                  :disabled="submited"
                  @change="numberChange($event, index)"
                ></el-input>
              </div>
            </div>
          </div>
          <div class="desc">
            <div>已打分：{{ this.marked }}/{{ zrdwList.length }}项</div>
            <div>
              未打分：{{ zrdwList.length - this.marked }}/{{
                zrdwList.length
              }}项
            </div>
          </div>
        </div>
        <div class="btn-wrapper">
          <div v-show="submited" class="btn-item submited">已提交</div>
          <div v-show="submited" class="back" @click="submited = false">
            <img src="@/assets/images/mark/back.png" />
          </div>
          <button v-show="!submited" class="btn-item submit" :disabled="btnLock" @click="submit">提交</button>
        </div>
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
          label: "鹿城区政府",
          value: "lucheng",
          score: "",
        },
        {
          label: "龙湾区政府",
          value: "longwan",
          score: "",
        },
        {
          label: "瓯海区政府",
          value: "ouhai",
          score: "",
        },
        
        {
          label: "瑞安市政府",
          value: "ruian",
          score: "",
        },
        {
          label: "浙南产业区",
          value: "zhenan",
          score: "",
        },
        {
          label: "市城发集团",
          value: "chengfa",
          score: "",
        },
        {
          label: "市现代集团",
          value: "xiandai",
          score: "",
        },
      ],
      date: "",
      marked: 0,
      submited: false,
      btnLock: false
    };
  },
  methods: {
    getCurrentDate() {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let date = now.getDate();
      month < 10 ? "0" + month : month;
      date < 10 ? "0" + date : date;
      this.date = `${year}-${month}-${date}`;
    },
    numberChange(val, index) {
      if (val > 100) {
        this.zrdwList[index].score = 100;
      }
      if (val < 0) {
        this.zrdwList[index].score = 0;
      }
      this.marked = 0;
      this.zrdwList.forEach((zrdw) => {
        if (zrdw.score) {
          this.marked++;
        }
      });
    },
    async submit() {
      if (this.marked < this.zrdwList.length || !this.nameValue) {
        return this.$message({
          message: "请先完成输入",
          type: "warning",
          offset: 300,
        });
      }
      this.btnLock = true
      let data = [];
      this.zrdwList.forEach((zrdw) => {
        data.push({
          meetDate: this.date,
          name: this.nameValue,
          score: zrdw.score,
          sysOrgCode: zrdw.label,
        });
      });
      console.log("submit", data);
      let res = await addBatch(data);
      console.log("res", res);
      if (res.data.code === 200) {
        this.btnLock = false
        this.submited = true;
        this.$message({
          message: "评测打分成功！",
          type: "success",
          offset: 300,
          showClose: true,
          duration: 4000,
        });
      } else {
        this.btnLock = false
        this.$message({
          message: "评测打分失败！",
          type: "error",
          offset: 300,
          showClose: true,
          duration: 3000,
        });
      }
    },
  },
  mounted() {
    // 解决安卓移动端软键盘弹出顶起页面、遮挡输入框
    const originalHeight =
      document.documentElement.clientHeight || document.body.clientHeight;
    window.onresize = () => {
      return (() => {
        //键盘弹起与隐藏都会引起窗口的高度发生变化
        const resizeHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        if (resizeHeight - 0 < originalHeight - 0) {
          document
            .querySelector("body")
            .setAttribute("style", "height:" + originalHeight + "px;");
        } else {
          document.querySelector("body").setAttribute("style", "height:100%;");
        }
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
          window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded()
          }, 0)
        }
      })();
    };

    this.getCurrentDate();
  },
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
  .bg-image("../assets/images/mark/bg");
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1vh 3vh 3vh 3vh;
    background-image: linear-gradient(
      180deg,
      #0f4dd8 0%,
      rgba(15, 77, 216, 0) 100%
    );
    .logo-wrapper {
      > img {
        height: 2.5vh;
      }
    }
    .title {
      font-family: YouSheBiaoTiHei;
      font-size: 5vh;
      color: #fff;
    }
  }
  .content {
    margin-top: 2%;
    padding: 0 4%;
    .title-wrapper {
      > img {
        width: 70%;
      }
    }
    .list-wrapper {
      position: relative;
      background-color: rgba(205, 220, 253, 0.5);
      border: solid 2px #22b3ff;
      border-radius: 10px;
      .input-wrapper {
        position: absolute;
        top: -8%;
        left: 50%;
        transform: translateX(-50%);
        .bg-image("../assets/images/mark/name-bg");
      }
      .list-box {
        margin: 2vh;
        padding: 4vh 2vh 2vh 2vh;
        background-color: #000a10;
        border-radius: 10px;
        .mark-list {
          display: flex;
          .mark-item {
            position: relative;
            margin-right: 10px;
            background-color: #333c52;
            border-radius: 10px;
            border: solid 1px #4b82ff;
            .top {
              position: absolute;
              top: -8%;
              left: 50%;
              width: 38%;
              transform: translateX(-50%);
              > img {
                width: 90%;
              }
            }
            .center {
              position: relative;
              margin: 30% auto 10% auto;
              padding: 10%;
              > img {
                width: 100%;
                border-radius: 10px;
                border: solid 2px #4b82ff;
              }
              .name {
                position: absolute;
                bottom: 5px;
                left: 50%;
                width: 70%;
                transform: translateX(-50%);
                .bg-image("../assets/images/mark/zrdw2-bg");
                color: #fff;
                font-size: 12px;
                white-space: nowrap;
              }
            }
            .bottom {
              margin: 0 auto 2vh auto;
              width: 60%;
            }
            &:last-child {
              margin-right: 0;
            }
          }
        }
        .desc {
          display: flex;
          justify-content: flex-end;
          margin-top: 2vh;
          color: #a3eaff;
          > div {
            margin-left: 3vh;
          }
        }
      }
      .btn-wrapper {
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        .btn-item {
          // width: 11vh;
          // height: 3.6vh;
          // line-height: 3.6vh;
          width: 100px;
          height: 33px;
          line-height: 33px;
          color: #fff;
        }
        .submit {
          border: none;
          .bg-image("../assets/images/mark/submit");
        }
        .submited {
          .bg-image("../assets/images/mark/submited");
        }
        .back {
          position: absolute;
          top: 0;
          right: -55px;
          > img {
            height: 33px;
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.el-input__inner {
  background: #010c27 !important;
  padding: 0 10px !important;
  border: 1px solid #4b82ff !important;
  border-radius: 0 !important;
  color: white !important;
  font-size: 16px;
  text-align: center;
}
.el-message {
  min-width: 0 !important;
}
.name-input {
  .el-input__inner {
    background: transparent !important;
    border: none !important;
  }
}
</style>