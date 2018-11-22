import React from 'react';

import withRouter from './withRouter';

class RouterContext extends React.Component {
  static displayName = 'RouterContext';
  render() {
    const { children, ...rest } = this.props;
    return typeof children === 'function' ? children(rest) : children;
  }
}

export default withRouter(RouterContext);
