module.exports = {
  //路径前缀
  publicPath: "/",
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: (config) => {
    //忽略的打包文件
    config.externals({
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
    })
    const entry = config.entry('app')
    entry
      .add('babel-polyfill')
      .end()
    entry
      .add('classlist-polyfill')
      .end()
    entry
      .add('@/mock')
      .end()
  },
  devServer: {
    port: 1888,
    proxy: {
      '/api': {
        //本地服务接口地址
        // target: 'http://localhost',
        //远程演示服务地址
        // target: 'https://saber.bladex.vip/api',
        // target: 'http://192.168.31.37:80',  // 李亮
        // target: 'http://192.168.31.77:80',  // 于哲
        // target: 'http://192.168.31.247:80', // 杨林
        target: 'http://192.168.33.202:8999/', // sit
        // target: 'http://erikdeleyeuat.focus-base.com:8999/', // uat
        ws: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
}