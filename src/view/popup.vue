<template>
  <div>
    <video-list></video-list>
  </div>
</template>

<script>
import VideoList from '@/components/VideoList.vue'

export default {
  name: 'App',
  components: { VideoList },
  mounted: function(){
    chrome.runtime.sendMessage({popupOpen: true});
  }
}
</script>

<style>
html {
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    height:650px
  }

@media (prefers-color-scheme: dark) {  
  .el-tabs__nav-wrap::after {
    background-color:#181818!important;
  }
  .el-tabs__item{
    color: white !important;
  }
  .el-tabs__item:hover{
    color:#409eff!important;
  }
  html {
    scrollbar-color: gray #282828;
  }
}

  /* html::-webkit-scrollbar {
    width: 0px;
  } */

  body {
    overflow-x: hidden;
    overflow-y: auto;
  }


  #loading{
    transition: opacity 0.5s ease-out;
    width: 380px;
    opacity: 1;
    text-align: center;
    position: absolute;
  }
  #app {
    opacity: 0;
    transition:opacity 0.5s ease-in;
  }
  .header .el-tabs__item {
    font-size:16px;
  }
</style>
