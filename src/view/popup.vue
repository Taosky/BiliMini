<template>
  <div>
    <main-panel></main-panel>
  </div>
</template>

<script>
import MainPanel from "@/components/MainPanel.vue";

export default {
  name: "App",
  components: { MainPanel },
  mounted: function () {
    chrome.runtime.sendMessage({ popupOpen: true });
    setInterval(()=>{
      chrome.runtime.sendMessage({ action: 'heartbeat' }, (response) => {
      console.log(response.status);
  });
    }, 3000);
  },
};
</script>

<style>
html.vivaldi,
html.vivaldi body {
    height:650px;
    overflow:hidden;
}


html {
  font-family: "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei";
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  height: 650px;
}

body {
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}

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
  }
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
