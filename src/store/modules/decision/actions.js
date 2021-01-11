import * as types from "./mutation-types";

export const setSourceMap = ({
    commit
}, data) => {
    commit(types.SET_SOURCE_MAP, data);
};

export const setSejList = ({
    commit
}, data) => {
    commit(types.SET_SEJ_LIST, data);
};