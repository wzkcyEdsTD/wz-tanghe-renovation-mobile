/**
 * 画点、面
 * @param {*} ctx
 * @param {*} param1
 * @param {*} node
 */
export const drawFeatures = (ctx, {
    result
}, node, fn) => {
    window.billboardMap[node.id] = window.earth.scene.primitives.add(new Cesium.BillboardCollection());
    window.whiteLabelMap[node.id] = window.earth.scene.primitives.add(new Cesium.LabelCollection());
    window.blackLabelMap[node.id] = window.earth.scene.primitives.add(new Cesium.LabelCollection());

    let forceDrawFeatures = result.features;

    if (node.saveData) {
        ctx.saveDataMap[node.id] = result.features;
        ctx[node.saveData](forceDrawFeatures)
    }

    forceDrawFeatures.map(v => {
        !window.featureMap[node.id] && (window.featureMap[node.id] = {});
        window.featureMap[node.id][v.attributes.SMID] = {
            name: v.attributes.SHORTNAME || v.attributes.NAME || v.attributes.MC || v.attributes.JC || v.attributes[node.withExtraKey],
            attributes: v.attributes,
            geometry: v.geometry,
            type: node.id
        }
    })
    forceDrawFeatures.map(item => {
        const position = Cesium.Cartesian3.fromDegrees(
            item.geometry.x + 0.004,
            item.geometry.y - 0.004,
            4
        );

        window.billboardMap[node.id].add({
            id: `billboard@${item.attributes.SMID}@${node.id}`,
            image: node.icon ? `/libs/images/map-ico/${node.icon}.png` : `/libs/images/map-ico/${item.attributes.CURRENT_STATE.trim()}.png`,
            width: node.icon=='断点' ? 30 : 34,
            height: node.icon=='断点' ? 30 : 34,
            scaleByDistance: new Cesium.NearFarScalar(500, 1.5, 6000, 1),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            position
        })

        if (node.id == '十二景') return;

        window.whiteLabelMap[node.id].add({
            id: `label@${item.attributes.SMID}@${node.id}`,
            text: item.attributes.SHORTNAME || item.attributes.NAME,
            fillColor: ~node.id.indexOf('项目') ? item.attributes.SF2021 == '是' ? new Cesium.Color.fromCssColorString("#61F5F5") : new Cesium.Color.fromCssColorString("#02FCDC") : new Cesium.Color.fromCssColorString("#fff"),
            font: "bold 1.7vh Microsoft YaHei",
            outlineColor: Cesium.Color.BLACK,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: '2',
            scaleByDistance: new Cesium.NearFarScalar(500, 1.3, 6000, 1),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 6000),
            pixelOffset: new Cesium.Cartesian2(0, 46),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            position
        });
        window.blackLabelMap[node.id].add({
            id: `label@${item.attributes.SMID}@${node.id}`,
            text: item.attributes.SHORTNAME || item.attributes.NAME,
            fillColor: ~node.id.indexOf('项目') ? item.attributes.SF2021 == '是' ? new Cesium.Color.fromCssColorString("#61F5F5") : new Cesium.Color.fromCssColorString("#02FCDC") : new Cesium.Color.fromCssColorString("#010C27"),
            font: "bold 1.7vh Microsoft YaHei",
            outlineColor: Cesium.Color.WHITE,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: '2',
            scaleByDistance: new Cesium.NearFarScalar(500, 1.3, 6000, 1),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 6000),
            pixelOffset: new Cesium.Cartesian2(0, 46),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            position
        });
    });
    fn && fn();
}