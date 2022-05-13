const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        "@nipacloud/nvision": "@nipacloud/nvision/dist/browser/nvision.js",
      },
    },
  },
});
