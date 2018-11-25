import React from 'react';
import PropTypes from 'prop-types';
import { createMemoryHistory as createHistory } from 'history';

import Router from './Router';

class MemoryRouter extends React.Component {
  static displayName = 'MemoryRouter';

  render() {
    const { children, ...rest } = this.props;
    return <Router history={createHistory(rest)}>{children}</Router>;
  }
}

// eslint-disable-next-line
if (__DEV__) {
  MemoryRouter.propTypes = {
    initialEntries: PropTypes.array,
    initialIndex: PropTypes.number,
    getUserConfirmation: PropTypes.func,
    keyLength: PropTypes.number,
    children: PropTypes.node,
  };

  MemoryRouter.prototype.componentDidMount = function() {
    if (this.props.history) {
      throw new Error(
        '<MemoryRouter> ignores the history prop. To use a custom history, ' +
          'use `import { Router }` instead of `import { MemoryRouter as Router }`.'
      );
    }
  };
}

export default MemoryRouter;

export * from './commonExports';
