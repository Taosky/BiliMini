function insertHtml() {
  console.log('run popup js')
  fetch(`https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?uid=&type_list=8`)
  .then(response => response.json())
  .then(function(json){
    let cardListEle = document.getElementById("videoList");
    iHtml = ""
    json.data.cards.forEach(function (card) {
      let cardObj = JSON.parse(card.card);
      if(cardObj.pic){
        iHtml += `<div class="card">
        <a href="${cardObj.short_link}"><img class="cover" src="${cardObj.pic}" alt="tumb" style="width:100%"></a>
        <div class="container">
          <a style="text-decoration: none; color:black" href="${cardObj.short_link}">
            <h5 class="title"><b> ${cardObj.title }</b></h5>
          </a>
          <div class="up">
            <a class="up-link" href="https://space.bilibili.com/${cardObj.owner.mid}">
              <div>
                <img class="avatar" src="${cardObj.owner.face}">
                <span class="up-name">${cardObj.owner.name }</span>
              </div>
            </a>
          </div>
        </div>
      </div>`
        
      } else{
        iHtml += `<div class="card">
        <a href="${cardObj.url}"><img class="cover" src="${cardObj.cover}" alt="tumb" style="width:100%"></a>
        <div class="container">
          <a style="text-decoration: none; color:black" href="${cardObj.url}">
            <h5 class="title"><b> ${cardObj.new_desc} </b></h5>
          </a>
          <div class="up">
            <a class="up-link" href="${cardObj.url}">
              <div>
                <img class="avatar" src="${cardObj.apiSeasonInfo.cover}">
                <span class="up-name">${cardObj.apiSeasonInfo.title }</span>
              </div>
            </a>
          </div>
        </div>
      </div>`

      }
    });
    cardListEle.innerHTML = iHtml;
  })
  .catch(err => console.log('Request Failed', err));
}

window.onload = function () {
    chrome.runtime.sendMessage({popupOpen: true});
    insertHtml();
};

