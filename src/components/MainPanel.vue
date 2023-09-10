<template>
  <div id="videopanel">
    <!-- 各类提示 -->
    <transition name="slide-fade">
      <div v-if="loggedInStatus === -101" role="alert" class="el-message el-message--error"
        style="top: 1px; z-index: 2002">
        <i class="el-message__icon el-icon-error"></i>
        <p class="el-message__content">
          <span>尚未登录Bilibili，<strong><a href="#" @click="openLogin">登录</a></strong>后再试</span>
        </p>
      </div>
    </transition>
    <transition name="slide-fade">
      <div v-if="!permissionGranted" role="alert" class="el-message el-message--error" style="top: 1px; z-index: 2002">
        <i class="el-message__icon el-icon-error"></i>
        <p class="el-message__content">
          <span>缺少API权限，在<strong style="color:darkcyan">浏览器扩展设置页面</strong>授权后再试</span>
        </p>
      </div>
    </transition>
    <transition name="slide-fade">
      <div v-if="loggedInStatus != -101 && loggedInStatus != 0" role="alert" class="el-message el-message--warning"
        style="top: 1px; z-index: 2002">
        <i class="el-message__icon el-icon-warning"></i>
        <p class="el-message__content">
          <span>未知错误，稍后重试</span>
        </p>
      </div>
    </transition>
    <!-- Tab标签 -->
    <el-tabs class="header" v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane name="1">
        <span slot="label">投稿
          <el-badge v-show="badgeShow.normal" is-dot class="label-badge" />
        </span>
      </el-tab-pane>
      <el-tab-pane name="2">
        <span slot="label">番剧
          <el-badge v-show="badgeShow.bangumi" is-dot class="label-badge" />
        </span>
      </el-tab-pane>
      <el-tab-pane name="3">
        <span slot="label">直播
          <el-badge v-show="badgeShow.live" :value="liveNumStr" class="label-badge" />
        </span>
      </el-tab-pane>
      <el-tab-pane name="4">
        <span slot="label">历史</span>
      </el-tab-pane>
    </el-tabs>
    <!-- 动态 (投稿、番剧、直播) -->
    <dynamic-list v-show="activeTab === '1' || activeTab === '2' || activeTab === '3'" :activeTab="activeTab" />
    <!-- 历史记录 -->
    <history-list v-show="activeTab === '4'"></history-list>
  </div>
</template>

<script>
import DynamicList from "@/components/Lists/DynamicList.vue";
import HistoryList from "@/components/Lists/HistoryList.vue";

import key from "keymaster";
import { sleep } from "@/utils/tools";
import { getLiveData } from "@/utils/api";

export default {
  name: "MainPanel",
  components: { DynamicList, HistoryList },
  data: function () {
    return {
      activeTab: "1",
      loggedInStatus: 0,
      permissionGranted: true,
      badgeShow: {
        normal: false,
        bangumi: false,
        live: false,
      },
      liveNumStr: "",
    };
  },
  async mounted() {
    //监听按键以切换tab
    for (let i = 0; i < 5; i++) {
      key(String(i), () => {
        this.activeTab = localStorage["activeTab"] = String(i);
        return false;
      });
    }
    //初始化Tab
    if (localStorage["activeTab"]) {
      this.activeTab = localStorage["activeTab"]
    }
    //检查Host权限
    const testResult = await chrome.permissions.contains({
      origins: [
        "*://*.bilibili.com/*"
      ],
    });
    console.log("Host权限: " + testResult)
    this.permissionGranted = testResult;
    if (!testResult) {
      return;
    }
    //判断登录状态
    sleep(1200).then(() => {
      chrome.runtime.sendMessage(
        { getLoginStatus: true }
      ).then(
        (loggedInStatus) => {
          console.log("登录状态: ", loggedInStatus);
          this.loggedInStatus = loggedInStatus;
          if (loggedInStatus === 0) {
            //获取直播数量
            this.setLiveBadge();
          } else {
            return;
          }
        }
      );
    });
    //获取更新数量
    chrome.runtime.sendMessage({ getNums: true })
      .then((nums) => {
        this.badgeShow.video = nums.video > 0 ? true : false;
        this.badgeShow.bangumi = nums.bangumi > 0 ? true : false;
      });
  },
  methods: {
    //tab点击
    handleClick: function () {
      localStorage["activeTab"] = this.activeTab;
    },
    //打开登录页
    openLogin: function () {
      chrome.tabs.create({ url: `https://passport.bilibili.com/login` });
    },
    setLiveBadge: async function () {
      const responseData = await getLiveData(1, 11);
      if (!responseData) {
        return;
      }
      // 设置直播数量角标
      if (responseData.data.list.length > 0) {
        this.badgeShow.live = true;
        if (responseData.data.list.length > 10) {
          this.liveNumStr = "10+";
        } else {
          this.liveNumStr = String(responseData.data.list.length);
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
