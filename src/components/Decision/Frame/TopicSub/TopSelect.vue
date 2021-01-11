<template>
  <div class="top-select">
    <span class="top-select-line"></span>
    <el-popover
      placement="bottom"
      trigger="click"
      v-model="visible"
      :visible-arrow="false"
      popper-class="select-pop"
    >
      <ul>
        <li
          v-for="item in options"
          :key="item.value"
          :class="{ selected: item.value == value }"
          @click="selected(item.value)"
        >
          <span>{{ item.label }}</span>
        </li>
      </ul>
      <el-input
        slot="reference"
        placeholder="请选择"
        readonly="readonly"
        v-model="value"
      >
        <i
          slot="suffix"
          class="el-input__icon input-suffix"
          :class="{ active: visible }"
          @click="$parent.visible = !$parent.visible"
        ></i>
      </el-input>
    </el-popover>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      visible: false,
    };
  },

  props: {
    list: Array,
    value: String,
  },

  mounted() {
    this.fixOptions();
  },
  methods: {
    // 组装数据
    fixOptions() {
      this.options = [];
      this.list.map((item) => {
        this.options.push({
          label: item,
          value: item,
        });
      });
    },

    selected(value) {
      this.visible = false;

      // 父组件监听变化
      this.$emit("change", value);
    },
  },
};
</script>

<style lang="less" scoped>
.top-select {
  display: flex;
  align-items: center;

  .top-select-line {
    flex: 1;
    display: block;
    height: 0;
    border: solid 0.06vh #255e74;
    box-sizing: border-box;
    margin-right: 1.38vh;
  }

  .el-input {
    width: 9.94vh;

    /deep/ input {
      position: relative;
      height: 2.56vh;
      line-height: 2.56vh;
      background-color: #0a121d;
      border-radius: 0.5vh;
      border: solid 0.03vh #40a1c5;
      box-sizing: border-box;
      font-family: PingFang;
      font-size: 0.89vh;
      color: #fff;
      padding: 0.44vh 1vh 0.38vh;
      cursor: pointer;
    }

    /deep/ .el-input__suffix {
      right: 0;
    }

    .input-suffix {
      position: absolute;
      width: 0.94vh;
      height: 0.63vh;
      top: 50%;
      right: 1vh;
      transform: translateY(-50%);
      background-image: url("~@/assets/images/detail/topic-select.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      cursor: pointer;

      &.active {
        transform: translateY(-50%) rotate(180deg);
      }
    }
  }
}
</style>
<style lang="less">
.select-pop {
  width: 9.94vh;
  min-width: 0;
  box-sizing: border-box;
  background-color: #0a121d;
  border-radius: 0.5vh;
  border: solid 0.06vh #40a1c5;
  font-family: PingFang;
  font-size: 0.89vh;
  color: #fff;
  margin-top: 0.13vh !important;
  padding: 0.69vh 0.63vh;

  li {
    cursor: pointer;

    > span {
      display: block;
      width: 100%;
      height: 1.75vh;
      line-height: 1.75vh;
      padding: 0 0.38vh;
    }

    &.selected,
    &:hover {
      color: #00f5ff;
      opacity: 0.8;
      background-color: rgba(82, 209, 254, 0.4);
    }

    &:not(:last-child) {
      margin-bottom: 0.63vh;
    }
  }
}
</style>