<template>
  <div class="audioTool">
    <div class="audioKit">
      <img
        class="control"
        :src="
          require(`@/assets/images/detail/audiotools/${
            status ? 'pause' : 'play'
          }.png`)
        "
        @click="changeStatus"
      />
      <span class="duration"
        >{{ timeFormat(currentTime) }}/{{ timeFormat(duration) }}</span
      >
      <div class="bar">
        <el-slider
          v-model="progress"
          :show-tooltip="false"
          @change="changeAudioTime"
        ></el-slider>
      </div>
      <img
        class="sound"
        src="@/assets/images/detail/audiotools/sound.png"
        @mouseenter="mouseEnterHandle($event)"
        @mouseleave="mouseLeaveHandle($event)"
      />
    </div>
    <div
      class="soundKit"
      v-show="soundShow"
      @mouseenter="soundMouseEnterHandle($event)"
      @mouseleave="soundMouseLeaveHandle($event)"
    >
      <div class="soundBar">
        <el-slider
          v-model="soundValue"
          :show-tooltip="false"
          vertical
        ></el-slider>
      </div>
    </div>
    <audio
      id="nativeAudio"
      class="audio"
      ref="nativeAudio"
      :src="src"
      controls="controls"
    ></audio>
  </div>
</template>

<script>
export default {
  data() {
    return {
      status: false,
      currentTime: 0,
      duration: 0,
      progress: 0,
      soundValue: 30,
      soundShow: false,
      soundMouseEnter: false,
    };
  },
  props: ["src"],
  mounted() {
    this.audioBind();
  },
  methods: {
    // 播放状态
    changeStatus() {
      this.status = !this.status;
      this.status ? this.nativeAudio.play() : this.nativeAudio.pause();
    },

    // 音量按钮悬停
    mouseEnterHandle(event) {
      this.soundShow = true;
    },

    // 音量按钮离开
    mouseLeaveHandle(event) {
      setTimeout(() => {
        this.soundShow = this.soundMouseEnter;
      }, 1000);
    },

    // 音量组件悬停
    soundMouseEnterHandle(event) {
      this.soundMouseEnter = true;
    },

    // 音量组件离开
    soundMouseLeaveHandle(event) {
      setTimeout(() => {
        this.soundShow = this.soundMouseEnter = false;
      }, 1000);
    },

    // 与原生组件关联
    audioBind() {
      const that = this;
      this.nativeAudio = document.getElementById("nativeAudio");

      this.nativeAudio.volume = this.soundValue / 100;
      this.nativeAudio.load();

      this.nativeAudio.oncanplay = () => {
        that.duration = that.nativeAudio.duration;
        // 监听进度
        that.nativeAudio.addEventListener("timeupdate", that.updateProgress);
      };
    },

    // 进度条更新
    updateProgress() {
      this.progress = parseInt(
        (parseInt(this.nativeAudio.currentTime) / parseInt(this.duration)) * 100
      );

      this.currentTime = this.nativeAudio.currentTime;
    },

    // 时间转换
    timeFormat(time) {
      const seconds = parseInt(time % 60);
      const minute = parseInt(time / 60);
      return `${minute}:${seconds < 10 ? "0" : ""}${seconds}`;
    },

    // 改变进度条
    changeAudioTime(val) {
      this.currentTime = this.nativeAudio.currentTime = parseInt(
        (val / 100) * parseInt(this.duration)
      );
    },
  },

  watch: {
    currentTime(val) {
      if (val == this.duration) {
        this.status = false;
      }
    },
    soundValue(val) {
      this.nativeAudio.volume = val / 100;
    },
  },
};
</script>

<style lang="less" scoped>
.audioTool {
  position: relative;
  width: 100%;

  .audio {
    display: none;
    width: 100%;
    height: 6vh;
  }

  .audioKit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 3.5vh;
    background-color: #c4e4ff;
    border-radius: 1.75vh;
    border: solid 0.06vh #165fea;
    box-sizing: border-box;
    padding: 0 1.9vh;

    .control {
      width: 0.88vh;
      height: 1.13vh;
      cursor: pointer;
    }

    .sound {
      width: 1.2vh;
      height: 1.2vh;
      cursor: pointer;
    }

    .duration {
      font-family: PingFang;
      font-weight: 600;
      font-size: 1.1vh;
      color: #165fea;
    }

    .bar {
      width: 14.5vh;

      /deep/ .el-slider__runway {
        border-radius: 0.31vh;
        background-color: #8eafef;
      }

      /deep/ .el-slider__bar {
        border-radius: 0.31vh;
        background-color: #165fea;
      }

      /deep/ .el-slider__button {
        border: none;
        background-color: transparent;
      }
    }
  }

  .soundKit {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: absolute;
    top: -10.3vh;
    right: 1.3vh;
    width: 2.5vh;
    height: 10vh;
    background-color: #c4e4ff;
    border-radius: 1.75vh;
    border: solid 0.06vh #165fea;

    .soundBar {
      width: 100%;
      height: 65%;
      display: flex;
      justify-content: center;

      /deep/ .el-slider__runway {
        height: 100% !important;
        border-radius: 0.31vh;
        background-color: #8eafef;
      }

      /deep/ .el-slider__bar {
        border-radius: 0.31vh;
        background-color: #165fea;
      }

      /deep/ .el-slider__button {
        width: 1vh;
        height: 1vh;
        border: none;
        background-color: #14c0ff;
      }
    }
  }
}
</style>