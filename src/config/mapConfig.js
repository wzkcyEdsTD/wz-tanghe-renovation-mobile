// 服务地址
export const ServiceUrl = {
    // 高德矢量图
    GDVEC: "https://wprd{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=7",

    // 高德影像图
    GDIMG: "https://wprd{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=6",

    // 高德路网
    GDROADNET: "https://wprd{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",

    // 要素服务
    FEATUREMVT: "http://172.20.83.228:8090/iserver/services/data-alldata/rest/data",

    // 高德细绿道
    GDGREENWAY: "http://172.20.83.228:8090/iserver/services/3D-ld1gaode/rest/realspace/datas/ld1waikuo9-15",

    // 高德细塘河
    GDRIVER: "http://172.20.83.228:8090/iserver/services/3D-thgaode/rest/realspace/datas/thgaode",

    // 大数据风格底图
    BDIMG: "http://10.36.245.203:8090/iserver/services/map-agscachev2-YJDSJCGCS2000/rest/maps/YJ_DSJ_CGCS2000",

    // 天地图影像
    TDTIMG: "http://10.36.245.203:8090/iserver/services/map-agscachev2-YJYX2019CGCS2000/rest/maps/YJ_YX_2019_CGCS2000",

    // 天地图影像路网
    ROADNET: "http://172.20.83.228:8090/iserver/services/3D-dlallzjan-2/rest/realspace/datas/dlallzj_an",

    // 塘河
    RIVER: "http://172.20.83.228:8090/iserver/services/3D-th/rest/realspace/datas/th",

    // 绿道
    GREENWAY: "http://172.20.83.228:8090/iserver/services/3D-ld1/rest/realspace/datas/ld1",

    // 绿化覆盖
    GREENING: "http://172.20.83.228:8090/iserver/services/3D-ldfw_polygon/rest/realspace/datas/ldfw_polygon",

    // 绿化覆盖线
    GREENING_LINE: "http://172.20.83.228:8090/iserver/services/3D-ldfw_line/rest/realspace/datas/ldfw_line",

    // 用地性规划
    CITYPLANNING: "http://172.20.83.228:8090/iserver/services/3D-KGSQ/rest/realspace/datas/KGSQ",

    // 用地现状
    YDXZ: "http://172.20.83.228:8090/iserver/services/3D-dltb/rest/realspace/datas/dltb",

    // 用地分析
    YDFX: "http://172.20.83.228:8090/iserver/services/3D-rgfxm/rest/realspace/datas/rgfxm",

    // 2020贯通绿道
    LD2020: "http://172.20.83.228:8090/iserver/services/3D-ld2020/rest/realspace/datas/ld2020",
}

export const MediaServer = "http://172.20.83.227:8080/sys/common/static";

const datasource = "thxm:";

export const ServerDatasource = datasource;

// 图层列表
export const LayerList = [{
    id: "十二景",
    label: "十二景",
    dataset: `${datasource}sp_point_resource`,
    icon: '十二景',
    icon2: "十二景",
    type: "mvt",
    saveData: "setSejList",
    param: "resource_type='scenicspot12'",
    check: false,
}, {
    id: "项目",
    label: "项目",
    dataset: `${datasource}th_spatial_project_view`,
    icon: false,
    icon2: "项目",
    type: "mvt",
    check: false,
}, {
    id: "绿道断点",
    label: "断点",
    dataset: `${datasource}th_spatial_greenway_view`,
    icon: '断点',
    icon2: "断点",
    type: "mvt",
    param: "resource_type='greenway_all'",
    check: false,
}, {
    id: "绿道",
    label: "绿道",
    icon: '绿道',
    icon2: "绿道",
    check: false,
}]