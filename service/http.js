import tips from '@/utils/tips.js';
const baseUrl = 'https://openapi.gcchen.cn';

// HTTP工具类
export default class http {
  static async request(method, url, data = {}) {
    data = data ? data : {};
    if (method == 'GET') {
      data.retimestamp = new Date().getTime();
    }
    let apiHost = baseUrl;


    let isHandleErr = false;
    if (data.isHandleErr) {
      isHandleErr = true;
      delete data.isHandleErr;
    }
    let log = data.log;
    if (log) {
      delete data.log;
    }

    let api = apiHost + url;
    let param = {
      url: api,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json',
      },
    };

    const res = await new Promise((resolve, reject) => {
      uni.request({
        ...param,
        success: (res) => resolve(res),
        fail: (res) => resolve(res),
      });
    });
    console.log(res, '结果');
    if (this.isSuccess(res)) {
      // 针对约定的code相应处理
      let response = (res) || {};
      let isSuccess = (response.statusCode == 1 || response.statusCode == 200) && !isHandleErr;
      console.log(response, 'response', isHandleErr, 'isHandleErr', isSuccess, 'isSuccess');

      if (isSuccess) {
        return res && res.data;
      } else if ((response.statusCode == 1010 || response.statusCode === 1007) && !isHandleErr) {

      } else if ([1326, 1327, 1332, 1009, 1025].includes(Number(response.statusCode))) {
        // 数据不存在，跳转到首页
      } else if (response.statusCode == 503 || response.statusCode >= 10000) {
        // 上报错误
        tips.warning(response.data.error);
      } else {
        if (isHandleErr) {
          return {
            ...response,
            isErr: true,
          };
        }
        tips.warning(response.msg);
        //报错返回undefined
        return undefined;
      }
    } else {
      // tips.hideLoading();
      tips.warning(res.data.error);
      throw this.requestException(res);
    }
  }

  /**
   * 判断请求是否成功
   */
  static isSuccess(res) {
    const wxCode = res && res.statusCode;
    // 微信请求错误
    if (wxCode !== 200) {
      return false;
    }
    return true;
  }

  /**
   * 异常
   */
  static requestException(res) {
    const error = {};
    error.statusCode = res && res.statusCode;
    const wxData = (res && res.data) || {},
      serverData = wxData.data;
    if (serverData) {
      error.serverCode = wxData.code;
      error.message = serverData.message;
      error.serverData = serverData;
    }
    return error;
  }

  static get(url, data = {}) {
    return this.request('GET', url, data);
  }

  static put(url, data = {}) {
    return this.request('PUT', url, data);
  }

  static post(url, data = {}) {
    return this.request('POST', url, data);
  }

  static patch(url, data = {}) {
    return this.request('PATCH', url, data);
  }

  static delete(url, data = {}) {
    return this.request('DELETE', url, data);
  }
}
