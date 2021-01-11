<template>
  <div id="namePopup" v-if="shallPop">
    <div
      v-for="(item, index) in popList"
      :key="index"
      :id="`namePopupContent_${index}`"
      class="name-popup-content"
      :style="{
        transform: offsetText(item),
      }"
    >
      <div class="popup-container">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      shallPop: false,
      popList: [],
    };
  },
  computed: {
    ...mapGetters("decision", ["sejList"]),
  },
  methods: {
    fixPopup() {
      const list = this.sejList;
      if (list && list.length) {
        const G_list = [];
        list.map((item) => {
          if (item.geometry) {
            const { x, y } = item.geometry;
            const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
              window.earth.scene,
              Cesium.Cartesian3.fromDegrees(x, y, 0)
            );
            pointToWindow && G_list.push({ ...item, pointToWindow });
          }
        });
        this.doPopup(G_list);
      } else {
        this.doPopup([]);
      }
    },
    doPopup(G_list) {
      const popList = [];
      if (G_list.length) {
        G_list.map((item, index) => {
          let popup = document.getElementById(`namePopupContent_${index}`);
          popList.push({
            id: item.id,
            name: item.attributes.NAME,
            x: item.pointToWindow.x - (popup ? popup.offsetWidth : 0) / 2,
            y: item.pointToWindow.y - (popup ? popup.offsetHeight : 0),
          });
        });
        this.popList = popList;
        !this.shallPop &&
          this.$nextTick(() => {
            this.shallPop = true;
          });
      } else {
        this.shallPop && this.closePopup();
      }
    },
    closePopup() {
      this.shallPop = false;
    },

    // 文字偏移
    offsetText({ x, y }) {
      const height = window.innerHeight;
      const offsetWidth = (100 / height) * x;
      const offsetHeight = (100 / height) * (y + 46);
      return `translate(${offsetWidth}vh, ${offsetHeight + 3}vh)`;
    },
  },
};
</script>

<style lang="less">
.name-popup-content {
  position: fixed;
  text-align: center;
  top: -2vh;
  left: 0;
  .popup-container {
    background-image: url("~@/assets/images/map-ico/sej-bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-size: 1.6vh;
    color: #61f5f5;
    padding: 0.7vh 1.1vh 0.85vh;
  }
}
</style>
