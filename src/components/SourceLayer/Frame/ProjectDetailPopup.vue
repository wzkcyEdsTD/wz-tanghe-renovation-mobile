<template>
  <div>
    <transition name="fade">
      <div
        class="detail-popup project-detail-popup"
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
              <div class="jgt-wrapper" v-show="forceEntity.attributes.JGT">
                <div class="swiper-buttons jgt-swiper-button-left"></div>
                <swiper
                  ref="SwiperJgt"
                  class="swiper-wrapper swiper-jgt"
                  :options="jgtSwiperOptions"
                >
                  <swiper-slide
                    v-for="(item, i) in jgtList"
                    :key="i"
                    class="swiper-item"
                  >
                    <el-image
                      :src="item"
                      @click="onPreview(jgtList, i, true)"
                    ></el-image>
                  </swiper-slide>
                </swiper>
                <div class="swiper-buttons jgt-swiper-button-right"></div>
              </div>
              <div class="btn-list">
                <button
                  v-for="(item, index) in topBtns"
                  :key="index"
                  class="btn-type"
                  :disabled="!detailData.overallViews"
                  :class="{
                    active: currentShow == item.id,
                    disabled: !detailData.overallViews,
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
                      v-for="(item, i) in currentData.thumbs"
                      :key="i"
                      class="swiper-item"
                    >
                      <img
                        :src="`${MediaServer}/images/VRPic/${item}`"
                        @click="openOverview(i)"
                      />
                    </swiper-slide>
                    <swiper-slide
                      class="swiper-item"
                      v-if="!currentData.thumbs"
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
                        :src="`${MediaServer}/video/${item}`"
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
                        :src="`${MediaServer}/images/${item}`"
                        @click="onPreview(currentData.photo, i, false)"
                      ></el-image>
                    </swiper-slide>
                    <swiper-slide class="swiper-item" v-if="!currentData.photo">
                      <div class="no-tip">暂无数据</div>
                    </swiper-slide>
                    <div class="swiper-scrollbar" slot="scrollbar"></div>
                  </swiper>

                  <div class="swiper-buttons swiper-button-right"></div>
                </div>
                <div class="bottom">
                  <swiper
                    ref="SwiperTime"
                    class="swiper-time"
                    :options="timeSwiperOption"
                  >
                    <swiper-slide
                      v-for="(item, index) in finalList"
                      :key="index"
                      :class="{ active: currentIndex == index }"
                    >
                      <div class="item-content">
                        <span>{{ getDate(item.date).year }}</span>
                        <span
                          >{{ getDate(item.date).month }}-{{
                            getDate(item.date).day
                          }}</span
                        >
                      </div>
                    </swiper-slide>
                  </swiper>
                  <div class="item-wrapper"></div>
                  <div class="item-check"></div>
                </div>
              </div>
            </div>
            <div class="base-info">
              <div class="sub-title">
                <span class="sub-title-text">信息详情</span>
                <span class="sub-title-line"></span>
              </div>
              <div class="base-content">
                <div class="base-name">
                  <span>名称</span>
                  <span>{{ detailData.name }}</span>
                </div>

                <div class="info-line">
                  <table>
                    <tr>
                      <td>
                        <span>所属街道</span>
                        <span>{{ detailData.street || `无` }}</span>
                      </td>
                      <td v-if="resourceType == 'project_all'">
                        <span>总投资</span>
                        <span>{{
                          detailData.totalamount
                            ? `${detailData.totalamount}万元`
                            : `无`
                        }}</span>
                      </td>
                      <td v-if="resourceType == 'greenway_all'">
                        <span>断点长度</span>
                        <span>{{ detailData.length || `-` }}米</span>
                      </td>
                      <td>
                        <span>责任单位</span>
                        <span>{{ detailData.sysOrgCodeName || `无` }}</span>
                      </td>
                    </tr>
                  </table>
                </div>

                <div class="latest">
                  <span>问题</span>
                  <span>{{ detailData.problems || `无` }}</span>
                </div>

                <div class="latest">
                  <span>最新进展</span>
                  <span>{{ detailData.recentStatus || `无` }}</span>
                </div>

                <div class="plan" v-if="resourceType == 'project_all'">
                  <span>计划时间</span>
                  <img
                    :src="
                      require(`@/assets/images/detail/${
                        progressImgHash[detailData.status]
                      }.png`)
                    "
                  />
                  <div class="time-desc">
                    <span>
                      计划开工时间：{{ detailData.consdates || `无` }}
                    </span>
                    <span>
                      计划建成时间：{{ detailData.consdatee || `无` }}
                    </span>
                  </div>
                </div>

                <div class="plan" v-if="resourceType == 'greenway_all'">
                  <span>计划时间</span>
                  <div class="img-wrapper" v-if="JHGTState == 1">
                    <img
                      class="state-img"
                      :src="require(`@/assets/images/detail/已贯通.png`)"
                    />
                  </div>
                  <div class="img-wrapper" v-if="JHGTState == 2">
                    <div class="pop pop2">
                      {{ this.currentYear }}-{{ this.currentMonth }}-{{
                        this.currentDay
                      }}
                    </div>
                    <img
                      class="state-img"
                      :src="require(`@/assets/images/detail/小于三个月.png`)"
                    />
                  </div>
                  <div class="img-wrapper" v-if="JHGTState == 3">
                    <div class="pop pop3">
                      {{ this.currentYear }}-{{ this.currentMonth }}-{{
                        this.currentDay
                      }}
                    </div>
                    <img
                      class="state-img"
                      :src="require(`@/assets/images/detail/大于三个月.png`)"
                    />
                  </div>
                  <div class="time-desc">
                    <span></span>
                    <span>
                      计划贯通时间：{{ detailData.consdatee || `无` }}
                    </span>
                  </div>
                </div>
              </div>
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
import { swiperOption, progressImgHash } from "@/common/js/hash";
import { getProjectDetail, getPointDetail } from "@/api/tangheAPI";

