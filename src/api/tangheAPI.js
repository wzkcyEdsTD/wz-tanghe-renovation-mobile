
import axios from "axios";
const BASEURL = "http://192.168.2.136:8080/jeecg-boot/tanghe";
const serverInstanec = axios.create();
serverInstanec.defaults.baseURL = BASEURL;

/**
 * axios default
 * @param {*} url
 * @param {*} data
 */
const post = (url, data) => {
  return serverInstanec.request({ url, data, method: "post" }).then(res => {
    return Promise.resolve(res);
  });
};

const get = (url, data) => {
  return serverInstanec.request({ url, params:data, method: "get" }).then(res => {
    return Promise.resolve(res);
  });
};

/**
 * 打分
 */
export const addBatch = (data) => {
  const url = '/studyDeptScore/addBatch'
  return post(url, data);
};