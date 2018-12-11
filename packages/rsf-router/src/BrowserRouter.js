import React from 'react';
import PropTypes from 'prop-types';
import { createBrowserHistory as createHistory } from 'history';

import Router from './Router';

class BrowserRouter extends React.Component {
  static displayName = 'BrowserRouter';

  render() {
    const { children, ...rest } = this.props;
    return <Router history={createHistory(rest)}>{children}</Router>;
  }
}

// eslint-disable-next-line
if (__DEV__) {
  BrowserRouter.propTypes = {
    basename: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    forceRefresh: PropTypes.bool,
    getUserConfirmation: PropTypes.func,
    keyLength: PropTypes.number,
  };

  BrowserRouter.prototype.componentDidMount = function() {
    if (this.props.history) {
      throw new Error(
        '<BrowserRouter> ignores the history prop. To use a custom history, ' +
          'use `import { Router }` instead of `import { BrowserRouter as Router }`.'
      );
    }
  };
}

export default BrowserRouter;

export * from './commonExports';
