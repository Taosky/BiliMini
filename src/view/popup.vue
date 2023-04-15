<template>
  <div>
    <video-panel></video-panel>
  </div>
</template>

<script>
import VideoPanel from "@/components/VideoPanel.vue";

export default {
  name: "App",
  components: { VideoPanel },
  mounted: function () {
    chrome.runtime.sendMessage({ popupOpen: true });
  },
};
</script>

<style>
@media (prefers-color-scheme: dark) {
  .el-tabs__nav-wrap::after {
    background-color: #181818 !important;
  }
  .el-tabs__item {
    color: white !important;
  }
  .el-tabs__item:hover {
    color: #409eff !important;
  }
  html {
    scrollbar-color: gray #282828;
    background: #181818 !important;
  }
}
html {
  height: 650px;
  font-family: "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei",
    "WenQuanYi Micro Hei";
}

body{
    -moz-user-select:none;
    -webkit-user-select:none;
    user-select:none;
}

html::-webkit-scrollbar {
  width: 0px;
}

body {
  overflow-x: hidden;
  overflow-y: auto;
}

#loading {
  transition: opacity 0.5s ease-out;
  width: 380px;
  opacity: 1;
  text-align: center;
  position: absolute;
}
#app {
  opacity: 0;
  transition: opacity 0.5s ease-in;
}

.header .el-tabs__item {
  font-size: 16px;
}
</style>
