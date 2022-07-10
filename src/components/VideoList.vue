<template>
  <div>
    <div id="videoList">
      <div id="col1">
        <div v-for="cardObj in videolist1" :key="cardObj.index">
          <div class="card" v-if="cardObj.pic">
            <a class="video-img" :href="cardObj.short_link"
              ><img
                class="cover"
                :src="cardObj.pic"
                alt="tumb"
                style="width: 100%"
            /></a>
            <span class="pub-time">{{ cardObj.retime}}</span>
            <div class="container">
              <a
                style="text-decoration: none; color: black"
                :href="cardObj.short_link"
              >
                <h5 class="title"><b> {{cardObj.title}}</b></h5>
              </a>
              <a
                class="up-link"
                :title="cardObj.owner.name"
                :href="`https://space.bilibili.com/${cardObj.owner.mid}`"
              >
                <img class="avatar" :src="cardObj.owner.face" />
                <span class="up-name">{{cardObj.owner.name}}</span>
              </a>
            </div>
          </div>
          <div class="card" v-else>
            <a class="video-img" :href="cardObj.url"
              ><img
                class="cover"
                :src="cardObj.cover"
                alt="tumb"
                style="width: 100%"
            /></a>
            <span class="pub-time">番剧</span>
            <div class="container">
              <a
                style="text-decoration: none; color: black"
                :href="cardObj.url"
              >
                <h5 class="title"><b> {{cardObj.new_desc}} </b></h5>
              </a>
              <div class="up">
                <a class="up-link" :href="cardObj.url">
                  <img class="avatar" :src="cardObj.apiSeasonInfo.cover" />
                  <span class="up-name">{{cardObj.apiSeasonInfo.title}}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="col2">
        <div v-for="cardObj in videolist2" :key="cardObj.index">
          <div class="card" v-if="cardObj.pic">
            <a class="video-img" :href="cardObj.short_link"
              ><img
                class="cover"
                :src="cardObj.pic"
                alt="tumb"
                style="width: 100%"
            /></a>
            <span class="pub-time">{{ cardObj.retime}}</span>
            <div class="container">
              <a
                style="text-decoration: none; color: black"
                :href="cardObj.short_link"
              >
                <h5 class="title"><b> {{cardObj.title}}</b></h5>
              </a>
              <a
                class="up-link"
                :title="cardObj.owner.name"
                :href="`https://space.bilibili.com/${cardObj.owner.mid}`"
              >
                <img class="avatar" :src="cardObj.owner.face" />
                <span class="up-name">{{cardObj.owner.name}}</span>
              </a>
            </div>
          </div>
          <div class="card" v-else>
            <a class="video-img" :href="cardObj.url"
              ><img
                class="cover"
                :src="cardObj.cover"
                alt="tumb"
                style="width: 100%"
            /></a>
            <span class="pub-time">番剧</span>
            <div class="container">
              <a
                style="text-decoration: none; color: black"
                :href="cardObj.url"
              >
                <h5 class="title"><b> {{cardObj.new_desc}} </b></h5>
              </a>
              <div class="up">
                <a class="up-link" :href="cardObj.url">
                  <img class="avatar" :src="cardObj.apiSeasonInfo.cover" />
                  <span class="up-name">{{cardObj.apiSeasonInfo.title}}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a href="https://t.bilibili.com/"
      ><button class="moreBtn" onclick="seeMore">查看全部</button></a
    >
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "VideoList",
  mounted() {
    browser.runtime.sendMessage({});
    this.getVideoData();
  },
  data: function () {
    return {
      videolist1: [],
      videolist2: [],
    };
  },
  computed: {
    defaultText() {
      return browser.i18n.getMessage("extName");
    },
  },
  methods: {
     getRetime: function(createtime) {
      let now = Date.parse(new Date()) / 1000;
      let limit = now - createtime;
      let content = "";
      if (limit < 60) {
        content = "刚刚";
      } else if (limit >= 60 && limit < 3600) {
        content = Math.floor(limit / 60) + "分钟前";
      } else if (limit >= 3600 && limit < 86400) {
        content = Math.floor(limit / 3600) + "小时前";
      } else if (limit >= 86400 && limit < 2592000) {
        content = Math.floor(limit / 86400) + "天前";
      } else if (limit >= 2592000 && limit < 31104000) {
        content = Math.floor(limit / 2592000) + "个月前";
      } else {
        content = "很久前";
      }
      return content;
    },
    getVideoData: function() {
      let that = this;
      let cardIndex = 0;
      axios
        .get(
          `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?uid=&type_list=8`
        )
        .then(function (response) {
          console.log(response.data)
          response.data.data.cards.forEach(function (card) {
            cardIndex += 1;
            let cardObj = JSON.parse(card.card);
            cardObj.index = cardIndex;
            cardObj.retime = that.getRetime(cardObj.ctime);
            if (cardIndex % 2 === 1) {
              that.videolist1.push(cardObj);
            } else {
              that.videolist2.push(cardObj);
            }
          });
        });
    },
  },
};
</script>

<style scoped>
#videoList {
  width: 380px;
}

#col1 {
  width: 48%;
  display: inline-flex;
  flex-wrap: wrap;
}

#col2 {
  width: 48%;
  display: inline-flex;
  flex-wrap: wrap;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  width: 170px;
  margin-left: 5px;
  margin-right: 5px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.video-img:hover + .pub-time {
  opacity: 1;
}

img {
  border-radius: 5px 5px 0 0;
}

.pub-time {
  transition: opacity 0.3s ease-in;
  opacity: 0;
  position: absolute;
  margin-top: -20px;
  z-index: 10;
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

.moreBtn {
  transition: 0.3s;
  text-align: center;
  height: 32px;
  width: 350px;
  margin-left: 7px;
  background-color: #f4f4f4;
  cursor: pointer;
  border: none;
  border-radius: 4px;
}
.moreBtn:hover {
  background-color: #ececec;
}
</style>
