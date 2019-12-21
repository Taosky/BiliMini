window.onload = function () {
    chrome.runtime.sendMessage({popupOpen: true});
};


// contentWindow = document.querySelector('iframe').contentWindow

// contentWindow.eval(`function addStyleString(str){var node=document.createElement("style");node.innerHTML=str;document.body.appendChild(node)}addStyleString(".dyn_list_wrapper { height:32vh!important }");addStyleString(".read-more { color:red!important }");`)