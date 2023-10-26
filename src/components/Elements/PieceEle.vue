<template>
  <a class="piece" @click="handleLink(video.link)">
    <div class="video-img">
      <picture>
        <img :src="video.cover" />
      </picture>
    </div>
    <div class="video-info">
      <div class="title">
        {{ video.title }}
      </div>
      <div class="date">{{ video.date }}</div>
      <div class="name">{{ video.name }}</div>
    </div>
  </a>
</template>

<script>
export default {
  name: "CardEle",
  props: ["video"],
  methods: {
    // link for chromium
    handleLink(link) {
      chrome.tabs.create({ url: link });
    },
  },
};
</script>

<style scoped>
@media (prefers-color-scheme: dark) {
  .piece {
    background: transparent;
    color: rgb(219, 215, 215) !important;
  }
}

.piece {
  display: flex;
  border-radius: 5px;
  padding: 10px 20px;
  transition: 0.3s;
  margin-bottom: 10px;
  margin-right: 12px;
  color: black;
  text-decoration: none;
}

.piece:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.271);
  cursor: pointer;
}

.video-img {
  position: relative;
  flex-shrink: 0;
  margin-right: 10px;
  width: 128px;
  height: 72px;
  border-radius: 4px;
}

picture {
  position: relative;
  display: inline-block;
  line-height: 1;
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: inherit;
}

.video-info {
  display: flex;
  flex: 1 auto;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  margin-bottom: 4px;
  height: 36px;
  font-size: 14px;
  line-height: 18px;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  text-overflow: -o-ellipsis-lastline;
  text-overflow: ellipsis;
  word-break: break-word !important;
  word-break: break-all;
  line-break: anywhere;
  -webkit-line-clamp: 2;
}

.date,
.name {
  display: flex;
  align-items: center;
  color: rgb(152, 152, 152);
  font-size: 12px;
  line-height: 16px;
}</style>