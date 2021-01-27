import axios from "axios";
const BASEURL = "http://172.20.83.227:8080";
const serverInstance = axios.create();
// serverInstance.defaults.baseURL = BASEURL;

/**
 * axios default
 * @param {*} url
 * @param {*} data
 */
const post = (url, data) => {
  return serverInstance.request({
    url,
    data,
    method: "post"
  }).then(res => {
    return Promise.resolve(res);
  });
};

const get = (url, data) => {
  return serverInstance.request({
    url,
    params: data,
    method: "get"
  }).then(res => {
    return Promise.resolve(res);
  });
};

/**
 * 打分
 */
export const addBatch = (data) => {
  const url = `${BASEURL}/tanghe/studyDeptScore/addBatch`
  return post(url, data);
};

// 项目全过程占比
export function getProjStatusByDept(data) {
  const url = `${BASEURL}/tanghe/resourceProject/count/projStatusByDept`
  return get(url, data)
}

// 项目详情
export function getProjectDetail(data) {
  const url = `${BASEURL}/tanghe/resourceProject/count/queryForOneMapById`
  return get(url, data)
}

// 卡点详情
export function getPointDetail(data) {
  const url = `${BASEURL}/tanghe/resourceGreenwayPoint/count/queryForMap`
  return get(url, data)
}

// 景点详情
export function getSpotDetail(data) {
  const url = `${BASEURL}/tanghe/front/resourceScenicSpot/queryForMap`
  return get(url, data)
}

// 互学互比列表查询
export function queryMeetingSortFront(data) {
  const url = `${BASEURL}/tanghe/front/bsMeeting/queryMeetingSortFront`
  return get(url, data)
}

// 年度项目数量及总投资额
export function countProjForCurAmound(data) {
  const url = `${BASEURL}/tanghe/front/resourceProject/countProjForCurAmound`
  return get(url, data)
}

// 年度计划开工数据
export function countProjByConsdates2(data) {
  const url = `${BASEURL}/tanghe/front/resourceProject/countProjByConsdates2`
  return get(url, data)
}

// 年度计划完工数据
export function countProjByConsdatee2(data) {
  const url = `${BASEURL}/tanghe/front/resourceProject/countProjByConsdatee2`
  return get(url, data)
}

// 年度投资完成率
export function countProjByAmound(data) {
  const url = `${BASEURL}/tanghe/front/resourceProject/countProjByAmound`
  return get(url, data)
}

// 资源目录
export function rootList(data) {
  const url = `${BASEURL}/tanghe/front/resourceMenu/rootList`
  return get(url, data)
}

// 新增评论
export function addComment(data) {
  const url = `${BASEURL}/tanghe/front/resourceProjectComment/addComment`
  return post(url, data)
}

// 查询评论
export function resourceComment(data) {
  const url = `${BASEURL}/tanghe/front/resourceProjectComment/list`
  return get(url, data)
}

// 根据参数查询项目列表
export function resourceProjectList(data) {
  const url = `${BASEURL}/tanghe/front/resourceProject/list`
  return get(url, data)
}

// 问题项目数据统计
export function countProjectProgressNum(data) {
  const url = `${BASEURL}/tanghe/front/resourceProject/countProjectProgressNum`
  return get(url, data)
}

// 问题项目列表
export function queryProgressList(data) {
  const url = `${BASEURL}/tanghe/front/resourceProject/queryProgressList`
  return get(url, data)
}

// 根据街道统计项目数量
export function countProjectStreetNum(data) {
  const url = `${BASEURL}/tanghe/front/resourceProject/countProjectStreetNum`
  return get(url, data)
}

// 各单位总投资额统计
export function countProjectAmound(data) {
  const url = `${BASEURL}/tanghe/front/resourceProject/countProjectAmound`
  return get(url, data)
}

// 项目评分统计
export function countProjectStar(data) {
  const url = `${BASEURL}/tanghe/front/resourceProjectComment/countProjectStar`
  return get(url, data)
}