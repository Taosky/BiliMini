<template>
  <div>
    <div id="videoList">
      <el-tabs
        class="header"
        v-model="activeTab"
        @tab-click="handleClick"
        v-loading.fullscreen.lock="loading"
      >
        <el-tab-pane label="投稿" name="8"></el-tab-pane>
        <el-tab-pane label="番剧" name="512"></el-tab-pane>
        <el-tab-pane label="直播" name="65536"></el-tab-pane>
      </el-tabs>
      <div class="main">
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
      <p style="text-align: center; font-size: 14px" v-show="noMore">
        (´・ω・｀) 没有更多了
      </p>
      <a v-show="noMore" :href="more['link']"
        ><button class="moreBtn" onclick="seeMore">
          {{ more["text"] }}
        </button></a
      >
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CardEle from "@/components/ListElement/CardEle.vue";
export default {
  name: "VideoList",
  components: {
    CardEle,
  },
  async mounted() {
    this.activeTab = localStorage["activeTab"] ? localStorage["activeTab"] : "8";
    let login_status = await this.is_logged_in();
    console.log(login_status)
    if(!login_status){
      this.$message.error({message:'尚未登录，登录后再试',duration:0,offset:1});
      return;
    }
    this.updateCards();
    this.listenScoller();
  },
  data: function () {
    return {
      videolist1: [],
      videolist2: [],
      activeTab: "8",
      loading: false,
      noMore: false,
    };
  },
  computed: {
    more() {
      return this.activeTab === "65536"
        ? { link: "https://live.bilibili.com/", text: "全部直播" }
        : { link: "https://t.bilibili.com/", text: "查看动态页" };
    },
    lastDynamicId() {
      return this.videolist2[this.videolist2.length - 1].dynamicId
        ? this.videolist2[this.videolist2.length - 1].dynamicId
        : "";
    },
  },
  methods: {
    // 监听滚动条
    listenScoller: function () {
      let that = this;
      window.addEventListener("scroll", function () {
        let scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        let windowHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        let scrollHeight =
          document.documentElement.scrollHeight || document.body.scrollHeight;
        if (scrollTop + windowHeight + 100 >= scrollHeight) {
          that.infLoad();
        }
      });
    },
    // 无限加载
    infLoad: function () {
      if (this.loading || this.noMore || this.activeTab === "65536") {
        return;
      }
      this.updateCards(false, this.lastDynamicId);
    },
    // tab点击
    handleClick() {
      localStorage["activeTab"] = this.activeTab;
      this.updateCards();
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    is_logged_in: async function() {
    let response = await axios.get(`https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?uid=&type_list=8,512,4099`);
    if (response.data.code !=0){
      return false;
    }
    return true;
    },
    get_bvid(short_link) {
      return short_link.match(/\/(BV\w+)$/)[1];
    },
    getRetime(createtime) {
      let now = Date.parse(new Date()) / 1000;
      let limit = now - createtime;
      let content = "";
      if (limit < 60) {
        content = "就在刚刚";
      } else if (limit >= 60 && limit < 3600) {
        content = Math.floor(limit / 60) + "分钟前";
      } else if (limit >= 3600 && limit < 86400) {
        content = Math.floor(limit / 3600) + "小时前";
      } else if (limit >= 86400 && limit < 2592000) {
        content = Math.floor(limit / 86400) + "天之前";
      } else if (limit >= 2592000 && limit < 31104000) {
        content = Math.floor(limit / 2592000) + "个月前";
      } else {
        content = "很久以前";
      }
      return content;
    },
    genLiveData(response) {
      let cardIndex = 0;
      let that = this;
      response.data.data.list.forEach(function (card) {
        cardIndex += 1;
        let cardObj = card;
        cardObj.index = cardIndex;
        cardObj._type = 65535;
        if (cardIndex % 2 === 1) {
          that.videolist1.push(cardObj);
        } else {
          that.videolist2.push(cardObj);
        }
      });
    },
    genVideoData(response) {
      let cardIndex = 0;
      let that = this;
      if (response.data.data.cards.length < 20) {
        that.noMore = true;
      }
      response.data.data.cards.forEach(function (card) {
        cardIndex += 1;
        let cardObj = JSON.parse(card.card);
        cardObj.index = cardIndex;
        cardObj._type = card.desc.type;
        cardObj.dynamicId = card.desc.dynamic_id_str;
        // 获取视频时间点截图
        // if (cardObj._type === 8) {
        //   let bvid = that.get_bvid(cardObj.short_link);
        //   let res = await axios.get(`https://api.bilibili.com/x/player/videoshot?bvid=${bvid}&index=1`);

        // }
        // 时间显示字符串
        cardObj.retime = that.getRetime(card.desc.timestamp);
        if (cardIndex % 2 === 1) {
          that.videolist1.push(cardObj);
        } else {
          that.videolist2.push(cardObj);
        }
      });
    },
    resetData() {
      // 回到顶部
      scrollTo(0, 0);
      // 清空数据
      this.noMore = false;
      this.videolist1 = [];
      this.videolist2 = [];
    },
    async updateCards(refresh = true, offset = "") {
      // loading
      this.loading = true;
      // 直播/视频
      if (this.activeTab === "65536") {
        this.resetData();
        let response = await axios.get(
          `https://api.live.bilibili.com/relation/v1/feed/feed_list?page=1&pagesize=10`
        );
        this.genLiveData(response);
        this.noMore = true;
      } else {
        if (refresh) {
          this.resetData();
        }
        let apiVcUrl = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?uid=&type_list=${this.activeTab}`;
        if (!refresh && offset != "") {
          apiVcUrl = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_history?type_list=${this.activeTab}&offset_dynamic_id=${offset}`;
        }
        let response = await axios.get(apiVcUrl);
        this.genVideoData(response);
      }
      let that = this;
      this.sleep(500).then(() => {
        that.loading = false;
      });
    },
  },
};
</script>

<style scoped>
#videoList {
  width: 380px;
}
.header {
  position: fixed;
  height: 42px;
  top: 0;
  width: 100%;
  z-index: 100;
  background: white;
}
.main {
  margin-top: 60px;
}
#col1,
#col2 {
  width: 50%;
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
