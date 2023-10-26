<template>
  <div class="main">
    <el-row v-loading.fullscreen.lock="loading" :element-loading-background="el_loading_bg">
      <div class="col-box">
        <!-- 两列显示 -->
        <div id="col1">
          <div v-for="cardObj in data[activeTab]?.videolist1" :key="cardObj.index">
            <card-ele :cardObj="cardObj"
              :extraAuthors="cardObj.type_ === 'video' ? data[activeTab].dynamicExtraAuthor[cardObj.dynamicId] : undefined"></card-ele>
          </div>
        </div>
        <div id="col2">
          <div v-for="cardObj in data[activeTab]?.videolist2" :key="cardObj.index">
            <card-ele :cardObj="cardObj"
              :extraAuthors="cardObj.type_ === 'video' ? data[activeTab].dynamicExtraAuthor[cardObj.dynamicId] : undefined"></card-ele>
          </div>
        </div>
      </div>
      <!-- nomore提示 -->
      <p style="text-align: center; font-size: 14px" v-show="data[activeTab]?.noMore">
        (´・ω・｀) 没有更多了
      </p>
      <!-- 更多按钮 -->
      <a v-show="data[activeTab]?.noMore" @click="seeMore"><button class="moreBtn">
          {{ data[activeTab]?.moreText }}
        </button>
      </a>
    </el-row>
  </div>
</template>
<script>
import CardEle from "@/components/Elements/CardEle.vue";
import { getToWatchData, getDynamicData, getLiveData } from "@/utils/api"
import {
  forbid_scroll,
  allow_scroll,
  resetScroller,
  sleep,
} from "@/utils/tools";

