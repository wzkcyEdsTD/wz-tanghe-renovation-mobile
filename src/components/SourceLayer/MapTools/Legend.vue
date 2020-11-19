<template>
  <div class="legend">
    <img src="@/assets/images/maptools/legend.png" />
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.legend {
  position: fixed;
  bottom: 5vh;
  right: 3.5vh;
  z-index: 999;

  img {
    width: 11.25vh;
    height: 18.75vh;
  }
}
</style>