<template>
  <div class="main">
    <el-row
      v-loading.fullscreen.lock="loading"
      :element-loading-background="el_loading_bg"
    >
      <div>
        <div id="col">
          <div v-for="pieceObj in videolist" :key="pieceObj.index">
            <piece-ele :video="pieceObj"></piece-ele>
          </div>
        </div>
      </div>
      <a href="https://www.bilibili.com/account/history"
        ><button class="moreBtn" onclick="seeMore">查看全部</button>
      </a>
    </el-row>
  </div>
</template>
<script>
import axios from "axios";
import PieceEle from "@/components/Elements/PieceEle.vue";
import { getTimeText, sleep } from "../../utils";

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
    genVideoData: function (response) {
      for (let history of response.data.data.list) {
        this.videolist.push({
          index: history.kid,
          cover: history.cover,
          link: history.uri==='' ? `https://www.bilibili.com/video/${history.history.bvid}/` : history.uri,
          date: getTimeText(history.view_at),
          title: history.title,
          name: history.author_name,
        });
      }
    },
    update: async function () {
      this.loading = true;
      let response = await axios.get(
        `https://api.bilibili.com/x/web-interface/history/cursor?type=archive&ps=20`
      );
      this.genVideoData(response);
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