<template>
  <div id="header" class="header-wrapper">
    <span class="toplab">智慧塘河</span>
    <div class="logo-left">
      <img src="@/assets/images/widget/现代集团.png" class="logo" />
    </div>
    <div class="logo-right">
      <!-- <span class="info">{{ date }} {{ times }}</span> -->
      <img src="@/assets/images/widget/设计集团.png" class="logo" />
    </div>
  </div>
</template>

<script>
import { getDate } from "@/common/js/util";
export default {
  data() {
    return {
      date: "",
      times: "",
    };
  },
  mounted() {
    // this.setTime();
    // setInterval(() => {
    //   this.setTime();
    // }, 1000);
  },
  methods: {
    // 设置时间
    setTime() {
      const time = getDate();
      this.date = time.split("@")[0];
      this.times = time.split("@")[1];
    },
  },
};
</script>

<style scoped lang="less">
.header-wrapper {
  position: fixed;
  width: 100%;
  height: 10.68vh;
  background: linear-gradient(180deg, #0F4DD8 0%, rgba(15, 77, 216, 0) 100%);
  z-index: 2;

  .toplab {
    display: inline-block;
    font-family: YouSheBiaoTiHei;
    font-size: 4.94vh;
    font-weight: 400;
    height: 6.44vh;
    line-height: 6.44vh;
    color: #FFF;
    text-shadow: 0vh 0.75vh 0.75vh #0036a2;
    margin-top: 0.88vh;
  }

  .logo-left,
  .logo-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;

    .logo {
      height: 3vh;
    }
  }

  .logo-left {
    top: 2.44vh;
    left: 4.53vh;
  }

  .logo-right {
    top: 2.31vh;
    right: 4vh;

    .info {
      display: inline-block;
      color: #FFF;
      font-family: PingFang;
      font-weight: 600;
      font-size: 2.25vh;
      opacity: 0.8;
      margin-right: 2vh;
    }
  }
}
</style>