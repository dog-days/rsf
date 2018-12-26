import cloneDeep from 'lodash/cloneDeep';
import { axiosCancels } from './createAxios';

/**
 * 创建 http api 请求 mutation
 * 其中 centers.request 和 reducer.set 是约定的
 * 使用例子：
 *  createHttpRequestMutation({
 *    url: '/v1/list',
 *    initialState: {
 *      page: 1,
 *      size: 10,
 *    }
 *    request: ({ url, payload, centerUtils }){ return axios.get('/v1/list') }
 *  })
 * url 就是 namescpace
 * 创建后等同于下面的 mutation
 *  {
 *    namescpace: '/v1/list',
 *    initialState: {
 *      page: 1,
 *      size: 10,
 *    },
 *    reducers: {
 *      set: (state, action)=>{
 *        return {
 *          ...state,
 *          ...action.payload,
 *        }
 *      }
 *    },
 *    centers: {
 *      async request(action,centerUtils){
 *        const reducerState = await request({ url, action, centerUtils });
 *        await centerUtils.put("set", {
 *          payload: reducerState,
 *        });
 *      }
 *    }
 *  }
 * @param {Object} arg {
 *   request,
 *   url,
 *   initialState = null,
 *   centers = {},
 *   reducers = {},
 * }
 * @param {Function} arg.request async 函数，或者返回 promise 的函数
 * @param {...} arg[...] 其余参数参考 redux-mutaion，initialState 默认值为{}
 * @returns {Object} mutation
 */
export default function createHttpRequestMutation({
  request,
  namespace,
  // 考虑多个请求的情况
  cancelUrls = [namespace],
  initialState = {},
  centers = {},
  reducers = {},
}) {
  function getInitialState() {
    if (typeof initialState === 'object') {
      return cloneDeep(initialState);
    } else {
      return initialState;
    }
  }
  return {
    namespace,
    initialState: getInitialState(),
    reducers: {
      ...reducers,
      set: (state, { payload }) => {
        return {
          ...state,
          ...payload,
        };
      },
    },
    centers: {
      ...centers,
      cancelAxios: () => {
        // 兼容多个请求的情况
        cancelUrls.forEach(c => {
          axiosCancels[c] && axiosCancels[c]();
          delete axiosCancels[c];
        });
      },
      request: (action, centerUtils) => {
        // 需要返回 promise，不使用 async 是为了减少代码量
        const result = request(action, centerUtils).then(reducerState => {
          if (reducerState) {
            centerUtils.put({
              type: 'set',
              payload: reducerState,
            });
          }
        });
        return result;
      },
    },
  };
}
