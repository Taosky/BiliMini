<template>
  <div>
    <!-- type:8 普通视频 -->
    <div
      class="card"
      v-if="cardObj._type === 8"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <a class="video-img" :href="cardObj.short_link"
        ><img class="cover" :src="cardObj.pic" alt="tumb" style="width: 100%"
      /></a>
      <span class="pub-time">{{ cardObj.retime }}</span>
      <div class="container">
        <a
          style="text-decoration: none; color: black"
          :href="cardObj.short_link"
        >
          <h5 class="title">
            <b> {{ cardObj.title }}</b>
          </h5>
        </a>
        <div class="up">
          <a
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
            class="up-link"
            :title="cardObj.owner.name"
            :href="`https://space.bilibili.com/${cardObj.owner.mid}`"
          >
            <img class="avatar" :src="cardObj.owner.face" />
            <span class="up-name">{{ cardObj.owner.name }}</span>
          </a>
        </div>
      </div>
    </div>
    <!-- type:512 番剧 -->
    <div
      class="card"
      v-else-if="cardObj._type === 512"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <a class="video-img" :href="cardObj.url"
        ><img class="cover" :src="cardObj.cover" alt="tumb" style="width: 100%"
      /></a>
      <!-- <span class="type-name-a">{{ cardObj.apiSeasonInfo.type_name }}</span> -->
      <span class="pub-time">{{ cardObj.retime }}</span>
      <div class="container">
        <a style="text-decoration: none; color: black" :href="cardObj.url">
          <h5 class="title">
            <b> {{ cardObj.new_desc }} </b>
          </h5>
        </a>
        <div class="up">
          <a
            class="up-link"
            :href="cardObj.url"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
          >
            <img class="avatar" :src="cardObj.apiSeasonInfo.cover" />
            <span class="up-name">{{ cardObj.apiSeasonInfo.title }}</span>
          </a>
        </div>
      </div>
    </div>
    <!-- type:4099 综艺-->
    <!-- type:4097 疑似推荐UP
    type:4098 疑似推荐UP
    type:4100 疑似推荐UP
    type:4101 疑似推荐UP -->
    <!-- type:65535 直播（自定义） -->
   <div
      class="card"
      v-else-if="cardObj._type === 65535"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <a class="video-img" :href="cardObj.link"
        ><img class="cover" :src="cardObj.pic" alt="tumb" style="width: 100%"
      /></a>
      <span class="pub-time">{{ cardObj.watched_show.text_large }}</span>
      <div class="container">
        <a style="text-decoration: none; color: black" :href="cardObj.url">
          <h5 class="title">
            <b> {{ cardObj.title }} </b>
          </h5>
        </a>
        <div class="up">
          <a
            class="up-link"
            :href="cardObj.url"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
          >
            <img class="avatar" :src="cardObj.face" />
            <span class="up-name">{{ cardObj.uname }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardEle",
  props: ["cardObj"],
  methods: {
    handleMouseEnter(a) {
      if (a.target.className == "card") {
        a.target.children[1].style.opacity = 1;
        a.target.children[2].children[0].style.color = "cadetblue";
      } else if (a.target.className == "up-link") {
        a.target.parentElement.parentElement.parentElement.children[2].children[0].style.color =
          "black";
      }
    },
    handleMouseLeave(a) {
      if (a.target.className == "card") {
        a.target.children[1].style.opacity = 0;
        a.target.children[2].children[0].style.color = "black";
      } else if (a.target.className == "up-link") {
        a.target.parentElement.parentElement.parentElement.children[2].children[0].style.color =
          "cadetblue";
      }
    },
  },
};
</script>
<style scoped>
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  width: 177px;
  margin-left: 5px;
  margin-right: 5px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.271);
}

img {
  border-radius: 5px 5px 0 0;
}

.type-name-a {
  user-select: none;
  font-size: 14px;
  position: absolute;
  z-index: 2;
  color: white;
  background: #00a0d8;
  margin-top: 3px;
  margin-left: -165px;
  padding-left: 6px;
  padding-right: 6px;
  border-radius: 4px;
  text-align: center;
}

.type-name-b {
  user-select: none;
  font-size: 14px;
  position: absolute;
  z-index: 2;
  color: white;
  background: rgb(112, 47, 58);
  margin-top: 3px;
  border-radius: 5px;
  margin-left: -165px;
  padding-left: 6px;
  padding-right: 6px;
  border-radius: 4px;
  text-align: center;
}

.pub-time {
  user-select: none;
  transition: opacity 0.3s ease-in;
  opacity: 0;
  position: absolute;
  z-index: 20;
  color: white;
  background: #000a;
  font-size: 14px;
  border-radius: 10px;
  margin-top: 3px;
  margin-left: -65px;
  padding-left: 6px;
  padding-right: 6px;
  float: right;
  text-align: center;
}

.container {
  padding: 2px 8px;
}

.title {
  margin: 0;
  text-decoration: none !important;
  transition: 0.3s;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}

.title:hover {
  color: cadetblue;
  cursor: pointer;
}

.avatar {
  border-radius: 10px;
  width: 22px;
  display: inline-block;
}

.up-link {
  transition: 0.3s;
  text-decoration: none !important;
  display: flex;
  color: black;
  justify-content: space-between;
  border-radius: 13px;
  padding: 2px;
  font-size: 12.5px;
  margin: 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 10px;
  margin-bottom: 10px;
}

.up-link:hover {
  background: #aaaaaa47;
  text-decoration: none;
  cursor: pointer;
  color: #00a0d8;
}

.up-name {
  float: right;
  padding-right: 5px;
  padding-left: 10px;
  padding-top: 2px;
}
</style>
