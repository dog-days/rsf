/**
 * toUpperCase 小写转大写
 * @param  {String} string 传进来的字符串
 * @param  {Nubmer}  start  开始位置，默认0
 * @param  {Nubmer}  end  结束位置，默认1
 * @return {string}
 */
export function toUpperCaseByPosition(string, start = 0, end = 1) {
  var str1 = string.substr(start, end).toUpperCase();
  var str2 = string.substr(end);
  return str1 + str2;
}
/**
 * 字符串转换成驼峰式字符串
 * test-one => testOne
 * @param {String} str
 * @return {Stirng}
 */
export function converToCamelbakStr(str) {
  if (!str) {
    return;
  }
  return str
    .split('-')
    .map((c, index) => {
      if (index !== 0) {
        return toUpperCaseByPosition(c, 0, 1);
      }
      return c;
    })
    .join('');
}
/**
 * 根据 viewId 和 layoutId 获取url的配置参数
 * url 风格定义如下:
 * pathname=/main/about-me/id/100/app-id/aiermu
 * 上面的pathname会解析为
 * {layoutId: 'main',viewId: 'aboutMe',id: "100",appId: 'aiermu','app-id': 'aiermu' }
 * @param {String} pathanme history中的location.pathname || location.hash，不是浏览器的location
 * @return {Object} { layoutId: xx, viewId: xx, ...params }
 */
export function parsePathname(pathname) {
  if (typeof pathname !== 'string') {
    throw new TypeError('Expected the pathanme to be a string.');
  }
  pathname = pathnameAdapter(pathname);
  //替换字符之替换第一个，后面的属于参数，不替换，还要替换成特殊的字符
  var pathnameSplit = pathname.split('/');
  if (pathnameSplit[0] === '') {
    pathnameSplit.splice(0, 1);
  }
  var layoutId = pathnameSplit[0];
  var viewId = pathnameSplit[1];
  var params = {
    layoutId: converToCamelbakStr(layoutId),
    viewId: converToCamelbakStr(viewId),
  };
  if (!layoutId || !viewId) {
    return params;
  }
  //删除controlerId 和 viewId
  pathnameSplit.splice(0, 2);
  //整合params
  pathnameSplit.forEach((v, k) => {
    if (k % 2 === 0) {
      if (pathnameSplit[k + 1]) {
        //兼容两种属性方式
        params[v] = pathnameSplit[k + 1];
        params[converToCamelbakStr(v)] = params[v];
      }
    }
  });
  return params;
}

/**
 * react-router pathname适配
 * 例如 test 或者 test/ 或者 /test/ 会适配为/test
 *@param { String } pathname
 *@param { String } endStr 结尾追加的字符串
 * @return 返回处理后的 pathname
 */
export function pathnameAdapter(pathname, endStr = '') {
  if (!pathname) {
    return;
  }
  //eslint-disable-next-line
  if (__DEV__ && typeof pathname !== 'string') {
    throw new TypeError('Expected the pathanme to be a string.');
  }
  if (pathname === '/') {
    return pathname;
  }
  const reStr = pathname
    .split('/')
    .filter(p => p)
    .join('/');
  return reStr + endStr;
}
