// 隐藏字段
export const commonDetailHideField = [
    "名称",
    "标签",
    "备注",
    "形象进度",
    "目录分类",
    "数据来源",
    "经度",
    "纬度",
    "建设地点1",
    "建设地点2",
    "建设地点3",
    "是否属于67个里面的",
    "类型",
    "统计",
    "唯一码",
    "更新参考数据源",
    "照片编号",
    "类型1",
    "类型2",
    "类型3",
    "显示级别",
    "类型编码",
    "马克",
    "照片",
    "颜色",
    "全景",
    "视频",
    "语音",
    "现场记录",
    "景观图",
    "周边全景",
    "全景缩略图",
    "原表唯一码",
];

// 滑动组件按钮
export const topBtns = [{
        id: "overview",
        label: "全景",
    },
    {
        id: "video",
        label: "视频",
    },
    {
        id: "photo",
        label: "图片",
    }
];

// 滑动组件配置
export const swiperOption = {
    slidesPerView: 1,
    scrollbar: {
        el: ".swiper-scrollbar",
    },
    navigation: {
        nextEl: ".swiper-button-right",
        prevEl: ".swiper-button-left",
    }
};

// 进度图片
export const progressImgHash = {
    前期研究: "前期研究",
    "前期(滞后)": "前期滞后",
    在建: "正在建设",
    "在建(滞后)": "建设滞后",
    完工: "完美建设",
}


// 搜索结果图标
export const searchIconHash = {
    十二景: "十二景",
    断点: "断点",
    前期研究: "前期研究",
    "前期(滞后)": "前期滞后",
    在建: "正在建设",
    "在建(滞后)": "建设滞后",
    完工: "完美建设",
}