import React from 'react';
import PropTypes from 'prop-types';

import History from './react-history/BrowserHistory';
import Match from './Match';

export default class BrowserRouter extends React.Component {
  static displayName = 'BrowserRouter';
  static childContextTypes = {
    // 所有 <Route path="xx"/> props
    routesProps: PropTypes.array.isRequired,
  };

  getChildContext() {
    return { routesProps: this.routesProps };
  }

  routesProps = [];

  render() {
    const { children, ...rest } = this.props;
    return (
      <History {...rest}>
        <span>
          {children}
          <Match />
        </span>
      </History>
    );
  }
}
