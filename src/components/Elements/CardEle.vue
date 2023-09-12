<template>
  <div>
    <!-- 动态 -->
    <div class="card" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <a class="video-img" @click="handleLink(cardObj.media_link)"><img class="cover" :src="cardObj.media_cover"
          alt="tumb" style="width: 100%" /></a>
      <span class="show-text">{{ cardObj.show_text }}</span>
      <!-- 稍后再看 -->
      <span v-if="cardObj.type_ === 'video'" class="watch-later">
        <img v-if="addedToWatch" @click="handleWatchLater(cardObj.aid, add = false)" class="add-towatch"
          src="../../assets/watch-later-2.png" title="取消稍后再看" />
        <img v-else @click="handleWatchLater(cardObj.aid)" class="add-towatch" src="../../assets/watch-later-1.png"
          title="添加稍后再看" />
      </span>
      <span v-else class="watch-later" style="z-index:-100;background: transparent!important;">N/A</span>
      <!-- 标题等信息 -->
      <div class="container">
        <a style="text-decoration: none; color: black" @click="handleLink(cardObj.media_link)" :title="cardObj.media_title">
          <h4 class="title">
            <b> {{ cardObj.media_title }}</b>
          </h4>
        </a>
        <div class="up">
          <a @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" class="up-link" :title="cardObj.up_title"
            @click="handleLink(cardObj.up_link)">
            <img class="avatar" :src="cardObj.up_cover" />
            <span class="up-name">{{ cardObj.up_title }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addToWatchData, delTowatchData } from '@/utils/api';
export default {
  name: "CardEle",
  props: ["cardObj"],
  data: function () {
    return {
      addedToWatch: this.cardObj.toWatch ? true : false,
    }
  },
  methods: {
    async getJCT() {
      return new Promise((resolve) => {
        chrome.cookies.get({
          name: 'bili_jct',
          url: 'https://www.bilibili.com'
        }, (cookies) => {
          resolve(cookies.value);
        });
      });
    },
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
    handleLink(link) {
      chrome.tabs.create({ url: link });
    },
    //添加稍后再看
    handleWatchLater: async function (aid, add = true) {
      const jct = await this.getJCT();
      if (add) {
        console.log('添加稍后再看, aid ' + aid);
        let responseData = await addToWatchData(aid, jct);
        if (responseData) {
          this.addedToWatch = true;
        }
      } else {
        console.log('删除稍后再看, aid ' + aid);
        let responseData = await delTowatchData(aid, jct);
        if (responseData) {
          this.addedToWatch = false;
        }
      }
    },
  }
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
img:hover{
  cursor: pointer;
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

.show-text {
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
  font-size: 13px;
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
