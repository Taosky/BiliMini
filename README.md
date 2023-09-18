## BiliMini

![logo](preview/logo.png)

Bilibili辅助扩展，用于提示并快速查看更新。

### 安装

**从浏览器扩展商店下载**

[![Firefox](https://img.shields.io/amo/v/bilimini.svg?label=Mozilla%20Firefox)](https://addons.mozilla.org/zh-CN/firefox/addon/bilimini/)

[![Chrome](https://img.shields.io/chrome-web-store/v/fcibfbohheekhmgachjjghbhligddmcl)](https://chrome.google.com/webstore/detail/bilimini/fcibfbohheekhmgachjjghbhligddmcl?hl=zh-CN&authuser=0)

[![Edge](https://img.shields.io/badge/dynamic/json?label=Edge%20Addons&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2FAddons%2Fgetproductdetailsbycrxid%2Fbpfhljkccknkkngaoklgcabllbpdfaie)](https://microsoftedge.microsoft.com/addons/detail/bilimini/bpfhljkccknkkngaoklgcabllbpdfaie)

### 功能

- 角标数字提醒
- Popup展开查看
- 支持普通投稿、番剧、直播、历史记录
- 支持添加和取消稍后再看
- 支持Tab切换、滚动加载
- Tab更新提示
- 快捷键操作（Alt+B / Option+B弹出, 1,2,3,4切换标签）

### 预览

**截图版本较古早,以实际安装为准**

![small](preview/small.png)
![medium-1](preview/medium-1.png)
![medium-2](preview/medium-2.png)
![medium-3](preview/medium-3.png)

### 自行构建

**Nodejs 18.16.1以上**

安装依赖:

    npm install

调试:

    npm run build-watch

构建:

    npm run build

可使用环境变量切换至firefox版本的的 `manifest.json`:

    export NODE_PLATFORM=firefox

### 更新

**2023-09-18: 版本2.3.7**

- 修复稍后再看导致的投稿页空白问题

**2023-09-17: 版本2.3.6**

- 代码优化
- 尝试修复一些问题
- 联合投稿显示

**2023-09-02: 版本2.3.0**

- 修复番剧页失效问题 [#9](https://github.com/Taosky/BiliMini/issues/9)
- 新增稍后再看按钮 [#8](https://github.com/Taosky/BiliMini/issues/8)
- 合并Firefox和Chrome代码 (Manifest V3)
- 一些其他优化

**2023-04-21: 版本2.2.5**

- 修复动态链接失效问题
- 修复番剧列表为空时卡死的问题 [#7](https://github.com/Taosky/BiliMini/issues/7)
- 修复Firefox重复打开登录页面的问题

**2023-04-15: 版本2.2.3**

- 优化使用体验

**2023-04-05: 版本2.2.1**

- 修复历史记录中番剧链接不正确问题

**2023-01-30: 版本2.2.0**

- 修复了一些问题
- 页面逻辑优化（减少重复请求）
- 新增历史记录查看
- 新增按键切换标签（数字1, 2, 3, 4）

**2022-12-24: 版本2.1.3**

- 增加快捷键快速显示窗口 Alt+B / Option+B

**2022-08-27: 版本2.1.2**

- 修复直播页滚动等问题

**2022-08-12: 版本2.1.1**

- 优化样式
- 修复直播卡片链接
- 修复Chromium下的一些问题

**2022-07-31: 版本2.1.0**

- 自适应浏览器暗黑模式
- 增加tab的badge显示，方便查看更新
- 修复Chromium下的异步存储问题

**2022-07-19: 版本2.0.0**

- 因Mozilla Addon审核问题更换vue-cli 模板[vue-cli-plugin-chrome-extension-cli](https://github.com/sanyu1225/vue-cli-plugin-chrome-extension-cli)
- Popup页面新增Tab，分别显示投稿、番剧、直播信息
- 支持滚动加载历史动态
- 优化UI显示

**2022-07-11: 版本1.8.6**

- 修复build结果不一致问题（无法上架问题）

**2022-07-11: 版本1.8.4**

- 代码优化
- 修复番剧显示

**2022-07-10: 版本1.8.3**

- 重新上架被下架版本（使用[vue-web-extension](https://github.com/Kocal/vue-web-extension)构建）
- `<del>`下个版本将新增功能 `</del>`

**2021-05-01: 版本1.8.1**

- 优化卡片样式

**2021-04-03: 版本1.8.1**

- 修复角标数字不消除的Bug

**2021-04-03: 版本1.8**

- 优化样式
- 增加更新时间显示

**2021.03.27: 版本1.7**

- 修复弹出窗口空白的问题，页面更新（参考脚本Bilibili Evolved）

**2019.12.21：版本1.6**

- CSS优化样式，隐藏滚动条等
