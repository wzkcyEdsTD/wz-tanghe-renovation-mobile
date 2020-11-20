<template>
  <div id="app">
    <div class="content">
      <router-view />
    </div>
    <MVideo />
  </div>
</template>

<script>
import MVideo from "@/components/Widget/MVideo";
export default {
  components: { MVideo },
};
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  text-align: center;

  > .content {
    width: 100%;
    height: 100%;

    > * {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
  }
}
</style>