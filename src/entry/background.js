/* eslint-disable */
function checkNew(update = false) {
    fetch(`https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?uid=&type_list=8,512,4099`)
    .then(response => response.json())
    .then(data => {
        // 未登录
        if (data['code']=== -6) {
            chrome.action.setBadgeText({ text: 'X' });
            return
        }
        let newInfo = data;

        //更新数
        let update_num = 0;
        chrome.storage.sync.set({"latest_dynamic_id": newInfo.data.cards[0].desc.dynamic_id}, function() {
            console.log('Value is set' );
          });
        let current_dynamic_id = undefined;
        chrome.storage.sync.get(['latest_dynamic_id'], function(result) {
            console.log('Value currently is ' + result.latest_dynamic_id);
            current_dynamic_id = result.latest_dynamic_id;
          });
        if (!current_dynamic_id || update === true) {
            chrome.storage.sync.set({"latest_dynamic_id": newInfo.data.cards[0].desc.dynamic_id}, function() {
                console.log('Value is set');
              });
        }
        else {
            newInfo.data.cards.forEach(function (card) {
                if (card.desc.dynamic_id > current_dynamic_id) {
                    update_num += 1
                }
            })
        }
        //角标
        if (update_num >= 10) {
            chrome.action.setBadgeText({ text: "10+" });
        } else if (update_num < 10 && update_num > 0)
            chrome.action.setBadgeText({ text: String(update_num) });
        else {
            chrome.action.setBadgeText({ text: '' });
        }
    });
}

//监听popup打开
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.popupOpen) {
        checkNew(true);
    }
});

chrome.alarms.create({ periodInMinutes: 1.0 });
chrome.alarms.onAlarm.addListener(() => {
    checkNew();
});