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
export default class Route extends React.Component {
  static displayName = 'Route';
  static contextTypes = {
    history: PropTypes.object,
    routesProps: PropTypes.array,
    isInsideRoute: PropTypes.bool,
  };

  componentDidMount() {
    this._isMounted = true;
    //eslint-disable-next-line
    if (__DEV__) {
      this.throwsIfUseNestedRoute();
    }
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

  Route.prototype.getChildContext = function() {
    return { isInsideRoute: true };
  };

  Route.prototype.throwsIfUseNestedRoute = function() {
    const { isInsideRoute } = this.context;
    if (isInsideRoute) {
      throw new Error('You can not use route inside route component.');
    }
  };
}
