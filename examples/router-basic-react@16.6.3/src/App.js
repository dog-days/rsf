import React from 'react';
import { BrowserRouter as Router, Route } from 'rsf-router';
// to reduce code, you can use the following
// import { default as Router, Route } from 'rsf-router/lib/browser-router';

import MainLayout from './view/layout/main';
import Homeiew from './view/main/home';
import AboutView from './view/main/about';
import TopicsView from './view/main/topics';
import NotFound from './view/not-found';

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <MainLayout>
          <Route path="/main/home" component={Homeiew} index />
          <Route path="/main/about" component={AboutView} />
          <Route path="/main/topics" component={TopicsView} />
          <Route component={NotFound} />
        </MainLayout>
      </Router>
    );
  }
}
