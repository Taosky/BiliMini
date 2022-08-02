/* eslint-disable */
let bangumi_num = 0;
let normal_num = 0
function checkNew(update = false) {
  fetch(`https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?uid=&type_list=8,512,4099`)
    .then(response => response.json())
    .then(data => {
      // 未登录
      if (data['code'] === -6) {
        chrome.action.setBadgeText({ text: 'X' });
        return
      }
      let newInfo = data;

      //更新数
      let update_num = 0;

      let current_dynamic_id = undefined;
      chrome.storage.sync.get(['latest_dynamic_id'], function (result) {
        current_dynamic_id = result.latest_dynamic_id;
        if (!current_dynamic_id || update === true) {
          chrome.storage.sync.set({ "latest_dynamic_id": newInfo.data.cards[0].desc.dynamic_id }, function () {
            console.log('latest_dynamic_id 重置');
            console.log(current_dynamic_id);
            chrome.action.setBadgeText({ text: '' });
          });
        }
        else {
          newInfo.data.cards.forEach(function (card) {
            if (card.desc.dynamic_id > current_dynamic_id) {
              update_num += 1
              // 不同类型更新数
              if (card.desc.type === 8) {
                normal_num += 1
              } else if (card.desc.type === 512) {
                bangumi_num += 1
              }
            }
          });
          //角标
          if (update_num >= 10) {
            chrome.action.setBadgeText({ text: "10+" });
          } else if (update_num < 10 && update_num > 0)
            chrome.action.setBadgeText({ text: String(update_num) });
          else {
            chrome.action.setBadgeText({ text: '' });
          }
        }
      });
    });
}

function getNums() {
  return new Promise(resolve => {
    let nums = { bangumi: bangumi_num, normal: normal_num };
    normal_num = 0;
    bangumi_num = 0;
    resolve(nums);
  });
}

//监听popup打开
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // 返回更新数量
  if (message.getNums) {
    getNums().then(sendResponse);
    return true;
  }
  if (message.popupOpen) {
    checkNew(true);
  }
});

chrome.alarms.create({ periodInMinutes: 0.8 });
chrome.alarms.onAlarm.addListener(() => {
  checkNew();
});