export default {
  name: "DynamicList",
  components: {
    CardEle,
  },
  async mounted() {
    this.listenScoller();
    await this.getToWatchs();
    // 第一页(投稿)启动不会监听到值变化, 手动加载一次
    if (!localStorage["activeTab"] || localStorage["activeTab"] === "1") {
      this.updateCards();
    }

  },
  watch: {
    activeTab: {
      handler(newVal) {
        console.log("activetab变化: ", newVal);
        if (this.isLive() || this.isBangumi() || this.isVideo()) {
          resetScroller();
          this.updateCards();
        }
      },
    },
  },
  props: ["activeTab"],
  data: function () {
    return {
      loading: false,
      toWatchAids: [],
      // 各标签页数据
      data: {
        1: {
          videolist1: [],
          videolist2: [],
          foldInfo: {},
          dynamicExtraAuthor: {},
          noMore: false,
          loaded: false,
          page: 1,
          moreLink: 'https://t.bilibili.com/',
          moreText: '更多投稿动态'
        },
        2: {
          videolist1: [],
          videolist2: [],
          noMore: false,
          loaded: false,
          page: 1,
          moreLink: 'https://t.bilibili.com/?tab=pgc',
          moreText: '更多番剧动态'
        },
        3: {
          videolist1: [],
          videolist2: [],
          noMore: false,
          loaded: false,
          page: 1,
          moreLink: 'https://live.bilibili.com/',
          moreText: '全部直播'
        },
      },
    };
  },
  computed: {
    //此处Dyncmic包含番剧
    lastDynamicId() {
      if (!this.isBangumi() && !this.isVideo()) {
        return;
      }
      return this.data[this.activeTab].videolist1.length === this.data[this.activeTab].videolist2.length
        ? this.data[this.activeTab].videolist2[this.data[this.activeTab].videolist2.length - 1].dynamicId
        : this.data[this.activeTab].videolist1[this.data[this.activeTab].videolist1.length - 1].dynamicId;
    },
    el_loading_bg() {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "rgba(0, 0, 0, 0.3)"
        : "hsla(0,0%,100%,.9)";
    },
  },
  methods: {
    seeMore: function () {
      chrome.tabs.create({ url: this.data[this.activeTab].moreLink });
    },
    isLive: function () {
      return this.activeTab === "3" ? true : false;
    },
    isBangumi: function () {
      return this.activeTab === "2" ? true : false;
    },
    isVideo: function () {
      return this.activeTab === "1" ? true : false;
    },
    // 监听滚动条
    listenScoller: function () {
      window.addEventListener("scroll", () => {
        let scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        let windowHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        let scrollHeight =
          document.documentElement.scrollHeight || document.body.scrollHeight;
        if (scrollTop + windowHeight + 100 >= scrollHeight) {
          if (this.isLive() || this.isBangumi() || this.isVideo()) {
            this.infLoad();
          }
        }
      });
    },
    // 无限加载
    infLoad: function () {
      if (this.loading || this.data[this.activeTab].noMore) {

        return;
      }
      if (this.isLive()) {
        console.log("直播/番剧页面滚动加载");
        this.data[this.activeTab].page += 1;
      }
      this.updateCards(true);
    },
    get_bvid: function (short_link) {
      return short_link.match(/\/(BV\w+)$/)[1];
    },
    getToWatchs: async function () {
      const responseData = await getToWatchData();
      if (responseData && responseData.list) {
        responseData.data.list.forEach((one) => {
          this.toWatchAids.push(one.aid);
        });
      }
    },
    genLiveData: function (responseData) {
      const list_ = responseData.data.list;
      if (list_.length < 10) {
        this.data[this.activeTab].noMore = true;
      }
      for (let i = 0; i < list_.length; i++) {
        let item = list_[i];
        let cardObj = {
          "type_": "live",
          "index": i,
          "media_link": item.link,
          "media_title": item.title,
          "media_cover": item.pic,
          "show_text": item.watched_show.text_large,
          "up_link": `https://space.bilibili.com/${item.uid}/`,
          "up_title": item.uname,
          "up_cover": item.face,
          // "roomid": item.roomid,
          // "uid":item.uid,
        };
        if (i % 2 === 0) {
          this.data[this.activeTab].videolist1.push(cardObj);
        } else {
          this.data[this.activeTab].videolist2.push(cardObj);
        }
      }

    },
    genDynamicData: function (responseData) {
      // 防止报错
      if (!responseData.data) {
        return;
      }
      // 判断没有更多
      if (!responseData.data.items) {
        this.data[this.activeTab].noMore = true;
        return;
      }
      const has_more = responseData.data.has_more;
      if (!has_more || responseData.data.items.length < 10) {
        this.data[this.activeTab].noMore = true;
      }

      // 截取偶数个动态
      const items = responseData.data.items.slice(0, 10);
      let trueIndex = 0;
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let cardObj = { "dynamicId": item.id_str, type_: "unknown" };
        if (item.type === "DYNAMIC_TYPE_AV") {
          cardObj.type_ = "video";
        } else if (item.type === "DYNAMIC_TYPE_PGC_UNION") {
          cardObj.type_ = "pgc";
        }
        let dynamicInfo = null;
        if (cardObj.type_ === "video") {
          dynamicInfo = item.modules.module_dynamic.major.archive;
          cardObj.index = cardObj.aid = dynamicInfo.aid;
          // cardObj.media_duration = dynamicInfo.duration_text;
          // cardObj.bvid = dynamicInfo.bvid;

        } else if (cardObj.type_ === "pgc") {
          dynamicInfo = item.modules.module_dynamic.major.pgc;
          cardObj.index = cardObj.aid = dynamicInfo.epid;
        } else {
          return;
        }
        cardObj.media_link = dynamicInfo.jump_url;
        cardObj.media_title = dynamicInfo.title;
        cardObj.media_cover = dynamicInfo.cover;

        const authorInfo = item.modules.module_author;
        cardObj.up_link = authorInfo.jump_url;
        cardObj.up_title = authorInfo.name;
        cardObj.up_cover = authorInfo.face;
        cardObj.show_text = authorInfo.pub_time;

        // 折叠投稿相关处理
        if (cardObj.type_ === "video") {
          // 跳过折叠的联合投稿
          if (this.data[this.activeTab].foldInfo[cardObj.dynamicId]?.originId) {
            // 添加折叠的up信息到原动态
            let originDynamicId = this.data[this.activeTab].foldInfo[cardObj.dynamicId].originId;
            // 存储动态对应UP主信息
            if (!this.data[this.activeTab].dynamicExtraAuthor[originDynamicId]) {
              this.data[this.activeTab].dynamicExtraAuthor[originDynamicId] = []
            }
            this.data[this.activeTab].dynamicExtraAuthor[originDynamicId].push({ "up_link": cardObj.up_link, "up_title": cardObj.up_title, "up_cover": cardObj.up_cover })
            // 不添加本动态
            continue;
          }

          // 联合投稿(折叠动态ID处理存储)
          if (item.modules.module_fold && item.modules.module_fold.ids) {
            let fold_ids = item.modules.module_fold.ids;
            for (let j = 0; j < fold_ids.length; j++) {
              this.data[this.activeTab].foldInfo[fold_ids[j]] = { "originId": cardObj.dynamicId, };
              cardObj.up_cover_extra = [];
            }
          }
        }

        // 稍后再看标记
        if (cardObj.type_ === "video" && this.toWatchAids.indexOf(Number(cardObj.aid)) !== -1) {
          cardObj.toWatch = true;
        }
        if (trueIndex % 2 === 0) {
          this.data[this.activeTab].videolist1.push(cardObj);
        } else {
          this.data[this.activeTab].videolist2.push(cardObj);
        }
        trueIndex += 1;
      }
    },
    updateCards: async function (loadMore = false) {
      if (this.loading) {
        return;
      }
      // 页面已加载后也不再刷新
      if (loadMore === false && this.data[this.activeTab].loaded) {
        return;
      }
      // loading
      this.loading = true;
      forbid_scroll();
      // 直播/视频
      if (this.isLive()) {
        const responseData = await getLiveData(this.data[this.activeTab].page);
        this.genLiveData(responseData);
      } else {
        let type_ = "pgc";
        if (this.isVideo()) {
          type_ = "video";
        }
        const offset = loadMore ? this.lastDynamicId : false;
        // console.log(this.lastDynamicId)
        let responseData = await getDynamicData(type_, false, offset);
        this.genDynamicData(responseData);
      }
      this.data[this.activeTab].loaded = true;
      sleep(500).then(() => {
        this.loading = false;
        allow_scroll();
      });
    },
  },
};
</script>

<style scoped>
.main {
  margin-top: 60px;
}

.col-box {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
}

#col1 {
  margin-right: 5px;
}

#col1,
#col2 {
  width: 48%;
  display: inline-flex;
  flex-flow: column;
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