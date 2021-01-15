<template>
  <div>
    <transition name="fade">
      <div
        class="detail-popup common-detail-popup"
        v-if="infoShow"
        :style="{ top: (isSearch ? 16.81 : 13.81) + 'vh' }"
      >
        <i class="popup-close" @click="closeInfo" />
        <div class="info-container">
          <div class="panel-title">
            <img src="@/assets/images/detail/title-before.png" />
            <span>{{ detailData.name }}</span>
          </div>
          <div class="panel-body">
            <div class="content-info">
              <div class="btn-list">
                <button
                  v-for="(item, index) in topBtns"
                  :key="index"
                  class="btn-type"
                  :disabled="!currentData[item.id]"
                  :class="{
                    active: currentShow == item.id,
                    disabled: !currentData[item.id],
                  }"
                  @click="currentShow = item.id"
                >
                  <span>{{ item.label }}</span>
                </button>
              </div>
              <div class="media-content">
                <div class="top">
                  <div class="swiper-buttons swiper-button-left"></div>
                  <swiper
                    ref="SwiperMedia"
                    class="swiper-wrapper swiper-tool"
                    :options="swiperOption"
                    v-show="currentShow == 'overview'"
                  >
                    <swiper-slide
                      v-for="(item, i) in currentData.overview"
                      :key="i"
                      class="swiper-item"
                    >
                      <img
                        :src="`${MediaServer}/images/VRPic/${item.thumbnail}`"
                        @click="openOverview(i)"
                      />
                    </swiper-slide>
                    <swiper-slide
                      class="swiper-item"
                      v-if="!currentData.overview"
                    >
                      <div class="no-tip">暂无数据</div>
                    </swiper-slide>

                    <div class="swiper-scrollbar" slot="scrollbar"></div>
                  </swiper>

                  <swiper
                    ref="SwiperMedia"
                    class="swiper-wrapper swiper-tool"
                    :options="swiperOption"
                    v-show="currentShow == 'video'"
                  >
                    <swiper-slide
                      v-for="(item, i) in currentData.video"
                      :key="i"
                      class="swiper-item"
                    >
                      <video
                        id="video"
                        ref="video"
                        :src="`${MediaServer}/video/${item.path}`"
                        controls="controls"
                        muted
                      ></video>
                    </swiper-slide>
                    <swiper-slide class="swiper-item" v-if="!currentData.video">
                      <div class="no-tip">暂无数据</div>
                    </swiper-slide>
                    <div class="swiper-scrollbar" slot="scrollbar"></div>
                  </swiper>

                  <swiper
                    ref="SwiperMedia"
                    class="swiper-wrapper swiper-tool"
                    :options="swiperOption"
                    v-show="currentShow == 'photo'"
                  >
                    <swiper-slide
                      v-for="(item, i) in currentData.photo"
                      :key="i"
                      class="swiper-item"
                    >
                      <el-image
                        :src="`${MediaServer}/images/${item.path}`"
                        @click="onPreview(currentData.photo, i)"
                      ></el-image>
                    </swiper-slide>
                    <swiper-slide class="swiper-item" v-if="!currentData.photo">
                      <div class="no-tip">暂无数据</div>
                    </swiper-slide>
                    <div class="swiper-scrollbar" slot="scrollbar"></div>
                  </swiper>

                  <div class="swiper-buttons swiper-button-right"></div>
                </div>
              </div>
            </div>
            <div class="basic-wrapper">
              <div class="sub-title">
                <span class="sub-title-text">基本信息</span>
                <span class="sub-title-line"></span>
              </div>
              <div class="basic-content">
                <div class="detail">
                  <span>详情</span>
                  <span>{{ detailData.details || `暂无详情` }}</span>
                </div>
                <div class="desc">
                  <div>
                    <span>区县</span>
                    <span>{{ detailData.district || `无` }}</span>
                  </div>
                  <div>
                    <span>乡镇街道</span>
                    <span>{{ detailData.street || `无` }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="audio-wrapper">
              <div class="sub-title">
                <span class="sub-title-text">音频</span>
                <span class="sub-title-line"></span>
              </div>
              <div class="audio-content" v-if="detailData.audioSrc">
                <MAudio :src="`${MediaServer}/audio/${detailData.audioSrc}`" />
              </div>
              <div v-else class="no-tip">暂无数据</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <el-image-viewer
      :style="{ left: 0 }"
      v-if="viewerShow"
      :on-close="closeViewer"
      :url-list="imgList"
      :initial-index="imgIndex"
    />
    <Overview v-if="overShow" :src="overviewUrl" />
  </div>
</template>

<script>
import { MediaServer } from "@/config/mapConfig";
import { commonDetailHideField, topBtns, swiperOption } from "@/common/js/hash";
import { getSpotDetail } from "@/api/tangheAPI";

import MAudio from "@/components/Widget/MAudio";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import Overview from "@/components/SourceLayer/Frame/Overview";

export default {
  data() {
    return {
      MediaServer,
      topBtns,
      swiperOption,

      detailData: {},
      infoShow: false,
      currentData: {},
      currentIndex: 0,
      currentShow: "overview",

      viewerShow: false,
      imgList: [],
      imgIndex: 0,
      overviewUrl: "",
      overShow: false,

      isSearch: false,
    };
  },
  components: { MAudio, ElImageViewer, Overview },
  methods: {
    // 获取选中对象
    getForceEntity(entity) {
      this.initData(entity.attributes.RESOURCE_ID);
    },

    // 初始化数据
    async initData(id) {
      this.currentIndex = 0;
      this.currentShow = "overview";
      this.currentData = {};

      const { data } = await getSpotDetail({ id });
      if (data.code === 200) {
        this.infoShow = true;
        this.detailData = data.result;
        this.currentData = {
          overview: data.result.overallViews,
          video: data.result.videos,
          photo: data.result.photos,
        };
      }
    },

    // 关闭详情
    closeInfo() {
      this.infoShow = false;
    },

    // 打开全景
    openOverview(index) {
      this.closeViewer();
      this.overviewUrl = this.currentData.overview[index];
      this.overShow = true;
    },

    // 开启图片查看
    onPreview(list, index) {
      this.imgList = list.map((item) => {
        return `${MediaServer}/images/${this.forceEntity.type}/${item}`;
      });
      this.imgIndex = index;
      this.viewerShow = true;
    },

    // 关闭图片查看
    closeViewer() {
      this.viewerShow = false;
    },
  },

  watch: {
    currentData(val) {
      this.currentShow = val.overview
        ? "overview"
        : val.video
        ? "video"
        : "photo";
    },
    currentShow(val) {
      if (val != "video") {
        const video = document.getElementById("video");
        if (video) video.pause();
      }
      if (this.$refs.SwiperMedia) {
        this.$refs.SwiperMedia.swiper.activeIndex = 0;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import url("~@/components/SourceLayer/Frame/css/frame.less");
@import url("./css/CommonDetailPopup.less");
</style>