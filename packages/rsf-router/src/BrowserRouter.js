import React from 'react';
import PropTypes from 'prop-types';

import History from './react-history/BrowserHistory';
import Warnings from './Warnings';

export default class BrowserRouter extends React.Component {
  static displayName = 'BrowserRouter';
  static childContextTypes = {
    // 所有 <Route path="xx"/> props
    routesProps: PropTypes.array,
  };

  getChildContext() {
    return {
      routesProps: this.routesProps,
    };
  }

  /**
   * 存放所有 routes 的 props，和其他一些属性方法
   * 主要用于开发环境下，各种错误检查
   * 还有 404 No Match 的情况。
   */
  routesProps = [];

  render() {
    const { children, ...rest } = this.props;
    // eslint-disable-next-line
    if (__DEV__) {
      return (
        <History {...rest}>
          {children}
          <Warnings />
        </History>
      );
    }
    return <History {...rest}>{children}</History>;
  }
}
