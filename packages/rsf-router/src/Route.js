import React from 'react';
import PropTypes from 'prop-types';

import { getMatchedResult } from './matchPath';

/**
 * 配置路由
 * props.path 为 undefined 时，<Route />需要放在所有 <Route /> 后面，才会正常执行 404 No Match。
 * @props {String} path 路由路径
 * @props {Function} component react component
 * @props {Boolean} exact 是否精确匹配
 * @props {Boolean} index 是否访问 “/”，重定向到此路由
 */
export default class Route extends React.Component {
  static displayName = 'Route';
  static contextTypes = {
    history: PropTypes.object,
    routesProps: PropTypes.array,
    isInsideRoute: PropTypes.bool,
    getRouteMatchedResult: PropTypes.func,
  };

  componentDidMount() {
    this._isMounted = true;
    const { path } = this.props;
    const {
      history: { replace },
    } = this.context;

    if (this.shouldRedirectToIndex()) {
      replace(path);
    }
  }

  shouldRedirectToIndex = () => {
    const { index, path } = this.props;
    return index && this.pathname === '/' && path !== '/';
  };

  /**
   * @readonly
   */
  get pathname() {
    return this.context.history.location.pathname;
  }

  getRouteMatchedResult = () => {
    const { getRouteMatchedResult = getMatchedResult } = this.context;
    return getRouteMatchedResult(this.pathname, this.props);
  };

  shouldRenderNoMatch() {
    return this.context.routesProps.every(r => {
      return !r.getRouteMatchedResult();
    });
  }

  render() {
    // eslint-disable-next-line
    if (__DEV__) {
      this.throwsIfPathNotBeginWithSeparater();
    }
    if (!this.context.history) {
      return false;
    }
    // eslint-disable-next-line
    const { path, exact, component: Com, index, title } = this.props;
    const { history, routesProps } = this.context;
    if (!this._isMounted) {
      routesProps.push({
        getRouteMatchedResult: this.getRouteMatchedResult,
        exact,
        index,
        path: path,
      });
    }
    const matchResult = this.getRouteMatchedResult();
    if (matchResult || (path === undefined && this.shouldRenderNoMatch())) {
      if (title) {
        document.title = title;
      }
      history.match = matchResult;
      return (
        <Com
          title={title}
          history={history}
          location={history.location}
          match={history.match}
          prevLocation={history.prevLocation}
        />
      );
    }

    return false;
  }
}

//eslint-disable-next-line
if (__DEV__) {
  Route.propTypes = {
    path: PropTypes.string,
    exact: PropTypes.bool,
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
      .isRequired,
  };

  Route.childContextTypes = {
    isInsideRoute: PropTypes.bool,
  };

  Route.prototype._componentDidMount = Route.prototype.componentDidMount;
  Route.prototype.componentDidMount = function() {
    this.throws();
    this._componentDidMount();
  };

  Route.prototype.componentDidUpdate = function() {
    this.throws();
  };

  Route.prototype.getChildContext = function() {
    return { isInsideRoute: true };
  };
  //
  Route.prototype.throwsIfPathNotBeginWithSeparater = function() {
    const { path } = this.props;
    if (path !== undefined && path[0] !== '/') {
      throw new Error(
        `The route path "${path}" must begin with '/'.You should use:\r\n<Route path="/${path}" compoennt={View} />`
      );
    }
  };

  Route.prototype.throws = function() {
    this.throwsIfRouterContextNotDefined();
    this.throwsIfUseNestedRoute();
  };

  Route.prototype.throwsIfRouterContextNotDefined = function() {
    if (!this.context.history) {
      throw new Error(
        `You should not use \r\n<Route path="${
          this.props.path
        }" component={View} /> \r\noutside a <Router>`
      );
    }
  };

  Route.prototype.throwsIfUseNestedRoute = function() {
    const { isInsideRoute } = this.context;
    if (isInsideRoute) {
      throw new Error('You can not use route inside route component.');
    }
  };
}
