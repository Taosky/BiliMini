<template>
  <div>
    <div id="videoList">
      <div id="col1">
        <div v-for="cardObj in videolist1" :key="cardObj.index">
          <card-ele :cardObj="cardObj"></card-ele>
        </div>
      </div>
      <div id="col2">
        <div v-for="cardObj in videolist2" :key="cardObj.index">
          <card-ele :cardObj="cardObj"></card-ele>
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
import CardEle from "@/components/ListElement/CardEle.vue"
export default {
  name: "VideoList",
  components: {
        CardEle,
    },
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
          `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?uid=&type_list=8,512,4099`
        )
        .then(function (response) {
          response.data.data.cards.forEach(function (card) {
            cardIndex += 1;
            let cardObj = JSON.parse(card.card);
            cardObj.index = cardIndex;
            cardObj.retime = that.getRetime(card.desc.timestamp);
            cardObj._type = card.desc.type;
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

#col1, #col2  {
  width: 48%;
  display: inline-flex;
  flex-wrap: wrap;
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
