import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route } from 'rsf-router';
// to reduce code, you can use the following
// import { default as Router, Route } from 'rsf-router/lib/browser-router';

import MainLayout from './view/layout/main';

const HomeView = React.lazy(() => import('./view/main/home'));
const AboutView = React.lazy(() => import('./view/main/about'));
const TopicsView = React.lazy(() => import('./view/main/topics'));
const NotFound = React.lazy(() => import('./view/not-found'));

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <MainLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Route path="/main/home" component={HomeView} index />
            <Route path="/main/about" component={AboutView} />
            <Route path="/main/topics" component={TopicsView} />
            <Route component={NotFound} />
          </Suspense>
        </MainLayout>
      </Router>
    );
  }
}
