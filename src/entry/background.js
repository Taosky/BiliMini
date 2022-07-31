/* eslint-disable */ 
let bangumi_num = 0;
let normal_num = 0

function checkNew(update=false) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?uid=&type_list=8,512,4099`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            // 未登录
            if (xhr.responseText.indexOf(`"data":{}`)!==-1){
                chrome.browserAction.setBadgeText({text:'X'});
                return
            }
            
            let newInfo = JSON.parse(xhr.responseText);
  
            //更新数
            let update_num = 0;
            localStorage['latest_dynamic_id']=newInfo.data.cards[0].desc.dynamic_id;
            if (!localStorage['dynamic_id'] || update===true){
                localStorage['dynamic_id']=newInfo.data.cards[0].desc.dynamic_id;
            }
            else {
                newInfo.data.cards.forEach(function (card) {
                    if (card.desc.dynamic_id >localStorage['dynamic_id']){
                        update_num+=1
                        // 不同类型更新数
                        if (card.desc.type===8){
                            normal_num+=1
                        }else if (card.desc.type===512){
                            bangumi_num+=1
                        }
                    }
                    
                })
            }
            //角标
            if (update_num >= 10) {
                chrome.browserAction.setBadgeText({text: "10+"});
            } else if (update_num < 10 && update_num > 0)
                chrome.browserAction.setBadgeText({text: String(update_num)});
            else{
                chrome.browserAction.setBadgeText({text:''});
            }
        }
    };
    xhr.send();
  }

  function getNums(){
    return new Promise(resolve => {
        let nums = {bangumi:bangumi_num, normal:normal_num};
        normal_num = 0;
        bangumi_num = 0;
        resolve(nums);
      });

  }
  
  function start() {
    //监听popup打开
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
        // 返回更新数量
        if (message.getNums) {
            getNums().then(sendResponse);
            return true;
          }
        if(message.popupOpen) {
            checkNew(true);
        }
    });
    //定时检查订阅
    setInterval(checkNew, 60000);
  }
  
  
  //开始运行
  start();
  
  