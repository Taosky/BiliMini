<template>
  <div id="videopanel">
    <transition name="slide-fade">
      <div v-if="logged_in_status === -6" role="alert" class="el-message el-message--error"
        style="top: 1px; z-index: 2002">
        <i class="el-message__icon el-icon-error"></i>
        <p class="el-message__content">
          <span>尚未登录Bilibili，<strong><a href="https://passport.bilibili.com/login"
                @click="openLogin">登录</a></strong>后再试</span>
        </p>
      </div>
    </transition>
    <transition name="slide-fade">
      <div v-if="logged_in_status === 500001" role="alert" class="el-message el-message--warning"
        style="top: 1px; z-index: 2002">
        <i class="el-message__icon el-icon-warning"></i>
        <p class="el-message__content">
          <span>操作太频繁了，稍后重试</span>
        </p>
      </div>
    </transition>

    <el-tabs class="header" v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane name="8">
        <span slot="label">投稿
          <el-badge v-show="badgeShow.normal" is-dot class="label-badge" />
        </span>
      </el-tab-pane>
      <el-tab-pane name="512">
        <span slot="label">番剧
          <el-badge v-show="badgeShow.bangumi" is-dot class="label-badge" />
        </span>
      </el-tab-pane>
      <el-tab-pane name="65536">
        <span slot="label">直播
          <el-badge v-show="badgeShow.live" :value="liveNumStr" class="label-badge" />
        </span>
      </el-tab-pane>
      <el-tab-pane name="1">
        <span slot="label">历史</span>
      </el-tab-pane>
      <!-- <el-tab-pane name="2">
        <span slot="label">收藏</span>
      </el-tab-pane> -->
    </el-tabs>
    <dynamic-list v-show="activeTab === '8' || activeTab === '512' || activeTab === '65536'" :activeTab="activeTab" />
    <history-list v-show="activeTab === '1'"></history-list>
  </div>
</template>

<script>
import DynamicList from "@/components/Lists/DynamicList.vue";
import HistoryList from "@/components/Lists/HistoryList.vue";

import axios from "axios";
import key from "keymaster";
import { sleep } from "@/utils";

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
    sleep(1500).then(() => {
      chrome.runtime.sendMessage(
        { getLoginStatus: true },
        (logged_in_status) => {
          console.log("logged_in_status", logged_in_status);
          that.logged_in_status = logged_in_status;
          if (logged_in_status === 0) {
            // 获取直播数量
            that.checkLive();
          } else {
            return;
          }
        }
      );
    });

    // 获取更新数量
    chrome.runtime.sendMessage({ getNums: true }, (nums) => {
      that.badgeShow.normal = nums.normal > 0 ? true : false;
      that.badgeShow.bangumi = nums.bangumi > 0 ? true : false;
    });
  },
  data: function () {
    return {
      activeTab: "8",
      logged_in_status: 0,
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

    openLogin: function () {
      chrome.tabs.create({ url: `https://passport.bilibili.com/login` });
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

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to

/* .slide-fade-leave-active for below version 2.1.8 */
  {
  transform: translateX(10px);
  opacity: 0;
}
</style>
