import React from 'react';
import PropTypes from 'prop-types';

import { pathnameAdapter } from './utils/util';

function isPathMatched(pathname, path, isExact) {
  if (path === undefined) {
    return false;
  }
  pathname = pathnameAdapter(pathname, '/');
  path = pathnameAdapter(path, '/');
  const isExactAndMatched = isExact && pathname === path;
  const isNotExactButMatched =
    !isExact && !!pathname.match(new RegExp(`^${path}`));
  return isExactAndMatched || isNotExactButMatched;
}
/**
 * 配置路由
 * props.path 为 undefined 时，需要放在所有 <Route /> 后面，才会正常执行 404 No Match。
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
    return pathnameAdapter(this.context.history.location.pathname);
  }

  isPathMatched = () => {
    const { exact, path } = this.props;
    return isPathMatched(this.pathname, path, exact);
  };

  shouldRenderNoMatch() {
    return this.context.routesProps.every(r => {
      return !r.isPathMatched();
    });
  }

  render() {
    if (!this.context.history) {
      return false;
    }
    // eslint-disable-next-line
    const { path, exact, component: Com, index, ...rest } = this.props;
    if (!this._isMounted) {
      this.context.routesProps.push({
        isPathMatched: this.isPathMatched,
        exact,
        index,
        path: pathnameAdapter(path),
      });
    }
    if (
      this.isPathMatched() ||
      (path === undefined && this.shouldRenderNoMatch())
    ) {
      return <Com {...rest} />;
    }

    return false;
  }
}

//eslint-disable-next-line
if (__DEV__) {
  Route.propTypes = {
    path: PropTypes.string,
    exact: PropTypes.bool,
    component: PropTypes.func.isRequired,
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
