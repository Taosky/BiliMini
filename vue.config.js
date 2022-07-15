const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    popup: {
      template: 'public/browser-extension.html',
      entry: './src/popup/main.js',
      title: 'Popup'
    }
  },
  pluginOptions: {
    browserExtension: {
      componentOptions: {
        background: {
          entry: 'src/background.js'
        }
      }
    },
  },
  productionSourceMap: false,
  filenameHashing: false,
  chainWebpack: config => {
    config.optimization.delete("splitChunks");
    config.optimization.splitChunks(false).minimize(false);
  },
})
