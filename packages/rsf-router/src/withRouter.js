import React from 'react';
import PropTypes from 'prop-types';

export default function withRouter(Component) {
  class C extends React.Component {
    static contextTypes = {
      history: PropTypes.object,
    };

    render() {
      const { history } = this.context;
      let routerProps = {};
      if (history) {
        const { location, match } = history;
        routerProps = {
          history,
          location,
          match,
        };
      }
      return <Component {...this.props} {...routerProps} />;
    }
  }
  C.displayName = `withRouter(${Component.displayName || Component.name})`;
  return C;
}
