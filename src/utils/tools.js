function handleStopWheel(e) {
    e.preventDefault();
  }
  
  function forbid_scroll() {
    window.addEventListener("wheel", handleStopWheel, {
      passive: false
    });
  }
  
  function allow_scroll() {
    window.removeEventListener("wheel", handleStopWheel);
  }
  
  function getRetime(createtime) {
    let now = Date.parse(new Date()) / 1000;
    let limit = now - createtime;
    let content = "";
    if (limit < 60) {
      content = "就在刚刚";
    } else if (limit >= 60 && limit < 3600) {
      content = Math.floor(limit / 60) + "分钟前";
    } else if (limit >= 3600 && limit < 86400) {
      content = Math.floor(limit / 3600) + "小时前";
    } else if (limit >= 86400 && limit < 2592000) {
      content = Math.floor(limit / 86400) + "天之前";
    } else if (limit >= 2592000 && limit < 31104000) {
      content = Math.floor(limit / 2592000) + "个月前";
    } else {
      content = "很久以前";
    }
    return content;
  }
  
  function getTimeText(timestamp) {
    function zeroize(num) {
      return (String(num).length == 1 ? "0" : "") + num;
    }
    let curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
    let timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
  
    let curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
    let tmDate = new Date(timestamp * 1000); // 参数时间戳转换成的日期对象
  
    let Y = tmDate.getFullYear(),
      m = tmDate.getMonth() + 1,
      d = tmDate.getDate();
    let H = tmDate.getHours(),
      i = tmDate.getMinutes();
  
    if (timestampDiff < 60) {
      // 一分钟以内
      return "刚刚";
    } else if (timestampDiff < 3600) {
      // 一小时前之内
      return Math.floor(timestampDiff / 60) + "分钟前";
    } else if (
      curDate.getFullYear() == Y &&
      curDate.getMonth() + 1 == m &&
      curDate.getDate() == d
    ) {
      return "今天" + zeroize(H) + ":" + zeroize(i);
    } else {
      let newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
      if (
        newDate.getFullYear() == Y &&
        newDate.getMonth() + 1 == m &&
        newDate.getDate() == d
      ) {
        return "昨天" + zeroize(H) + ":" + zeroize(i);
      } else if (curDate.getFullYear() == Y) {
        return (
          zeroize(m) +
          "月" +
          zeroize(d) +
          "日 " +
          zeroize(H) +
          ":" +
          zeroize(i)
        );
      } else {
        return (
          Y +
          "年" +
          zeroize(m) +
          "月" +
          zeroize(d) +
          "日 " +
          zeroize(H) +
          ":" +
          zeroize(i)
        );
      }
    }
  }
  
  function resetScroller() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
  
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  export {
    forbid_scroll,
    allow_scroll,
    getRetime,
    resetScroller,
    getTimeText,
    sleep
  }