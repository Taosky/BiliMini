<template>
  <div class="main">
    <el-row v-loading.fullscreen.lock="loading" :element-loading-background="el_loading_bg">
      <div>
        <div id="col">
          <div v-for="pieceObj in videolist" :key="pieceObj.index">
            <piece-ele :video="pieceObj"></piece-ele>
          </div>
        </div>
      </div>
      <a><button class="moreBtn" @click="seeMore">查看全部</button>
      </a>
    </el-row>
  </div>
</template>
<script>
import { getHistoryData } from '@/utils/api'
import PieceEle from "@/components/Elements/PieceEle.vue";
import { getTimeText, sleep } from "@/utils/tools";

export default {
  name: "HistoryList",
  components: {
    PieceEle,
  },
  async mounted() {
    this.update();
  },
  props: ["activeTab"],
  data: function () {
    return {
      videolist: [],
      loading: false,
    };
  },
  computed: {
    el_loading_bg() {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "rgba(0, 0, 0, 0.3)"
        : "hsla(0,0%,100%,.9)";
    },
  },
  methods: {
    seeMore: function () {
      chrome.tabs.create({ url: "https://www.bilibili.com/account/history" });
    },
    genVideoData: function (responseData) {
      if (!responseData.data?.list) {
        return;
      }
      for (let history of responseData.data.list) {
        this.videolist.push({
          index: history.kid,
          cover: history.cover,
          link:
            history.uri === ""
              ? `https://www.bilibili.com/video/${history.history.bvid}/`
              : history.uri,
          date: getTimeText(history.view_at),
          title: history.title,
          name: history.author_name,
        });
      }
    },
    update: async function () {
      this.loading = true;
      let responseData = await getHistoryData();
      this.genVideoData(responseData);
      sleep(400).then(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style scoped>
.main {
  margin-top: 60px;
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