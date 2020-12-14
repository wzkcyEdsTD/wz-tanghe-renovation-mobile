
import axios from "axios";
// const BASEURL = "http://172.168.3.182:8080/jeecg-boot";
const serverInstanec = axios.create();
// serverInstanec.defaults.baseURL = BASEURL;

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
  const url = '/tanghe/studyDeptScore/addBatch'
  return post(url, data);
};