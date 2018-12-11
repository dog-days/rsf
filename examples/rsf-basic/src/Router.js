import React from 'react';
import { default as RsfRouter, Route } from 'rsf-router/lib/browser-router';
import PathToRegexpMatchPath from 'rsf-router/lib/path-to-regexp-match-path';

import MainLayout from './view/layout/main';
import Home from './view/Home';
import PersonalDetail from './view/PersonalDetail';
import NotFound from './view/not-found';

export default class Router extends React.Component {
  render() {
    return (
      <PathToRegexpMatchPath>
        <RsfRouter>
          <MainLayout>
            <Route path="/" exact component={Home} />
            <Route
              path="/personal-detail/:id"
              exact
              component={PersonalDetail}
            />
            <Route component={NotFound} />
          </MainLayout>
        </RsfRouter>
      </PathToRegexpMatchPath>
    );
  }
}
