// 定义修改操作
import * as types from "./mutation-types";

const mutations = {
    [types.SET_SOURCE_MAP](state, data) {
        state.sourceMap = Object.assign({}, state.sourceMap, data)
    },
    [types.SET_SEJ_LIST](state, data) {
        state.sejList = data;
    },
}
export default mutations;