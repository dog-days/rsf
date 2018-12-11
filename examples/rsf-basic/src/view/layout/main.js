import React from 'react';
import { Menu } from 'antd';
import { Link, withRouter } from 'rsf-router/lib/browser-router';

import 'antd/dist/antd.css';
import './style.css';

class MainLayout extends React.Component {
  render() {
    return (
      <div className="main-layout">
        <Menu className="main-layout__menu" mode="horizontal" theme="dark">
          <Menu.Item key="home">
            <Link className="main-layout__menu-link" to="/">
              Home
            </Link>
          </Menu.Item>
        </Menu>
        <div className="main-layout__content">{this.props.children}</div>
      </div>
    );
  }
}

export default withRouter(MainLayout);
