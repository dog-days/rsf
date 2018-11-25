// 使用 react-router 的用法
// https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/matchPath.js
import React from 'react';
import PropTypes from 'prop-types';
import pathToRegexp from 'path-to-regexp';

/**
 * 使用 express、koa、react-router 的 match path 方式。
 */
export default class PathToRegexpMatchPath extends React.Component {
  static displayName = 'PathToRegexpMatchPath';

  static childContextTypes = {
    getRouteMatchedResult: PropTypes.func,
  };

  getChildContext() {
    return {
      getRouteMatchedResult: this.getRouteMatchedResult,
    };
  }

  cache = {};
  cacheLimit = 10000;
  cacheCount = 0;

  compilePath(path, options) {
    const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
    const pathCache = this.cache[cacheKey] || (this.cache[cacheKey] = {});

    if (pathCache[path]) return pathCache[path];

    const keys = [];
    const regexp = pathToRegexp(path, keys, options);
    const result = { regexp, keys };

    if (this.cacheCount < this.cacheLimit) {
      pathCache[path] = result;
      this.cacheCount++;
    }

    return result;
  }

  getRouteMatchedResult = (pathname, options) => {
    const { path, exact = false, strict = false, sensitive = false } = options;
    if (path === undefined) return;
    const { regexp, keys } = this.compilePath(path, {
      end: exact,
      strict,
      sensitive,
    });
    const match = regexp.exec(pathname);

    if (!match) return;

    const [url, ...values] = match;
    const isExact = pathname === url;

    if (exact && !isExact) return null;

    return {
      path, // the path used to match
      url, // the matched portion of the URL
      isExact, // whether or not we matched exactly
      params: keys.reduce((memo, key, index) => {
        memo[key.name] = values[index];
        return memo;
      }, {}),
    };
  };

  render() {
    const { children } = this.props;
    return React.Children.only(children);
  }
}
