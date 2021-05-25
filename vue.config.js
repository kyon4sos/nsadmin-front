const path = require('path')

module.exports = {
  lintOnSave:false,
  runtimeCompiler: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:90',
        changeOrigin: true,
      },
    }
  },
  chainWebpack:(config)=>{
    config.resolve.alias
    .set('@ant-design/icons/lib/dist$',path.resolve(__dirname, './src/icons.js'))
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
        hack: `true;
        @import "${path.resolve(__dirname, './src/assets/css/variable.less')}";
        `
        }
        },
    },
  },
}
