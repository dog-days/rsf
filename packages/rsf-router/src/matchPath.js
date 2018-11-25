import { converToCamelbakStr } from './utils/util';

/**
 * pathname适配
 * 例如 test 或者 test/ 或者 /test/ 会适配为/test
 *@param { String } pathname
 * @return 返回处理后的 pathname
 */
export function pathnameAdapter(pathname) {
  if (!pathname || pathname === '/') {
    return pathname;
  }
  //eslint-disable-next-line
  if (__DEV__ && typeof pathname !== 'string') {
    throw new TypeError('Expected the pathanme to be a string.');
  }
  const reStr = pathname
    .split('/')
    .filter(p => p)
    .join('/');
  return '/' + reStr;
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
  // eslint-disable-next-line
  if (__DEV__ && typeof pathname !== 'string') {
    throw new TypeError('Expected the pathanme to be a string.');
  }
  //替换字符之替换第一个，后面的属于参数，不替换，还要替换成特殊的字符
  var pathnameSplit = pathname.split('/');
  //删除第一个为空的数组
  pathnameSplit.splice(0, 1);
  var params = {
    layoutId: converToCamelbakStr(pathnameSplit[0]),
    viewId: converToCamelbakStr(pathnameSplit[1]),
  };
  //删除 layoutId 和 viewId
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

export function getMatchedResult(pathname, options) {
  let { path, exact } = options;
  if (path === undefined) {
    return;
  }
  const isOriginalExact = pathname === path;
  const pathnameA = pathnameAdapter(pathname) + '/';
  const pathA = pathnameAdapter(path) + '/';
  const isExactAndMatched = exact && pathnameA === path;
  const isNotExactButMatched =
    !exact && !!pathnameA.match(new RegExp(`^${pathA}`));
  const isMatched = isExactAndMatched || isNotExactButMatched;
  if (isMatched) {
    return {
      params: parsePathname(pathname),
      url: path,
      path,
      isExact: isOriginalExact,
    };
  }
}
