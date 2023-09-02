<template>
  <div>
    <!-- type:8 普通视频 -->
    <div class="card" v-if="cardObj._type === 8" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <a class="video-img" :href="cardObj.short_link ? cardObj.short_link : cardObj.short_link_v2"
        @click="handleLink(cardObj.short_link, cardObj.short_link_v2)"><img class="cover" :src="cardObj.pic" alt="tumb"
          style="width: 100%" /></a>
      <span class="pub-time">{{ cardObj.retime }}</span>
      <span class="watch-later">
        <img v-if="addedToWatch" @click="handleWatchLater(cardObj.aid, add = false)" class="add-towatch"
          src="../../assets/watch-later-2.png" title="取消稍后再看" />
        <img v-else @click="handleWatchLater(cardObj.aid)" class="add-towatch" src="../../assets/watch-later-1.png"  title="添加稍后再看"/>
      </span>
      <div class="container">
        <a style="text-decoration: none; color: black" :href="cardObj.short_link ? cardObj.short_link : cardObj.short_link_v2
          " @click="handleLink(cardObj.short_link, cardObj.short_link_v2)">
          <h4 class="title">
            <b> {{ cardObj.title }}</b>
          </h4>
        </a>
        <div class="up">
          <a @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" class="up-link" :title="cardObj.owner.name"
            :href="`https://space.bilibili.com/${cardObj.owner.mid}`" @click="
              handleLink(`https://space.bilibili.com/${cardObj.owner.mid}`)
              ">
            <img class="avatar" :src="cardObj.owner.face" />
            <span class="up-name">{{ cardObj.owner.name }}</span>
          </a>
        </div>
      </div>
    </div>
    <!-- type:512 番剧 -->
    <div class="card" v-else-if="cardObj._type === 512" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <a class="video-img" :href="cardObj.url" @click="handleLink(cardObj.url)"><img class="cover" :src="cardObj.cover"
          alt="tumb" style="width: 100%" /></a>
      <!-- <span class="type-name-a">{{ cardObj.apiSeasonInfo.type_name }}</span> -->
      <span class="pub-time">{{ cardObj.retime }}</span>
      <span class="watch-later" style="z-index:-100">N/A</span>
      <div class="container">
        <a style="text-decoration: none; color: black" :href="cardObj.url" @click="handleLink(cardObj.url)">
          <h4 class="title">
            <b> {{ cardObj.title }} </b>
          </h4>
        </a>
        <div class="up">
          <a class="up-link" :href="cardObj.url" @click="handleLink(cardObj.url)" @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave">
            <img class="avatar" :src="cardObj.cover" />
            <span class="up-name">{{ cardObj.name }}</span>
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
    <div class="card" v-else-if="cardObj._type === 65535" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <a class="video-img" :href="cardObj.link" @click="handleLink(cardObj.link)"><img class="cover" :src="cardObj.pic"
          alt="tumb" style="width: 100%" /></a>
      <span class="pub-time">{{ cardObj.watched_show.text_large }}</span>
      <span class="watch-later" style="z-index:-100">N/A</span>
      <div class="container">
        <a style="text-decoration: none; color: black" :href="cardObj.link" @click="handleLink(cardObj.link)">
          <h5 class="title">
            <b> {{ cardObj.title }} </b>
          </h5>
        </a>
        <div class="up">
          <a class="up-link" :href="`https://space.bilibili.com/${cardObj.uid}`"
            @click="handleLink(`https://space.bilibili.com/${cardObj.uid}`)" @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave">
            <img class="avatar" :src="cardObj.face" />
            <span class="up-name">{{ cardObj.uname }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "CardEle",
  props: ["cardObj"],
  data: function () {
    return {
      addedToWatch: this.cardObj.toWatch ? true : false,
    }
  },
  methods: {
    handleMouseEnter(a) {
      if (a.target.className == "card") {
        a.target.children[1].style.opacity = 1;
        a.target.children[2].style.opacity = 0.7;
        a.target.children[3].children[0].style.color = "cadetblue";
      } else if (a.target.className == "up-link") {
        a.target.parentElement.parentElement.parentElement.children[3].children[0].style.color =
          "black";
      }
    },
    handleMouseLeave(a) {
      if (a.target.className == "card") {
        a.target.children[1].style.opacity = 0;
        a.target.children[2].style.opacity = 0;
        a.target.children[3].children[0].style.color = "black";
      } else if (a.target.className == "up-link") {
        a.target.parentElement.parentElement.parentElement.children[3].children[0].style.color =
          "cadetblue";
      }
    },
    // link for chromium
    handleLink(link, link_v2 = "") {
      if (link) {
        chrome.tabs.create({ url: link });
      } else {
        chrome.tabs.create({ url: link_v2 });
      }
    },
    //添加稍后再看
    handleWatchLater(aid, add = true) {
      console.log(this.cardObj)
      chrome.cookies.get({
        name: 'bili_jct',
        url: 'https://www.bilibili.com'
      }, (cookies) => {
        let jct = cookies.value;
        if (add) {
          axios.post('https://api.bilibili.com/x/v2/history/toview/add', new URLSearchParams({
            'jsonp': 'jsonp',
            'aid': aid,
            'csrf': jct,
          }), {
            headers: {
              'accept': 'application/json, text/javascript, */*; q=0.01',
            }
          }).then((response) => {
            console.log('添加稍后再看, aid ' + aid)
            console.log(response);
            this.addedToWatch = true
          });
        } else {
          axios.post('https://api.bilibili.com/x/v2/history/toview/del', new URLSearchParams({
            'jsonp': 'jsonp',
            'aid': aid,
            'csrf': jct,
          }), {
            headers: {
              'accept': 'application/json, text/javascript, */*; q=0.01',
            }
          }).then((response) => {
            console.log('删除稍后再看, aid ' + aid)
            console.log(response);
            this.addedToWatch = false;
          });
        }
      });
    },
  },
};
</script>
<style scoped>
@media (prefers-color-scheme: dark) {
  .card {
    box-shadow: 0 4px 8px 0 rgba(255, 253, 253, 0.614);
    background: #282828;
  }

  .card a {
    color: rgb(219, 215, 215) !important;
  }
}

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

.watch-later {
  user-select: none;
  transition: opacity 0.3s ease-in;
  opacity: 0;
  position: absolute;
  z-index: 21;
  background: white;
  font-size: 14px;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  float: left;
  margin-left: -180px;
  text-align: center;
}

.add-towatch {
  width: 30px;
  cursor: pointer;

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
