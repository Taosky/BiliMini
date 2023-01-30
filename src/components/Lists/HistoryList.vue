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
    getTimeText: function (timestamp) {
      function zeroize(num) {
        return (String(num).length == 1 ? "0" : "") + num;
      }
      let curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
      let timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

      let curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
      let tmDate = new Date(timestamp * 1000); // 参数时间戳转换成的日期对象

      let Y = tmDate.getFullYear(),
        m = tmDate.getMonth() + 1,
        d = tmDate.getDate();
      let H = tmDate.getHours(),
        i = tmDate.getMinutes();

      if (timestampDiff < 60) {
        // 一分钟以内
        return "刚刚";
      } else if (timestampDiff < 3600) {
        // 一小时前之内
        return Math.floor(timestampDiff / 60) + "分钟前";
      } else if (
        curDate.getFullYear() == Y &&
        curDate.getMonth() + 1 == m &&
        curDate.getDate() == d
      ) {
        return "今天" + zeroize(H) + ":" + zeroize(i);
      } else {
        let newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
        if (
          newDate.getFullYear() == Y &&
          newDate.getMonth() + 1 == m &&
          newDate.getDate() == d
        ) {
          return "昨天" + zeroize(H) + ":" + zeroize(i);
        } else if (curDate.getFullYear() == Y) {
          return (
            zeroize(m) +
            "月" +
            zeroize(d) +
            "日 " +
            zeroize(H) +
            ":" +
            zeroize(i)
          );
        } else {
          return (
            Y +
            "年" +
            zeroize(m) +
            "月" +
            zeroize(d) +
            "日 " +
            zeroize(H) +
            ":" +
            zeroize(i)
          );
        }
      }
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    genVideoData: function (response) {
      for (let history of response.data.data.list) {
        this.videolist.push({
          index: history.kid,
          cover: history.cover,
          link: `https://www.bilibili.com/video/${history.history.bvid}/`,
          date: this.getTimeText(history.view_at),
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
      this.sleep(400).then(() => {
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