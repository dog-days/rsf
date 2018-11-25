import React from 'react';
import PropTypes from 'prop-types';
import { createHashHistory as createHistory } from 'history';

import Router from './Router';

class HashRouter extends React.Component {
  static displayName = 'HashRouter';

  render() {
    const { children, ...rest } = this.props;
    return <Router history={createHistory(rest)}>{children}</Router>;
  }
}

// eslint-disable-next-line
if (__DEV__) {
  HashRouter.propTypes = {
    basename: PropTypes.string,
    children: PropTypes.node,
    getUserConfirmation: PropTypes.func,
    hashType: PropTypes.oneOf(['hashbang', 'noslash', 'slash']),
  };

  HashRouter.prototype.componentDidMount = function() {
    if (this.props.history) {
      throw new Error(
        '<HashRouter> ignores the history prop. To use a custom history, ' +
          'use `import { Router }` instead of `import { HashRouter as Router }`.'
      );
    }
  };
}

export default HashRouter;
