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
  return serverInstanec.request({
    url,
    data,
    method: "post"
  }).then(res => {
    return Promise.resolve(res);
  });
};

const get = (url, data) => {
  return serverInstanec.request({
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
  const url = '/tanghe/studyDeptScore/addBatch'
  return post(url, data);
};

// 项目统计
export function getProjNumAndAmound(data) {
  const url = 'http://172.168.3.182:8080/jeecg-boot/tanghe/resourceProject/count/projNumAndAmound'
  return get(url, data)
}

// 区域分析统计
export function getProjNumByStreet(data) {
  const url = 'http://192.168.2.103:8080/tanghe/resourceProject/count/projNumByStreet'
  return get(url, data)
}

// 项目全过程占比
export function getProjStatusByDept(data) {
  const url = 'http://192.168.2.103:8080/tanghe/resourceProject/count/projStatusByDept'
  return get(url, data)
}

// 重点项目统计
export function getProjDeptNumAmound(data) {
  const url = 'http://172.168.3.182:8080/jeecg-boot/tanghe/resourceProject/count/projDeptNumAmound'
  return get(url, data)
}

// 建设进度
export function getProjStatusAmound(data) {
  const url = 'http://172.168.3.182:8080/jeecg-boot/tanghe/resourceProject/count/projStatusAmound'
  return get(url, data)
}

// 投资类型分析
export function getProjFundType(data) {
  const url = 'http://172.168.3.182:8080/jeecg-boot/tanghe/resourceProject/count/projFundType'
  return get(url, data)
}

// 建设类型分析
export function getProjConsType(data) {
  const url = 'http://172.168.3.182:8080/jeecg-boot/tanghe/resourceProject/count/projConsType'
  return get(url, data)
}

// 项目投资计划
export function getProjConsdatee(data) {
  const url = 'http://172.168.3.182:8080/jeecg-boot/tanghe/resourceProject/count/projConsdatee'
  return get(url, data)
}

// 项目完工计划
export function getProjByConsdate(data) {
  const url = 'http://172.168.3.182:8080/jeecg-boot/tanghe/resourceProject/count/projByConsdate'
  return get(url, data)
}

// 项目详情
export function getProjectDetail(data) {
  const url = 'http://192.168.2.103:8080/tanghe/resourceProject/count/queryForOneMapById'
  return get(url, data)
}

// 卡点详情
export function getPointDetail(data) {
  const url = 'http://192.168.2.103:8080/tanghe/resourceGreenwayPoint/count/queryForMap'
  return get(url, data)
}

// 景点详情
export function getSpotDetail(data) {
  const url = 'http://192.168.2.103:8080/tanghe/front/resourceScenicSpot/queryForMap'
  return get(url, data)
}

// 互学互比列表查询
export function queryMeetingSortFront(data) {
  const url = 'http://192.168.2.103:8080/tanghe/front/bsMeeting/queryMeetingSortFront'
  return get(url, data)
}

// 年度项目数量及总投资额
export function countProjForCurAmound(data) {
  const url = 'http://192.168.2.103:8080/tanghe/front/resourceProject/countProjForCurAmound'
  return get(url, data)
}

// 年度计划开工数据
export function countProjByConsdates2(data) {
  const url = 'http://192.168.2.103:8080/tanghe/front/resourceProject/countProjByConsdates2'
  return get(url, data)
}

// 年度计划完工数据
export function countProjByConsdatee2(data) {
  const url = 'http://192.168.2.103:8080/tanghe/front/resourceProject/countProjByConsdatee2'
  return get(url, data)
}

// 年度投资完成率
export function countProjByAmound(data) {
  const url = 'http://192.168.2.103:8080/tanghe/front/resourceProject/countProjByAmound'
  return get(url, data)
}

// 资源目录
export function rootList(data) {
  const url = 'http://192.168.2.103:8080/tanghe/front/resourceMenu/rootList'
  return get(url, data)
}

// 新增评论
export function addComment(data) {
  const url = 'http://192.168.2.103:8080/tanghe/front/resourceProjectComment/addComment'
  return post(url, data)
}

// 查询评论
export function resourceComment(data) {
  const url = 'http://192.168.2.103:8080/tanghe/front/resourceProjectComment/list'
  return get(url, data)
}

// 根据参数查询项目列表
export function resourceProjectList(data) {
  const url = 'http://192.168.2.103:8080/tanghe/front/resourceProject/list'
  return get(url, data)
}

// 问题项目数据统计
export function countProjectProgressNum(data) {
  const url = 'http://192.168.2.103:8080/tanghe/front/resourceProject/countProjectProgressNum'
  return get(url, data)
}

// 问题项目列表
export function queryProgressList(data) {
  const url = 'http://192.168.2.103:8080/tanghe/front/resourceProject/queryProgressList'
  return get(url, data)
}

// 根据街道统计项目数量
export function countProjectStreetNum(data) {
  const url = 'http://192.168.2.103:8080/tanghe/front/resourceProject/countProjectStreetNum'
  return get(url, data)
}

// 各单位总投资额统计
export function countProjectAmound(data) {
  const url = 'http://192.168.2.103:8080/tanghe/front/resourceProject/countProjectAmound'
  return get(url, data)
}

// 项目评分统计
export function countProjectStar(data) {
  const url = 'http://192.168.2.103:8080/tanghe/front/resourceProjectComment/countProjectStar'
  return get(url, data)
}