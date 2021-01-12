<template>
  <div>
    <transition name="fade">
      <div
        class="detail-popup project-detail-popup"
        v-if="infoShow && forceEntity.attributes"
        :style="{ top: (isSearch ? 16.81 : 13.81) + 'vh' }"
      >
        <i class="popup-close" @click="closeInfo" />
        <div class="info-container">
          <div class="panel-title">
            <img src="@/assets/images/detail/title-before.png" />
            <span>{{ name }}</span>
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
                  :disabled="item.disabled"
                  :class="{
                    active: currentShow == item.id,
                    disabled: item.disabled,
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
                        :src="`${MediaServer}/images/${forceEntity.type}/${item}`"
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
                  <span>{{ name }}</span>
                </div>

                <div class="info-line">
                  <table>
                    <tr>
                      <!-- <td v-if="forceEntity.type == '项目'">
                        <span>类型</span>
                        <span>{{
                          forceEntity.attributes.FUNDTYPE || `无`
                        }}</span>
                      </td> -->
                      <!-- <td v-if="forceEntity.type == '绿道断点'">
                        <span>断点长度</span>
                        <span
                          >{{ forceEntity.attributes.LENGTH || `-` }}米</span
                        >
                      </td> -->
                      <td>
                        <span>所属街道</span>
                        <span>{{ forceEntity.attributes.STREET || `无` }}</span>
                      </td>
                      <td v-if="forceEntity.type == '项目'">
                        <span>总投资</span>
                        <span>{{
                          forceEntity.attributes.TOTALAMOUNT
                            ? `${forceEntity.attributes.TOTALAMOUNT}万元`
                            : `无`
                        }}</span>
                      </td>
                      <td v-if="forceEntity.type == '绿道断点'">
                        <span>断点长度</span>
                        <span
                          >{{ forceEntity.attributes.LENGTH || `-` }}米</span
                        >
                      </td>
                      <td>
                        <span>责任单位</span>
                        <span>{{
                          forceEntity.attributes.ZR_DEPTID ||
                          forceEntity.attributes.ZRDW ||
                          `无`
                        }}</span>
                      </td>
                    </tr>
                    <!-- 空行 -->
                    <!-- <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr> -->
                    <!-- <tr> -->
                    <!-- <td>
                        <span>问题</span>
                        <span>{{ forceEntity.attributes.CZWT || `无` }}</span>
                      </td> -->
                    <!-- <td>
                        <span>备注</span>
                        <span>{{ forceEntity.attributes.BZ || `无` }}</span>
                      </td> -->
                    <!-- </tr> -->
                  </table>
                </div>

                <div class="latest">
                  <span>问题</span>
                  <span>{{ forceEntity.attributes.CZWT || `无` }}</span>
                </div>

                <div class="latest">
                  <span>最新进展</span>
                  <span>{{ forceEntity.attributes.ZXJZ || `无` }}</span>
                </div>

                <div class="plan" v-if="forceEntity.type == '项目'">
                  <span>计划时间</span>
                  <img
                    :src="
                      require(`@/assets/images/detail/${
                        progressImgHash[forceEntity.attributes.CURRENT_STATE]
                      }.png`)
                    "
                  />
                  <div class="time-desc">
                    <span>
                      计划开工时间：{{
                        forceEntity.attributes.CONSYEARB || `无`
                      }}
                    </span>
                    <span>
                      计划建成时间：{{
                        forceEntity.attributes.CONSYEARE || `无`
                      }}
                    </span>
                  </div>
                </div>

                <div class="plan" v-if="forceEntity.type == '绿道断点'">
                  <span>计划时间{{ JHGTState }}</span>
                  <div class="img-wrapper" v-if="JHGTState == 1">
                    <!-- <div class="pop pop1">{{this.currentYear}}-{{this.currentMonth}}-{{this.currentDay}}</div> -->
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
                      计划贯通时间：{{ forceEntity.attributes.JHGTSJ || `无` }}
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

      name: "",
      forceEntity: {},
      infoShow: false,
      finalData: {},
      finalList: [],
      currentData: {},
      currentIndex: 0,
      currentShow: "overview",

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
      let JHGTSJ = this.forceEntity.attributes.JHGTSJ;
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
      return {
        year: `${date.substring(0, 4)}`,
        month: `${date.substring(4, 6)}`,
        day: `${date.substring(6, 8)}`,
      };
    },

    // 获取选中对象
    getForceEntity(entity) {
      this.name = entity.name;
      this.forceEntity = entity;

      // 景观图
      let jgtList = ~this.forceEntity.attributes.JGT.indexOf(";")
        ? this.forceEntity.attributes.JGT.split(";")
        : [this.forceEntity.attributes.JGT];
      this.jgtList = jgtList.map((item) => {
        return `${MediaServer}/images/${this.forceEntity.type}/${item}`;
      });

      this.infoShow = true;
      this.currentIndex = 0;
      if (this.$refs.SwiperTime) {
        this.$refs.SwiperTime.swiper.activeIndex = 0;
      }
      this.initData();
      if (this.forceEntity.type == "绿道断点") {
        this.getJHGTState();
      }
    },

    // 初始化数据
    initData() {
      this.currentIndex = 0;
      this.currentShow = "overview";

      this.currentData = {};
      this.finalData = {};

      this.fixData("PHOTO", "photo");
      this.fixData("JGT", "photo");
      this.fixData("QJSLT", "thumbs");
      this.fixData("SP", "video");

      this.finalList = Object.values(this.finalData).reverse();
      if (this.finalList.length) {
        this.currentData = this.finalList[this.currentIndex];
        this.finalList.forEach((item) => {
          if (item.overview) {
            this.topBtns[0].disabled = false;
          }
          if (item.video) {
            this.topBtns[1].disabled = false;
          }
          if (item.photo) {
            this.topBtns[2].disabled = false;
          }
        });
      }
    },

    // 组装数据
    fixData(attr, key) {
      if (this.forceEntity.attributes && this.forceEntity.attributes[attr]) {
        const overViewStr =
          this.forceEntity.attributes.QJ || this.forceEntity.attributes.ZBQJ;
        const sArr =
          overViewStr && ~overViewStr.indexOf(";")
            ? overViewStr.split(";")
            : [];
        const attrVal = this.forceEntity.attributes[attr];

        if (attrVal) {
          if (~attrVal.indexOf(";")) {
            const tmp = attrVal.split(";");
            tmp.forEach((item, index) => {
              if (item.split("_")[1]) {
                let time = item.split("_")[1].split(".")[0];
                if (this.finalData[time]) {
                  if (!this.finalData[time][key]) {
                    this.finalData[time][key] = [];
                  }
                  this.finalData[time][key].push(item);
                } else {
                  this.finalData[time] = { date: time };
                  this.finalData[time][key] = [item];
                }
                if (~attr.indexOf("SLT")) {
                  this.finalData[time].overview = [sArr[index]];
                }
              } else {
                let time = "20200101";
                this.finalData[time] = { date: time };
                this.finalData[time][key] = [];
                this.finalData[time][key].push(item);
                if (~attr.indexOf("SLT")) {
                  this.finalData[time].overview = [];
                  this.finalData[time].overview.push(sArr[index]);
                }
              }
            });
          } else {
            let time = undefined;
            if (attrVal.split("_")[1]) {
              time = attrVal.split("_")[1].split(".")[0];
              if (!this.finalData[time]) this.finalData[time] = { date: time };
            } else {
              time = "20200101";
              this.finalData[time] = { date: time };
            }
            this.finalData[time][key] = [attrVal];
            if (~attr.indexOf("SLT")) {
              this.finalData[time].overview = [overViewStr];
            }
          }
        }
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
