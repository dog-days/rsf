import React from 'react';
import PropTypes from 'prop-types';

import NoMatch from './NoMatch';
import { pathnameAdapter } from './utils/util';

export default class Match extends React.Component {
  static displayName = 'Match';

  static contextTypes = {
    history: PropTypes.object,
    routesProps: PropTypes.array.isRequired,
  };

  state = {};

  get pathname() {
    return this.context.history.location.pathname;
  }

  renderTheRouteComponentToRoute() {
    //eslint-disable-next-line
    __DEV__ && this.throwsIfPathMatchMoreThanOne();
    const { routesProps } = this.context;

    let NoMatchComponent = NoMatch;
    // 是否重定向到主页
    this.reDirectedIndexPath = undefined;
    const isMatched = routesProps
      .map(r => {
        const {
          shouldRedirectToIndex,
          path,
          isRouteStillShowed,
          isTheCurrentPathMatched,
          isPrevPathMatched,
          renderNoComponent,
          renderComponent,
          component: Com,
        } = r;

        if (shouldRedirectToIndex()) {
          // 会重定向到 设定主页
          return true;
        } else if (isPrevPathMatched()) {
          // pathname 匹配到上一个访问的页面
          // 那就不能返回 404 No Matched
          return true;
        } else if (isRouteStillShowed()) {
          //销毁上一个页面
          renderNoComponent();
        } else if (isTheCurrentPathMatched()) {
          //然后渲染当前的匹配到的页面
          renderComponent();
          return true;
        } else if (path === undefined) {
          // 无匹配到的页面，返回 404 No Matched
          NoMatchComponent = Com;
        }
      })
      .some(flag => flag);

    if (!isMatched) {
      return NoMatchComponent;
    }
    return false;
  }

  redirectToIndex() {
    const {
      history: { replace },
    } = this.context;
    if (this.reDirectedIndexPath) {
      replace(this.reDirectedIndexPath);
      this.reDirectedIndexPath = undefined;
    }
  }

  render() {
    const NoMatchComponent = this.renderTheRouteComponentToRoute();
    if (NoMatchComponent) {
      return <NoMatchComponent history={this.context.history} />;
    }
    return false;
  }
}

//eslint-disable-next-line
if (__DEV__) {
  Match.prototype.componentDidMount = function() {
    this.warningIfHasIndexPathButRedirected();
  };

  Match.prototype.warningIfHasIndexPathButRedirected = function() {
    // <Route path="/test" index /> index 和 <Route path="/" index/> 冲突
    // 会访问 / 会从定向到 /test
    let { routesProps } = this.context;
    const indexsPath = [];
    routesProps.forEach(r => {
      const { index, path } = r;
      if (path === '/' || index) {
        indexsPath.push(path);
      }
    });
    if (indexsPath.length > 1) {
      let errStr = `Expected the only one index route path to be matched，but there are ${
        indexsPath.length
      } matched: \r\n`;
      indexsPath.forEach(indexPath => {
        if (indexPath === '/') {
          errStr += `<Route path="${indexPath}" component={View} />\r\n`;
        } else {
          errStr += `<Route path="${indexPath}" component={View} index />\r\n`;
        }
      });
      throw new Error(errStr);
    }
  };

  Match.prototype.throwsIfPathMatchMoreThanOne = function() {
    let {
      history: {
        location: { pathname },
      },
      routesProps,
    } = this.context;
    const matchs = [];
    pathname = pathnameAdapter(pathname, '/');
    routesProps.forEach((r, k) => {
      let { exact, path } = r;
      path = pathnameAdapter(path, '/');
      if (!exact && !!pathname.match(path)) {
        matchs.push(pathnameAdapter(path));
      }
    });
    if (matchs.length > 1) {
      let errStr = `Expected the only one route path to be matched，but there are ${
        matchs.length
      } matched: \r\n`;
      matchs.forEach(path => {
        errStr += `<Route path="${path}" component={View} />\r\n`;
      });
      errStr += 'Or you should use <Route /> below: \r\n';
      matchs.forEach(path => {
        errStr += `<Route path="${path}" exact />\r\n`;
      });
      throw new Error(errStr);
    }
  };
}
