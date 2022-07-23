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
</style>
