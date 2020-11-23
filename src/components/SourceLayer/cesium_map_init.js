import {
    ServiceUrl
} from "@/config/mapConfig";

// 地图初始配置
export const initMapConfig = () => {
    window.earth.imageryLayers.get(0).show = false;
    window.earth.scene.globe.baseColor = new Cesium.Color.fromCssColorString(
        "rgba(13, 24, 45, 1)"
    );
    // 限制缩放级别
    window.earth.scene.screenSpaceCameraController.minimumZoomDistance = 1000;
    window.earth.scene.screenSpaceCameraController.maximumZoomDistance = 20000;
}


// 高德服务图层叠加
export const addGDLayer = ({
    url,
    layer
}) => {
    return window.earth.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
            url,
            layer,
            style: "normal",
            format: "image/jpeg",
            subdomains: ['01', '02', '03', '04'],
            tileMatrixSetID: "GoogleMapsCompatible",
        })
    )
}


// 塘河
export const addRiverLayer = () => {
    return window.earth.imageryLayers.addImageryProvider(
        new Cesium.SuperMapImageryProvider({
            url: ServiceUrl.RIVER,
        })
    );
}


// 绿道
export const addGreenwayLayer = () => {
    return window.earth.imageryLayers.addImageryProvider(
        new Cesium.SuperMapImageryProvider({
            url: ServiceUrl.GREENWAY,
        })
    );
}


const cameraView = {
    destination: Cesium.Cartesian3.fromDegrees(
        120.67625660935506,
        27.990332018707733,
        15000.0
    ),
    orientation: {
        heading: 0.01768860454315663,
        pitch: Cesium.Math.toRadians(-90),
        roll: 0,
    },
}

// 相机视角初始化
export const initCamera = () => {
    window.earth.scene.camera.setView(cameraView);
}


// 视角复位
export const resetCamera = () => {
    window.earth.scene.camera.flyTo(cameraView);
}












// 添加定位图标
export const addLocationIcon = (geometry, id) => {
    const datasource = window.earth.dataSources.getByName("location")[0];
    datasource.entities.removeAll();
    window.earth.entities.removeById("address-location");   // 消除地名地址定位图标

    const {
        x,
        y
    } = geometry;
    const locationEntity = new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(x + 0.004, y - 0.004, 4),
        billboard: {
            image: `/libs/images/map-ico/location.png`,
            width: 40,
            height: 40,
            scaleByDistance: new Cesium.NearFarScalar(3000, 1.5, 6000, 1.2),
            // pixelOffset: new Cesium.Cartesian2(0, -5),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        id,
    });

    datasource.entities.add(locationEntity);
}


// 清除定位图标
export const cleanLocationIcon = () => {
    const datasource = window.earth.dataSources.getByName("location")[0];
    datasource.entities.removeAll();
}