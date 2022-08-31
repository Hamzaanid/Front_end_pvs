
publicPath: process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/'
}
    
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  lintOnSave: false
})

