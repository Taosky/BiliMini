import axios from "axios";


const handleRequest = async function (url, method = 'get', data = false) {
    if (method === 'get') {
        try {
            const response = await axios.get(url);
            return response.data;
        }
        catch (e) {
            console.error('api请求: ' + e);
            return false;
        }
    } else if (method === 'post') {
        try {
            const response = await axios.post(url, data);
            return response.data;
        }
        catch (e) {
            console.error('api请求: ' + e);
            return false;
        }
    }
}

// 获取动态
const getDynamicData = async function (type, updateBaseline = false, offset = false) {
    console.log('offset: ' + offset)
    let url = `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?type=${type}`;
    if (updateBaseline) {
        url += `&update_baseline=${updateBaseline}`;
    }
    if (offset) {
        url += `&offset=${offset}`;
    }

    const responseData= await handleRequest(url);
    return responseData;
}

//获取稍后再看
const getToWatchData = async function () {
    const responseData= await handleRequest('https://api.bilibili.com/x/v2/history/toview');
    return responseData;
}

//添加稍后再看
const addToWatchData = async function (aid, jct) {
    const responseData= await handleRequest('https://api.bilibili.com/x/v2/history/toview/add', 'post', new URLSearchParams({
        'jsonp': 'jsonp',
        'aid': aid,
        'csrf': jct,
    }));
    return responseData;
}

//删除稍后再看
const delTowatchData = async function (aid, jct) {
    const responseData= await handleRequest('https://api.bilibili.com/x/v2/history/toview/del', 'post', new URLSearchParams({
        'jsonp': 'jsonp',
        'aid': aid,
        'csrf': jct,
    }));
    return responseData;
}

//获取直播
const getLiveData = async function (page = 1, pageSize = 10) {
    const responseData= await handleRequest(`https://api.live.bilibili.com/relation/v1/feed/feed_list?page=${page}&pagesize=${pageSize}`)
    return responseData;
}

//获取历史记录
const getHistoryData = async function () {
    const responseData= await handleRequest(`https://api.bilibili.com/x/web-interface/history/cursor?type=archive&ps=20`)
    return responseData;
}

export {
    getDynamicData,
    getToWatchData,
    addToWatchData,
    delTowatchData,
    getLiveData,
    getHistoryData,
}