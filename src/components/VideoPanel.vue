<template>
  <div id="videopanel">
    <el-tabs class="header" v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane name="8">
        <span slot="label"
          >投稿
          <el-badge v-show="badgeShow.normal" is-dot class="label-badge" />
        </span>
      </el-tab-pane>
      <el-tab-pane name="512">
        <span slot="label"
          >番剧
          <el-badge v-show="badgeShow.bangumi" is-dot class="label-badge" />
        </span>
      </el-tab-pane>
      <el-tab-pane name="65536">
        <span slot="label"
          >直播
          <el-badge
            v-show="badgeShow.live"
            :value="liveNumStr"
            class="label-badge"
          />
        </span>
      </el-tab-pane>
      <el-tab-pane name="1">
        <span slot="label">历史</span>
      </el-tab-pane>
      <!-- <el-tab-pane name="2">
        <span slot="label">收藏</span>
      </el-tab-pane> -->
    </el-tabs>
    <dynamic-list
      v-show="activeTab === '8' || activeTab === '512' || activeTab === '65536'"
      :activeTab="activeTab"
    />
    <history-list v-show="activeTab === '1'"></history-list>
  </div>
</template>

<script>
import DynamicList from "@/components/Lists/DynamicList.vue";
import HistoryList from "@/components/Lists/HistoryList.vue";

import axios from "axios";
import key from "keymaster";
export default {
  name: "VideoPanel",
  components: { DynamicList, HistoryList },
  async mounted() {
    // 监听按键以切换tab
    let that = this;
    key("1", function () {
      that.activeTab = localStorage["activeTab"] = "8";
      return false;
    });
    key("2", function () {
      that.activeTab = localStorage["activeTab"] = "512";
      return false;
    });
    key("3", function () {
      that.activeTab = localStorage["activeTab"] = "65536";
      return false;
    });
    key("4", function () {
      that.activeTab = localStorage["activeTab"] = "1";
      return false;
    });
    // key("5", function () {
    //   that.activeTab = localStorage["activeTab"] = "2";
    //   return false;
    // });
    // 初始化当前tab
    this.activeTab = localStorage["activeTab"]
      ? localStorage["activeTab"]
      : "8";
    // 判断登录状态
    chrome.runtime.sendMessage({ getLoginStatus: true }, (is_logged_in) => {
      console.log("is_logged_in", is_logged_in);
      if (!is_logged_in) {
        this.$message.error({
          message: "尚未登录，登录后再试",
          duration: 0,
          offset: 1,
        });
        return;
      }
    });
    // 获取更新数量
    this.checkLive();
    chrome.runtime.sendMessage({ getNums: true }, (nums) => {
      that.badgeShow.normal = nums.normal > 0 ? true : false;
      that.badgeShow.bangumi = nums.bangumi > 0 ? true : false;
    });
  },
  data: function () {
    return {
      activeTab: "8",
      badgeShow: {
        normal: false,
        bangumi: false,
        live: false,
      },
      liveNumStr: "",
      livePage: 1,
    };
  },
  methods: {
    // tab点击
    handleClick: function () {
      localStorage["activeTab"] = this.activeTab;
    },

    isLoggedIn: async function () {
      let response = await axios.get(
        `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?uid=&type_list=8,512,4099`
      );
      if (response.data.code != 0) {
        return false;
      }
      return true;
    },

    checkLive: async function () {
      let response = await axios.get(
        `https://api.live.bilibili.com/relation/v1/feed/feed_list?page=1&pagesize=11`
      );
      if (response.data.data.list.length > 0) {
        this.badgeShow.live = true;
        if (response.data.data.list.length > 10) {
          this.liveNumStr = "10+";
        } else {
          this.liveNumStr = String(response.data.data.list.length);
        }
      }
    },
    resetBadge: function () {
      this.badgeShow.normal = false;
      this.badgeShow.bangumi = false;
    },
  },
};
</script>

<style scoped>
@media (prefers-color-scheme: dark) {
  .header {
    background: #181818 !important;
  }
}

#videopanel {
  width: 380px;
}
.header {
  position: fixed;
  height: 42px;
  top: 0;
  width: 380px;
  z-index: 100;
  background: white;
}
</style>
