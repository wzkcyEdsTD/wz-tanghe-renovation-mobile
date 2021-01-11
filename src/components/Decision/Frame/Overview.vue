<template>
  <div class="Overview">
    <i class="close" @click="close"></i>
    <iframe :src="src"></iframe>
  </div>
</template>

<script>
export default {
  props: ["src"],
  methods: {
    close() {
      this.$parent.overShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
.Overview {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: all 1s;
  background: rgba(19, 45, 85, 0.9);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  z-index: 9999;

  .close {
    position: absolute;
    top: 6%;
    right: 3%;
    width: 32px;
    height: 32px;
    background-image: url("~@/assets/images/detail/overview-close.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    z-index: 99;
  }

  iframe {
    width: 100%;
    height: 80%;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
}
</style>