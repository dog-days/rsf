import React from 'react';
import RsfApp from 'rsf';

// mutaion 不建议使用异步载入（根据页面）
// 否则会导致一些问题
import mutations from './mutations';
import loadingPlugin from './lib/mutation-loading-plugin';
import Router from './Router';

export default class App extends React.Component {
  render() {
    return (
      <RsfApp mutations={mutations} plugins={[loadingPlugin]}>
        <Router />
      </RsfApp>
    );
  }
}
