import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'rsf-router';
// to reduce code, you can use the following
// import { Link,withRouter } from 'rsf-router/lib/browser-router';

class MainLayout extends React.Component {
  static contextTypes = {
    routesProps: PropTypes.array.isRequired,
    history: PropTypes.object,
  };

  render() {
    const {
      match: {
        params: { layoutId, viewId },
      },
    } = this.props;
    return (
      <div>
        <ul>
          <li>
            <Link to="/main/home">Home</Link>
          </li>
          <li>
            <Link to="/main/about">About</Link>
          </li>
          <li>
            <Link to="/main/topics">Topics</Link>
          </li>
        </ul>
        <hr />
        {this.props.children}
        <br />
        <i>
          There are two fixed parameters here, which is different from the
          react-router. If you want to use the parameter way of the
          react-router, you can use path-to-regexp-match-path.
        </i>
        <br />
        <br />
        <i>The layout id is "{layoutId}".</i>
        <br />
        <i>The view id is "{viewId}".</i>
        <br />
        <br />
        <i>
          {`To avoid complexity, we are not allowed to use <Route /> in the
            route component.`}
        </i>
      </div>
    );
  }
}

export default withRouter(MainLayout);
