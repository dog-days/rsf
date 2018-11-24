import React from 'react';
import PropTypes from 'prop-types';

import { pathnameAdapter } from './utils/util';

export default class Warnings extends React.Component {
  render() {
    return false;
  }
}

//eslint-disable-next-line
if (__DEV__) {
  Warnings.contextTypes = {
    history: PropTypes.object,
    routesProps: PropTypes.array,
  };
  Warnings.prototype.throwError = function() {
    this.throwsIfPathExits();
    this.warningIfHasIndexPathButRedirected();
    this.throwsIfPathMatchMoreThanOne();
  };

  Warnings.prototype.componentDidMount = function() {
    this.throwError();
  };

  Warnings.prototype.componentDidUpdate = function() {
    this.throwError();
  };

  Warnings.prototype.throwsIfPathExits = function() {
    const { path } = this.props;
    const paths = [];
    const { routesProps } = this.context;
    routesProps.forEach((r, k) => {
      if (k !== routesProps.length - 1) {
        paths.push(r.path);
      }
    });
    if (!!~paths.indexOf(path)) {
      throw new Error(`Expected the route path "${path}" to be unique.`);
    }
  };

  Warnings.prototype.warningIfHasIndexPathButRedirected = function() {
    // <Route path="/test" index /> index 和 <Route path="/" index/> 冲突
    // 会访问 / 会从定向到 /test
    let { routesProps } = this.context;
    const indexsPath = [];
    routesProps.forEach(r => {
      const { index, path } = r;
      if (path === '/' || index) {
        indexsPath.push(path);
      }
    });
    if (indexsPath.length > 1) {
      let errStr = `Expected the only one index route path to be matched，but there are ${
        indexsPath.length
      } matched: \r\n`;
      indexsPath.forEach(indexPath => {
        if (indexPath === '/') {
          errStr += `<Route path="${indexPath}" component={View} />\r\n`;
        } else {
          errStr += `<Route path="${indexPath}" component={View} index />\r\n`;
        }
      });
      throw new Error(errStr);
    }
  };

  Warnings.prototype.throwsIfPathMatchMoreThanOne = function() {
    let {
      history: {
        location: { pathname },
      },
      routesProps,
    } = this.context;
    const matchs = [];
    pathname = pathnameAdapter(pathname, '/');
    routesProps.forEach((r, k) => {
      let { exact, path } = r;
      if (path !== undefined) {
        path = pathnameAdapter(path, '/');
        if (!exact && !!pathname.match(new RegExp(`^${path}`))) {
          matchs.push(pathnameAdapter(path));
        }
      }
    });
    if (matchs.length > 1) {
      let errStr = `Expected the only one route path to be matched，but there are ${
        matchs.length
      } matched: \r\n`;
      matchs.forEach(path => {
        errStr += `<Route path="${path}" component={View} />\r\n`;
      });
      errStr += 'Or you should use <Route /> below: \r\n';
      matchs.forEach(path => {
        errStr += `<Route path="${path}" exact />\r\n`;
      });
      throw new Error(errStr);
    }
  };
}
