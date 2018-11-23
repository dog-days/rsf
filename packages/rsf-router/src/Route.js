import React from 'react';
import PropTypes from 'prop-types';

import { pathnameAdapter } from './utils/util';
import withRouter from './withRouter';

function isPathMatched(pathname, path, isExact) {
  pathname = pathnameAdapter(pathname, '/');
  path = pathnameAdapter(path, '/');
  const isExactAndMatched = isExact && pathname === path;
  const isNotExactButMatched = !isExact && !!pathname.match(path);
  return isExactAndMatched || isNotExactButMatched;
}
export default class Route extends React.Component {
  static displayName = 'Route';
  static contextTypes = {
    history: PropTypes.object,
    routesProps: PropTypes.array.isRequired,
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

  setComponent(flag) {
    let { component: Com } = this.props;
    if (!flag) {
      this.Com = false;
    } else {
      this.Com = withRouter(Com);
    }
    setTimeout(() => {
      // setTimeout 防止 react 报错，render是内是不可以使用 forceUpdate
      // 在 Match 组件的render 中使用了。
      this.forceUpdate();
    });
  }

  /**
   * 清空渲染的组件，渲染空组件
   */
  renderNoComponent = () => {
    this.setComponent(false);
    this.prevRouteProps = undefined;
  };

  /**
   * 渲染当前 route 页面的组件
   */
  renderComponent = () => {
    // 只有渲染了才算上一个RouteProps
    this.prevRouteProps = { ...this.props };
    this.setComponent(true);
  };

  /**
   * @readonly
   */
  get pathname() {
    return pathnameAdapter(this.context.history.location.pathname);
  }

  /**
   * 当前 route 依然还在页面上显示，切换页面需要销毁
   */
  isRouteStillShowed = () => {
    return !!this.Com;
  };

  isTheCurrentPathMatched = () => {
    const { exact, path } = this.props;
    return isPathMatched(this.pathname, path, exact);
  };

  isPrevPathMatched = () => {
    const { exact } = this.props;
    // 上一个记录的 path 匹配到 pathname，不触发 route render
    if (this.prevRouteProps === undefined) {
      return false;
    }
    return isPathMatched(this.pathname, this.prevRouteProps.path, exact);
  };

  shouldComponentUpdate() {
    if (this.isTheCurrentPathMatched()) {
      // 只有当前 route path 匹配到才会渲染
      // 防止页面切换，上一个页面会渲染的问题。
      return true;
    }
    return false;
  }

  render() {
    const { routesProps } = this.context;
    // eslint-disable-next-line
    const { path, component, index, ...rest } = this.props;
    if (!this._isMounted) {
      //eslint-disable-next-line
      if (__DEV__) {
        this.throwsIfPathExits();
        this.throwsIfUseNestedRoute();
      }
      routesProps.push({
        path,
        shouldRedirectToIndex: this.shouldRedirectToIndex,
        isRouteStillShowed: this.isRouteStillShowed,
        isTheCurrentPathMatched: this.isTheCurrentPathMatched,
        isPrevPathMatched: this.isPrevPathMatched,
        renderComponent: this.renderComponent,
        renderNoComponent: this.renderNoComponent,
      });
    }
    const Com = this.Com;
    if (Com) {
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
    component: PropTypes.func,
  };

  Route.childContextTypes = {
    isInsideRoute: PropTypes.bool,
  };

  Route.prototype.getChildContext = function() {
    return { isInsideRoute: true };
  };

  Route.prototype.throwsIfPathExits = function() {
    const { path } = this.props;
    const paths = [];
    this.context.routesProps.forEach(r => {
      paths.push(r.path);
    });
    if (!!~paths.indexOf(path)) {
      throw new Error(`Expected the route path "${path}" to be unique.`);
    }
  };

  Route.prototype.throwsIfUseNestedRoute = function() {
    const { isInsideRoute } = this.context;
    if (isInsideRoute) {
      throw new Error(
        "You can not use route inside route component.That's different to react-router."
      );
    }
  };
}
