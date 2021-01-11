import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import bus from 'vue-bus'
Vue.use(bus);


// 全局jquery
import jquery from 'jquery';
Vue.prototype.$ = jquery;
// 全局Cesium
Vue.prototype.Cesium = window.Cesium

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
Vue.use(VueAwesomeSwiper)

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);


// 引入字体
import "./common/fonts/font.css";
import "./common/css/common.less";
import "./common/css/theme.less";


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')