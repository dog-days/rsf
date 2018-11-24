import React from 'react';
import PropTypes from 'prop-types';
import createBrowserHistory from 'history/createBrowserHistory';

import { parsePathname } from '../utils/util';

/**
 * Manages session history using the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */
class BrowserHistory extends React.Component {
  static childContextTypes = {
    history: PropTypes.object.isRequired,
  };

  getChildContext() {
    return { history: this.history };
  }

  componentWillMountBeforeRender() {
    const {
      basename,
      forceRefresh,
      getUserConfirmation,
      keyLength,
    } = this.props;

    this.history = createBrowserHistory({
      basename,
      forceRefresh,
      getUserConfirmation,
      keyLength,
    });

    // Do this here so we catch actions in cDM.
    this.unlisten = this.history.listen(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    if (!this.history) {
      //兼容 15.x 老版本
      //不用 componentWillUnmount，因为在react@17.x版本会移除
      this.componentWillMountBeforeRender();
    }
    const { children } = this.props;
    //新增一个location.params
    const { location } = this.history;
    location.params = parsePathname(location.pathname);
    return <span>{children}</span>;
  }
}
// eslint-disable-next-line
if (__DEV__) {
  BrowserHistory.propTypes = {
    basename: PropTypes.string,
    forceRefresh: PropTypes.bool,
    getUserConfirmation: PropTypes.func,
    keyLength: PropTypes.number,
  };
}
export default BrowserHistory;
