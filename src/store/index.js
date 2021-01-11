import Vue from 'vue'
import Vuex from 'vuex'
import map from "./modules/map";
import decision from "./modules/decision";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    map,
    decision
  }
})