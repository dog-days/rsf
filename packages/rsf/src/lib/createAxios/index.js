import axios from 'axios';
import merge from 'lodash/merge';

import defaultConfig from './config.js';

export const INVALIDESTATUSCODE = 'INVALIDESTATUSCODE';
export const TIMEOUT = 'TIMEOUT';
export const SETTINGERROR = 'SETTINGERROR';

// 默认的状态码提示语
export const CODMESSAGE = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（登录失效）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * @param {object} config axios config，新增 success 和 fail 回调，统一处理所有 axios 请求
 */
export class CustomAxios {
  constructor(config = {}) {
    this.config = config;
  }

  getCancelSource() {
    var CancelToken = axios.CancelToken;
    var source = CancelToken.source();
    return source;
  }

  getTheLastConfig(config = {}) {
    const newConfig = merge({}, this.config, config);
    newConfig.headers = {
      //默认无缓存
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      ...newConfig.headers,
    };
    return newConfig;
  }

  replaceNewStatusText(response) {
    const newStatusText = CODMESSAGE[response.status];
    if (newStatusText) {
      response.statusText = newStatusText;
    }

    return response.statusText;
  }

  request(config) {
    config = this.getTheLastConfig(config);
    const { success, fail, ...axiosConfig } = config;
    return axios
      .request(axiosConfig)
      .then(response => {
        success && success(response);
        response.statusText = this.replaceNewStatusText(response);
        return response;
      })
      .catch(error => {
        if (axios.isCancel(error)) {
          // 取消不算错误
          return;
        }
        const errorTypeName = '$type';
        if (error.response) {
          //请求成功，状态码不合法，默认只有 2xx，才是合法的。
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          //console.error(error.response);
          error[errorTypeName] = INVALIDESTATUSCODE;
          error.response.statusText = this.replaceNewStatusText(error.response);
          fail && fail(error);
          throw error;
        } else if (error.request) {
          //请求超时、跨域等无服务器响应的请求。
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          //console.error(error.message, error.request);
          error[errorTypeName] = TIMEOUT;
          fail && fail(error);
          throw error;
        } else {
          //配置错误，这个一般用户不会遇到，除非有 bug
          // Something happened in setting up the request that triggered an Error
          //console.log(error.message);
          error[errorTypeName] = SETTINGERROR;
          fail && fail(error);
          throw error;
        }
      });
  }
}

export const axiosCancels = [];
/**
 * 这里向外提供get、delete等直接使用的方式。
 * @param {object} config axios config，新增 success 、fail 回调 和 cancelNamepace
 * @returns {object}
 */
export default function(config) {
  config = {
    ...defaultConfig,
    ...config,
  };
  const fetch = new CustomAxios(config);
  function commonRequest(method, url, config) {
    // cancelNamepace默认为 url，不包括 baseURL
    const { cancelNamepace = url, ...restConfig } = config;
    const cancelSource = fetch.getCancelSource();
    const cancel = cancelSource.cancel;
    axiosCancels[cancelNamepace] = cancel;
    const request = fetch.request({
      ...restConfig,
      method,
      url,
      cancelToken: cancelSource.token,
    });
    return request;
  }
  const methods = ['get', 'delete', 'head', 'options', 'post', 'put', 'patch'];
  methods.forEach(v => {
    switch (v) {
      case 'post':
      case 'put':
      case 'patch':
        fetch[v] = function(url, data, config) {
          return commonRequest(v, url, { ...config, data });
        };
        break;
      default:
        fetch[v] = function(url, config) {
          return commonRequest(v, url, { ...config });
        };
    }
  });
  return fetch;
}
