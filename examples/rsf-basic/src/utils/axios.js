import { createAxios } from 'rsf';
import { message } from 'antd';
import debounce from 'lodash.debounce';

const showErrorMessageDelayTime = 600;
// 延迟展示错误信息，针对用户不断点击或者多个请求同时报错的情况
// ${showErrorMessageDelayTime}秒内只展示一次错误信息
// 用户体验相关，不需要也可以，多个 message.error 的情况还是比较少的。
const showErrorMessageDebounce = debounce(function(messageStr, callback) {
  callback && callback();
  message.error(messageStr);
}, showErrorMessageDelayTime);

const headers = Object.create(null, {
  Authorization: {
    get: function() {
      // getter 方式可以确保每次请求都可以从 cookie 中获取最新的 token
      return Math.random();
    },
    // 必须是可枚举的
    enumerable: true,
  },
});

// 返回 axio，详细请参考 https://github.com/axios/axios
// 经过了改造，默认配置不一样
export default createAxios({
  headers,
  baseURL: '/api/v1/',
  fail: error => {
    // 统一处理错误信息
    if (error.response) {
      // 服务端有响应，但是请求码是非 2xx 请求
      // 默认非 2xx 请求都是 非法请求
      const { data, status } = error.response;
      if (status === 401) {
        // token 过期失效
        message.error('登录失效，需重新登录。');
        setTimeout(() => {
          // 为什么不用 history.push，因为会遗留各种 redux 的状态数据，
          // 而且登录用户也可能不是上一个用户，这种情况还是有可能发生的。
          // 所以直接重载页面，跳转到登录页面，就不用考虑上面的情况了。
          window.location.href = '/user/login';
        }, 500);
      }
      if (data) {
        // 404 返回的 不一定是 json 数据，只有 data 不为 null，才是返回了 json 格式
        showErrorMessageDebounce(data.message || error.response.statusText);
      } else {
        showErrorMessageDebounce(error.response.statusText);
      }
    } else if (error.request) {
      // 服务端无响应的情况
      // 网络无连接时会立即返回错误，请求超时（默认8秒）返回错误，跨域返回错误等情况
      showErrorMessageDebounce('网络连接出问题，或者连接超时。');
    } else {
      // axios 配置错误，一般都不会出现这个问题的。
      showErrorMessageDebounce('发生了未知错误。');
    }
  },
});
