<template>
  <div class="space-tool">
    <div class="space-tool-inner">
      <div
        class="tool-item"
        :class="{ active: currentIndex == index }"
        v-for="(item, index) in toolList"
        :key="index"
        @click="spaceChange(item, index)"
      >
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toolList: [
        {
          id: "标绘",
          label: "空间标绘",
        },
        {
          id: "量算",
          label: "空间量算",
        },
        {
          id: "分析",
          label: "空间分析",
        },
      ],
      currentIndex: null,
    };
  },
  methods: {
    // 空间工具操作
    spaceChange(item, index) {
      if (!("id" in item)) return;
      // 单选，可点击关闭
      this.currentIndex = this.currentIndex == index ? null : index;
    },
  },
};
</script>

<style lang="less" scoped>
.space-tool {
  position: fixed;
  top: 9.81vh;
  left: 50%;
  transform: translateX(-50%);
  width: 63.5vh;
  height: 3.5vh;
  .bg-image("~@/assets/images/maptools/spacetool-bg");
  z-index: 99;

  .space-tool-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 38.75vh;
    height: 100%;
    margin: auto;
    padding: 0 5vh;
    box-sizing: border-box;

    .tool-item {
      height: 2.31vh;
      font-family: PingFang;
      font-size: 1.63vh;
      line-height: 2.31vh;
      color: #fff;
      opacity: 0.6;
      cursor: pointer;

      &.active {
        position: relative;
        color: #69fee5;
        opacity: 1;

        &::before {
          content: "";
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: -1.5vh;
          width: 0.63vh;
          height: 0.63vh;
          border-radius: 50%;
          background-color: #69fee5;
        }
      }
    }
  }
}
</style>