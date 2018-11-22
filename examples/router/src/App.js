import React from 'react';
import { BrowserRouter, Route } from 'rsf-router';

import IndexView from './view/index';
import TestView from './view/test';
import DemoView from './view/demo';

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path="/main/index" component={IndexView} />
          <Route path="/main/test" component={TestView} />
          <Route path="/main/demo" component={DemoView} />
        </div>
      </BrowserRouter>
    );
  }
}
