function addStyleString(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    document.body.appendChild(node);
}
console.log('123');
addStyleString('#app-container { margin-left: -12px; margin-top:-12px }');
addStyleString('.dynamic-iframe { padding-bottom:0px!important}');
addStyleString('.dyn_list_wrapper { height:304px!important }');
addStyleString('.dynamic-m .wnd_bottom .r-l {padding-right:29px!important}') 