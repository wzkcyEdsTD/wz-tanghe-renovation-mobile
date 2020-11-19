<template>
  <div class="video" v-if="!isSkip">
    <div class="skip" @click="isSkip = true">
      <span>跳过视频</span>
    </div>
    <video id="video" autoplay muted>
      <source
        src="http://172.168.3.182:8090/static/video/智慧塘河.mp4"
        type="video/mp4"
      />
    </video>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSkip: true,
    };
  },
  mounted() {
    const video = document.getElementById("video");
    video &&
      video.addEventListener(
        "ended",
        () => {
          this.isSkip = true;
        },
        false
      );
  },
};
</script>

<style lang="less" scoped>
.video {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #000;
  z-index: 99999;

  .skip {
    position: absolute;
    top: 3vh;
    right: 3vh;
    border: 1px solid #c3bdbc;
    border-radius: 3vh;
    padding: 1vh 2vh;
    z-index: inherit;

    span {
      font-family: PingFang;
      color: #fff;
    }
  }

  video {
    width: 100%;
    height: 100%;
  }
}
</style>