<template>
  <div class="main">
    <el-row
      v-loading.fullscreen.lock="loading"
      :element-loading-background="el_loading_bg"
    >
      <div>
        <div id="col1">
          <div
            v-for="cardObj in data[activeTab].videolist1"
            :key="cardObj.index"
          >
            <card-ele :cardObj="cardObj"></card-ele>
          </div>
        </div>
        <div id="col2">
          <div
            v-for="cardObj in data[activeTab].videolist2"
            :key="cardObj.index"
          >
            <card-ele :cardObj="cardObj"></card-ele>
          </div>
        </div>
      </div>
      <p
        style="text-align: center; font-size: 14px"
        v-show="data[activeTab].noMore"
      >
        (´・ω・｀) 没有更多了
      </p>
      <a v-show="data[activeTab].noMore" :href="more['link']"  @click="seeMore"
        ><button class="moreBtn">
          {{ more["text"] }}
        </button>
      </a>
    </el-row>
  </div>
</template>
<script>
import axios from "axios";
import CardEle from "@/components/Elements/CardEle.vue";
export default {
  name: "DynamicList",
  components: {
    CardEle,
  },
  async mounted() {
    this.listenScoller();
    // 默认为第一个tab时,加载视频动态,否则在监听到变化时调用
    if (localStorage["activeTab"] === "8" || !localStorage["activeTab"]) {
      this.updateCards();
    }
  },
  watch: {
    activeTab: {
      handler(newVal) {
        console.log("activetab变化: ", newVal);
        if (this.isDynamic()) {
          this.resetScroller();
          this.updateCards();
        }
      },
    },
  },
  props: ["activeTab"],
  data: function () {
    return {
      loading: false,
      // 各标签页数据
      data: {
        8: {
          videolist1: [],
          videolist2: [],
          noMore: false,
        },
        512: {
          videolist1: [],
          videolist2: [],
          noMore: false,
        },
        65536: {
          videolist1: [],
          videolist2: [],
          noMore: false,
          loaded: false,
          livePage: 1,
        },
        // 防止报错
        1: {
          videolist1: [],
          videolist2: [],
          noMore: false,
        },
        2: {
          videolist1: [],
          videolist2: [],
          noMore: false,
        },
      },
    };
  },
  computed: {
    more() {
      return this.activeTab === "65536"
        ? { link: "https://live.bilibili.com/", text: "全部直播" }
        : { link: "https://t.bilibili.com/", text: "查看动态页" };
    },
    lastDynamicId() {
      if (this.isLive() || !this.isDynamic()) {
        return;
      }
      return this.data[this.activeTab].videolist2[
        this.data[this.activeTab].videolist2.length - 1
      ].dynamicId
        ? this.data[this.activeTab].videolist2[
            this.data[this.activeTab].videolist2.length - 1
          ].dynamicId
        : "";
    },
    el_loading_bg() {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "rgba(0, 0, 0, 0.3)"
        : "hsla(0,0%,100%,.9)";
    },
  },
  methods: {
    // link for chromium
    seeMore: function() {
      chrome.tabs.create({ url: this.more['link'] });
    },
    isDynamic: function () {
      return ["8", "512", "65536"].indexOf(this.activeTab) < 0 ? false : true;
    },
    isLive: function () {
      return this.activeTab === "65536" ? true : false;
    },
    resetScroller: function () {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    },
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
          if (!that.isDynamic()) {
            return;
          }
          that.infLoad();
        }
      });
    },
    // 无限加载
    infLoad: function () {
      if (this.loading || this.data[this.activeTab].noMore) {
        return;
      }
      if (this.isLive()) {
        console.log("直播页面滚动加载");
        this.data[this.activeTab].livePage += 1;
      }
      this.updateCards(this.lastDynamicId, true);
    },
    get_bvid: function (short_link) {
      return short_link.match(/\/(BV\w+)$/)[1];
    },
    getRetime: function (createtime) {
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
    genLiveData: function (response) {
      let cardIndex = 0;
      let that = this;
      that.data[that.activeTab].loaded = true;
      if (response.data.data.list.length < 10) {
        that.data[that.activeTab].noMore = true;
      }
      response.data.data.list.forEach(function (card) {
        cardIndex += 1;
        let cardObj = card;
        cardObj.index = cardObj.link;
        cardObj._type = 65535;
        if (cardIndex % 2 === 1) {
          that.data[that.activeTab].videolist1.push(cardObj);
        } else {
          that.data[that.activeTab].videolist2.push(cardObj);
        }
      });
    },
    genVideoData: function (response) {
      let cardIndex = 0;
      let that = this;
      if (response.data.data.cards.length < 20) {
        that.data[that.activeTab].noMore = true;
      }
      response.data.data.cards.forEach(function (card) {
        cardIndex += 1;
        let cardObj = JSON.parse(card.card);
        cardObj.index = cardObj.aid;
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
          that.data[that.activeTab].videolist1.push(cardObj);
        } else {
          that.data[that.activeTab].videolist2.push(cardObj);
        }
      });
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    updateCards: async function (offset = "", loadMore = false) {
      if (this.loading) {
        return;
      }
      if (loadMore === false) {
        // 内容不为空时不再刷新
        if (this.data[this.activeTab].videolist1.length > 0) {
          return;
        }
        // 直播即使没有内容已加载后也不再刷新
        if (this.isLive() && this.data[this.activeTab].loaded) {
          return;
        }
      }
      // loading
      this.loading = true;
      // 直播/视频
      if (this.isLive()) {
        let response = await axios.get(
          `https://api.live.bilibili.com/relation/v1/feed/feed_list?page=${this.data["65536"].livePage}&pagesize=10`
        );
        this.genLiveData(response);
      } else {
        let apiVcUrl = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?uid=&type_list=${this.activeTab}`;
        if (offset != "") {
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
.main {
  margin-top: 60px;
}
#col1,
#col2 {
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
  cursor: pointer;
  border: none;
  border-radius: 4px;
}
</style>