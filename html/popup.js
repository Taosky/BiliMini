function getRetime(createtime) {
  let now = Date.parse(new Date()) / 1000;
  let limit = now - createtime;
  let content = "";
  if (limit < 60) {
    content = "刚刚";
  } else if (limit >= 60 && limit < 3600) {
    content = Math.floor(limit / 60) + "分钟前";
  } else if (limit >= 3600 && limit < 86400) {
    content = Math.floor(limit / 3600) + "小时前";
  } else if (limit >= 86400 && limit < 2592000) {
    content = Math.floor(limit / 86400) + "天前";
  } else if (limit >= 2592000 && limit < 31104000) {
    content = Math.floor(limit / 2592000) + "个月前";
  } else {
    content = "很久前";
  }
  return content;
}
function insertHtml() {
  loadEle = document.getElementById('loading');
  fetch(`https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?uid=&type_list=8`)
    .then(response => response.json())
    .then(function (json) {
      loadEle.style.opacity = 0;
      let cardListEle = document.getElementById("videoList");
      iHtml = ""
      json.data.cards.forEach(function (card) {
        let cardObj = JSON.parse(card.card);
        let retime = getRetime(cardObj.ctime)
        if (cardObj.pic) {
          iHtml += `<div class="card">
        <a class="video-img" href="${cardObj.short_link}"><img class="cover" src="${cardObj.pic}" alt="tumb" style="width:100%"></a>
        <span class="pub-time">${retime}</span>
        <div class="container">
          <a style="text-decoration: none; color:black" href="${cardObj.short_link}">
            <h5 class="title"><b> ${cardObj.title}</b></h5>
          </a>
            <a class="up-link" title="${cardObj.owner.name}" href="https://space.bilibili.com/${cardObj.owner.mid}">
                <img class="avatar" src="${cardObj.owner.face}">
                <span class="up-name">${cardObj.owner.name}</span>
            </a>
        </div>
      </div>`

        } else {
          iHtml += `<div class="card">
        <a class="video-img" href="${cardObj.url}"><img class="cover" src="${cardObj.cover}" alt="tumb" style="width:100%"></a>
        <span class="pub-time">番剧</span>
        <div class="container">
          <a style="text-decoration: none; color:black" href="${cardObj.url}">
            <h5 class="title"><b> ${cardObj.new_desc} </b></h5>
          </a>
          <div class="up">
            <a class="up-link" href="${cardObj.url}">
                <img class="avatar" src="${cardObj.apiSeasonInfo.cover}">
                <span class="up-name">${cardObj.apiSeasonInfo.title}</span>
            </a>
          </div>
        </div>
      </div>`

        }
      });
      cardListEle.innerHTML = iHtml;
      appEle = document.getElementById('app');
      appEle.style.opacity = 1;
    })
    .catch(err => console.log('Request Failed', err));
}

window.onload = function () {
  insertHtml();
};