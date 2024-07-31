/* eslint-disable */
let bangumiNum = 0;
let videoNum = 0
let loggedInStatus = 0;
let lastHeartbeat = Date.now();


//检查新投稿及登录状态
async function checkNew(resetBadge = false) {
  const response = await fetch(`https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?typ=all`);
  const data = await response.json();
  //登录状态
  loggedInStatus = data['code'];
  if (data['code'] === -101) {
    chrome.action.setBadgeText({ text: 'X' });
    return;
  }
  if (data['code'] != 0) {
    chrome.action.setBadgeText({ text: '!' });
    return;
  }

  //动态数量
  let updateNum = 0;
  let currentBaseline = undefined;
  chrome.storage.local.get(['updateBaseline'], function (result) {
    currentBaseline = result.updateBaseline;
    //重置角标或首次打开时更新存储
    if (resetBadge || !currentBaseline) {
      chrome.storage.local.set({ "updateBaseline": data.data.items[0].id_str }, function () {
        console.log('updateBaseline更新: ');
        console.log(currentBaseline)
        console.log(data.data.items[0].id_str)
        chrome.action.setBadgeText({ text: '' });
      });
    }
    else {
      const items = data.data.items;
      //对比updateBaseline, 计算更新数量
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (currentBaseline !== item.id_str) {
          console.log(item.type)
          if (item.type === 'DYNAMIC_TYPE_AV') {
            updateNum += 1
            videoNum += 1;
          }
          if (item.type === 'DYNAMIC_TYPE_PGC_UNION') {
            updateNum += 1
            bangumiNum += 1
          }
        } else {
          break;
        }
      }
      //更新角标
      if (updateNum >= 10) {
        chrome.action.setBadgeText({ text: "10+" });
      } else if (updateNum < 10 && updateNum > 0)
        chrome.action.setBadgeText({ text: String(updateNum) });
      else {
        chrome.action.setBadgeText({ text: '' });
      }
    }
  });
}


//用于popup中获取数量
function getNums() {
  return new Promise(resolve => {
    let nums = { bangumi: bangumiNum, video: videoNum };
    videoNum = 0;
    bangumiNum = 0;
    resolve(nums);
  });
}

//用于popup中获取登录状态
function getLoginStatus() {
  return new Promise(resolve => {
    resolve(loggedInStatus);
  });
}

// 启用稍后再看请求拦截规则
function addRule() {
  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: 'modifyHeaders',
          requestHeaders: [
            { header: 'origin', operation: 'set', value: 'https://www.bilibili.com' }
          ]
        },
        condition: {
          urlFilter: 'https://api.bilibili.com/x/v2/history/toview*',
          resourceTypes: ['xmlhttprequest']
        }
      }
    ],
    removeRuleIds: []
  }, () => console.log('启用请求拦截'));
}

//监听popup消息
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  //返回更新数量
  if (message.getNums) {
    getNums().then(sendResponse);
    return true;
  }
  //返回登陆状态
  if (message.getLoginStatus) {
    getLoginStatus().then(sendResponse);
    return true;
  }
  //打开弹窗时更新并重置角标
  if (message.popupOpen) {
    checkNew(resetBadge = true);
    lastHeartbeat = Date.now();
    addRule();
  }
  if (message.action === 'heartbeat') {
    lastHeartbeat = Date.now();
    sendResponse({ status: 'received' });
  }
});


// 定时器
chrome.alarms.create({ periodInMinutes: 0.8 });
chrome.alarms.onAlarm.addListener(() => {
  checkNew();
});

//立即检查更新
checkNew();

//监听心跳
setInterval(() => {
  const currentTime = Date.now();
  if (currentTime - lastHeartbeat > 6000) {
    // 超过6秒没有收到心跳消息，认为popup页面关闭
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1]
    }, () => console.log('停用请求拦截'));
  }
}, 5000); // 每3秒检查一次