import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import Overview from "@/components/SourceLayer/Frame/Overview";

export default {
  data() {
    return {
      MediaServer,
      swiperOption,
      progressImgHash,

      topBtns: [
        {
          id: "overview",
          label: "全景",
          disabled: true,
        },
        {
          id: "video",
          label: "视频",
          disabled: true,
        },
        {
          id: "photo",
          label: "图片",
          disabled: true,
        },
      ],

      detailData: {},
      forceEntity: {},
      infoShow: false,
      finalData: {},
      finalList: [],
      currentData: {},
      currentIndex: 0,
      currentShow: "overview",
      resourceType: "",

      viewerShow: false,
      imgList: [],
      imgIndex: 0,
      jgtList: [],

      overviewUrl: "",
      overShow: false,

      isSearch: false,

      currentYear: "",
      currentMonth: "",
      currentDay: "",
      JHGTState: 0, // 1已贯通、2小于三个月、3大于三个月
    };
  },
  components: { ElImageViewer, Overview },

  mounted() {
    this.timeSwiperOption = {
      slidesPerView: 3,
      slideToClickedSlide: true,
      centeredSlides: true,
      on: {
        slideChange: () => {
          this.currentIndex = this.$refs.SwiperTime.swiper.activeIndex;
        },
      },
    };
    this.jgtSwiperOptions = {
      slidesPerView: 1,
      slideToClickedSlide: true,
      centeredSlides: true,
      navigation: {
        nextEl: ".jgt-swiper-button-right",
        prevEl: ".jgt-swiper-button-left",
      },
    };
  },
  methods: {
    // 判断 断点当前状态
    getJHGTState() {
      let JHGTSJ = this.detailData.consdatee;
      let y = JHGTSJ.substr(0, 4);
      let m = JHGTSJ.substr(5, 2);
      let date = new Date();
      let currentY = date.getFullYear();
      let currentM = date.getMonth() + 1;
      currentM = currentM < 10 ? "0" + currentM : currentM;
      let currentD = date.getDate();
      currentD = currentD < 10 ? "0" + currentD : currentD;
      this.currentYear = currentY;
      this.currentMonth = currentM;
      this.currentDay = currentD;
      if (y > currentY) {
        if (m - currentM > -9) {
          this.JHGTState = 3;
        } else {
          this.JHGTState = 2;
        }
      }
      if (y == currentY) {
        if (m - currentM > 3) {
          this.JHGTState = 3;
        } else {
          m - currentM > 0 ? (this.JHGTState = 2) : (this.JHGTState = 1);
        }
      }
      if (y < currentY) {
        this.JHGTState = 1;
      }
    },

    // 时间对象
    getDate(date) {
      if (!date) return;
      const [year, month, day] = date.split("-");
      return { year, month, day };
    },

    // 获取选中对象
    getForceEntity(entity) {
      this.forceEntity = entity;

      if (entity.attributes) {
        this.resourceType = entity.attributes.RESOURCE_TYPE;
        let id = entity.attributes.RESOURCE_ID;
        this.initData(id);
      }
    },

    // 初始化数据
    async initData(id) {
      this.dorate = false;
      this.currentIndex = 0;
      this.currentShow = "overview";

      this.currentData = {};
      this.finalData = {};

      let res;
      if (this.resourceType == "project_all") {
        res = await getProjectDetail({ id });
      }
      if (this.resourceType == "greenway_all") {
        res = await getPointDetail({ id });
      }

      const { data } = res;
      if (data.code === 200) {
        this.infoShow = true;
        this.detailData = data.result;

        this.fixData();

        if (this.resourceType == "greenway_all") {
          this.getJHGTState();
        }
      }
    },

    // 组装数据
    fixData() {
      const overallViews = this.detailData.overallViews;
      const videos = this.detailData.videos;
      const photos = this.detailData.photos;

      overallViews &&
        overallViews.forEach((item) => {
          let time = item.shotTime || "2020-01-01";
          if (this.finalData[time]) {
            !this.finalData[time].overview &&
              (this.finalData[time].overview = []);
            !this.finalData[time].thumbs && (this.finalData[time].thumbs = []);
            this.finalData[time].overview.push(item.path);
            this.finalData[time].thumbs.push(item.thumbnail);
          } else {
            this.finalData[time] = { date: time };
            this.finalData[time].overview = [item.path];
            this.finalData[time].thumbs = [item.thumbnail];
          }
        });

      videos &&
        videos.forEach((item) => {
          let time = item.shotTime || "2020-01-01";
          if (this.finalData[time]) {
            !this.finalData[time].video && (this.finalData[time].video = []);
            this.finalData[time].video.push(item.path);
          } else {
            this.finalData[time] = { date: time };
            this.finalData[time].video = [item.path];
          }
        });

      photos &&
        photos.forEach((item) => {
          let time = item.shotTime || "2020-01-01";
          if (this.finalData[time]) {
            !this.finalData[time].photo && (this.finalData[time].photo = []);
            this.finalData[time].photo.push(item.path);
          } else {
            this.finalData[time] = { date: time };
            this.finalData[time].photo = [item.path];
          }
        });

      this.finalList = Object.values(this.finalData);
      this.finalList.sort((a, b) => {
        const date1 = a.date.split("-").join("");
        const date2 = b.date.split("-").join("");
        return date1 - date2;
      });

      if (this.finalList.length) {
        this.currentData = this.finalList[this.currentIndex];
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
    onPreview(list, index, includeUrl) {
      // 是否已包含路径前缀
      this.imgList = list.map((item) => {
        return includeUrl
          ? item
          : `${MediaServer}/images/${this.forceEntity.type}/${item}`;
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
    currentIndex(val) {
      this.currentData = this.finalList[val];
    },
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
@import url("./css/ProjectDetailPopup.less");
</style>
