const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  pwa: {
    name: 'starter',
    themeColor: '#1E3D58',
    msTileColor: '#000000', 
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxPluginMode: 'GenerateSW'
  },
  devServer: {
    client: {
      webSocketURL: 'ws://0.0.0.0:8000/ws',
    },
    allowedHosts: 'all',
  }
})