<template>
  <div id="header" class="header-wrapper">
    <span class="toplab">智慧塘河</span>
    <!-- 路由 -->
    <div id="nav">
      <router-link to="/">资源一张图</router-link>
      <router-link to="/decision">辅助决策</router-link>
    </div>
    <div class="logo-left">
      <img src="@/assets/images/widget/现代集团.png" class="logo" />
    </div>
    <div class="logo-right">
      <img src="@/assets/images/widget/设计集团.png" class="logo" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="less">
.header-wrapper {
  position: fixed;
  width: 100%;
  height: 10.68vh;
  background: linear-gradient(180deg, #0f4dd8 0%, rgba(15, 77, 216, 0) 100%);
  z-index: 2;

  .toplab {
    display: inline-block;
    font-family: YouSheBiaoTiHei;
    font-size: 5.92vh;
    font-weight: 400;
    height: 6.44vh;
    line-height: 6.44vh;
    color: #fff;
    text-shadow: 0vh 0.75vh 0.75vh #0036a2;
    margin-top: 0.88vh;
  }

  #nav {
    a {
      position: absolute;
      top: 2.69vh;
      height: 4.06vh;
      line-height: 3.94vh;
      font-family: YouSheBiaoTiHei;
      font-size: 3.76vh;
      color: #fff;
      text-shadow: 0vh 0.75vh 0.75vh #0036a2;
      opacity: 0.6;
      text-decoration: none;

      &:first-child {
        left: 30.43%;
      }

      &:last-child {
        right: 31.29%;
      }

      &.router-link-exact-active {
        color: #00e2ff;
        opacity: 1;
      }
    }
  }

  .logo-left,
  .logo-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;

    .logo {
      height: 3.6vh;
    }
  }

  .logo-left {
    top: 2.44vh;
    left: 4.53vh;
  }

  .logo-right {
    top: 2.31vh;
    right: 4vh;
  }
}
</style>