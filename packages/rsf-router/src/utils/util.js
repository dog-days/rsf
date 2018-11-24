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
 * react-router pathname适配
 * 例如 test 或者 test/ 或者 /test/ 会适配为/test
 *@param { String } pathname
 *@param { String } endStr 结尾追加的字符串
 * @return 返回处理后的 pathname
 */
export function pathnameAdapter(pathname, endStr = '') {
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
  return reStr + endStr;
}
