import React from 'react';
import PropTypes from 'prop-types';

import Warnings from './Warnings';
import { parsePathname } from './matchPath';

class Router extends React.Component {
  static childContextTypes = {
    history: PropTypes.object.isRequired,
    // 所有 <Route path="xx"/> props
    routesProps: PropTypes.array,
  };

  getChildContext() {
    return { history: this.history, routesProps: this.routesProps };
  }

  /**
   * 存放所有 routes 的 props，和其他一些属性方法
   * 主要用于开发环境下，各种错误检查
   * 还有 404 No Match 的情况。
   */
  routesProps = [];

  constructor(props) {
    super(props);
    this.history = this.props.history;
    // Do this here so we catch actions in cDM.
    this.unlisten = this.history.listen(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const { children } = this.props;
    //新增一个location.params
    const {
      location: { pathname },
    } = this.history;
    this.history.match = {
      params: parsePathname(pathname),
    };
    this.history.prevLocation = this.prevLocation;
    this.prevLocation = this.history.location;

    return (
      <span>
        {children}
        <Warnings />
      </span>
    );
  }
}
// eslint-disable-next-line
if (__DEV__) {
  Router.propTypes = {
    children: PropTypes.node,
    history: PropTypes.object.isRequired,
  };

  Router.prototype.componentDidUpdate = function(prevProps) {
    if (prevProps.history !== this.props.history) {
      throw new Error('You cannot change <Router history>');
    }
  };
}
export default Router;
