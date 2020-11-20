// 服务地址
export const ServiceUrl = {
    // 高德矢量图
    GDVEC: "https://wprd{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=7",

    // 高德影像图
    GDIMG: "https://wprd{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=6",

    // 高德路网
    GDROADNET: "https://wprd{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",

    // 要素服务
    FEATUREMVT: "http://172.168.3.183:8090/iserver/services/data-alldata/rest/data",

    // 细绿道
    GREENWAY: "http://172.168.3.183:8090/iserver/services/3D-ld1gaode/rest/realspace/datas/ld1waikuo9-15",

    // 细塘河
    RIVER: "http://172.168.3.183:8090/iserver/services/3D-thgaode/rest/realspace/datas/thgaode"

}

export const MediaServer = "http://172.168.3.182:8090/static";

const datasource = "172.168.3.181_thxm:";


// 图层列表
export const LayerList = [{
    id: "十二景",
    label: "十二景",
    dataset: `${datasource}十二景`,
    icon: '十二景',
    icon2: "十二景",
    type: "mvt",
    saveData: "setSejList",
    check: false,
}, {
    id: "项目",
    label: "项目",
    dataset: `${datasource}项目`,
    icon: false,
    icon2: "项目",
    type: "mvt",
    check: false,
}, {
    id: "绿道断点",
    label: "断点",
    dataset: `${datasource}绿道断点`,
    icon: '断点',
    icon2: "断点",
    type: "mvt",
    check: false,
}, {
    id: "绿道",
    label: "绿道",
    dataset: `${datasource}绿道断点`,
    icon: '绿道',
    icon2: "绿道",
    check: false,
}]