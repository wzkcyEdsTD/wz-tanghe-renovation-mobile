import axios from "axios";
const serverInstance = axios.create();

/**
 * axios default
 * @param {*} url
 * @param {*} data
 */
const getAxios = (url = "", data = {}) => {
  return serverInstance.request({
    url,
    data,
    method: "get"
  }).then(res => {
    return res.data ? Promise.resolve(res.data) : Promise.reject(res);
  });
};

/**
 * 获取iserver指定数据集下所有别名
 * @param {*} url
 * @param {*} dataset
 */
export const getIserverFields = (url, dataset) => {
  const [dataName, dataSet] = dataset.split(":");
  const fieldURL = `${url}/datasources/${dataName}/datasets/${dataSet}/fields.json?returnAll=true`;
  return getAxios(fieldURL);
};