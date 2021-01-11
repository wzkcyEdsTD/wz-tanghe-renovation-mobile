const path = require("path");
module.exports = {
    // 开发热更新
    devServer: {
        disableHostCheck: false
    },

    // 打包静态文件访问相对路径设置
    publicPath: process.env.NODE_ENV === 'production' ? '././' : '',
    assetsDir: "libs",

    // 设置打包后是否加载webpack文件
    productionSourceMap: false,

    // 设置less全局变量
    pluginOptions: {
        "style-resources-loader": {
            preProcessor: "less",
            patterns: [path.resolve(__dirname, "./src/common/css/style.less")]
        }
    },

    chainWebpack: (config) => {
        // 添加分析工具
        if (process.env.NODE_ENV === 'production') {
            if (process.env.npm_config_report) {
                config
                    .plugin('webpack-bundle-analyzer')
                    .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
                    .end();
                config.plugins.delete('prefetch')
            }
        }
    }
}