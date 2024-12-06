
const TerserPlugin = require('terser-webpack-plugin')  // 用于在生成环境剔除debuger和console
const CompressionPlugin = require("compression-webpack-plugin"); // gzip压缩,优化http请求,提高加载速度
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin // 代码分析工具 
const path = require('path');
const resolve = dir => {
  return path.join(__dirname, dir);
};


const env = process.env.NODE_ENV
let target = process.env.VUE_APP_URL  // development和production环境是不同的

const cdn = {
  // 开发环境
  dev: {
    css: [],
    js: [
    ]
  },
  // 生产环境
  build: {
    css: [

    ],
    js: [

    ]
  }
}


module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  outputDir: './dist',
  assetsDir:'static',
  filenameHashing:true, // false 来关闭文件名哈希
  lintOnSave: false, // 关闭eslint
  // 打包时不生成.map文件
  productionSourceMap: false,
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 8808,
    proxy: {
      '/shop': {
        target: '43.136.17.41:8080',
        pathRewrite: {
          '^/shop': 'http://43.136.17.41:8080'   //重写路径
          // 此处是大部分文章都不会明说的的地方，
          // 既然我们设置了代理，则所有请求url都已写成/yourapi/xxx/xxx，那请求如何知道我们到底请求的是哪个服务器的数据呢
          // 因此这里的意义在于， 以 /yourapi开头的url请求，代理都会知道实际上应该请求那里，
          // ‘我是服务器/yourapi’，后面的/api根据实际请求地址决定，即我的请求url：/yourapi/test/test，被代理后请求的则是
          // https://我是服务器/yourapi/test/test
        },
        changeOrigin: true
      }


    }
  },
  // webpack相关配置
  chainWebpack: (config) => {
    config.entry.app = ['./src/main.js']
    config.resolve.alias
    .set('@', resolve('src'))
    .set('cps', resolve('src/components'))
    // 关闭npm run build之后，This can impact web performance 警告
    config.performance
    .set('hints', false)
    // 移除 prefetch 插件
    config.plugins.delete("prefetch");
    // 移除 preload 插件
    config.plugins.delete('preload');
    // 压缩代码
    config.optimization.minimize(true);
    // 分割代码
    config.optimization.splitChunks({
      chunks: 'all'
    })
    // 对图片进行压缩处理
    config.module
    .rule('images')
    .use('image-webpack-loader')
    .loader('image-webpack-loader')
    .options({
      disable: true, // webpack@2.x and newer
      quality: '65-80',
      speed: 4
    })
    .end()
    // 项目文件大小分析
    config.plugin('webpack-bundle-analyzer')
    .use(new BundleAnalyzerPlugin({
      openAnalyzer: false,   // 是否打开默认浏览器
      analyzerPort:8777
    }))

    // 对vue-cli内部的 webpack 配置进行更细粒度的修改。
    // 添加CDN参数到htmlWebpackPlugin配置中， 详见public/index.html 修改
    config
    .plugin('html')
    .tap(args => {
      if (process.env.NODE_ENV === 'production') {
        args[0].cdn = cdn.build
      }
      if (process.env.NODE_ENV === 'development') {
        args[0].cdn = cdn.dev
      }
      return args
    })
  },
  configureWebpack:config => {
    // 为生产环境修改配置...
    if (process.env.NODE_ENV === 'production') {
      // 忽略生产环境打包的文件
      config.externals = {
        // "vue": "Vue",
        // "vue-router": "VueRouter",
        // "vuex": "Vuex",
        // "vue-i18n": "VueI18n",
        // "axios": "axios",
        // 'element-ui': 'ELEMENT',
        // 'echarts':'echarts',
        // 'mockjs':'Mock',
        // 'nprogress':'NProgress',
        // 'js-cookie':'Cookies'
      }
      // 去除console来减少文件大小，效果同'UglifyJsPlugin'
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          compress: {
            warnings: false,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          }
        }
      })
      // 开启gzip压缩
      config.plugins.push(new CompressionPlugin({
        algorithm: 'gzip',
        test: new RegExp("\\.(" + ["js", "css"].join("|") + ")$"), // 匹配文件扩展名
        // threshold: 10240, // 对超过10k的数据进行压缩
        threshold: 5120, // 对超过5k的数据进行压缩
        minRatio: 0.8,
        cache: true, // 是否需要缓存
        deleteOriginalAssets:false  // true删除源文件(不建议);false不删除源文件
      }))

    } else {
      // 为开发环境修改配置...

    }
  },
  // 第三方插件配置
  pluginOptions: {

  }
}

