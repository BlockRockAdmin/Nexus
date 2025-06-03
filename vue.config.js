const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    resolve: {
      fallback: {
        url: require.resolve('url/'),
        buffer: require.resolve('buffer/'),
        process: require.resolve('process/browser'),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: ['process/browser', 'process'],
      }),
    ],
  },
});
