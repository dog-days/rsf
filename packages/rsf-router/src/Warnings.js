import React from 'react';
import PropTypes from 'prop-types';

let Warnings;

//eslint-disable-next-line
if (__DEV__) {
  Warnings = class extends React.Component {
    static contextTypes = {
      history: PropTypes.object,
      routesProps: PropTypes.array,
    };
    throwError = function() {
      this.throwsIfPathExits();
      this.warningIfHasIndexPathButRedirected();
      this.throwsIfPathMatchMoreThanOne();
    };

    componentDidMount = function() {
      this.throwError();
    };

    componentDidUpdate = function() {
      this.throwError();
    };

    throwsIfPathExits = function() {
      const paths = [];
      const { routesProps } = this.context;
      routesProps.forEach((r, k) => {
        paths.push(r.path);
      });
      paths.forEach((p, k) => {
        paths.splice(k, 1);
        if (!!~paths.indexOf(p)) {
          throw new Error(`Expected the route path "${p}" to be unique.`);
        }
      });
    };

    warningIfHasIndexPathButRedirected = function() {
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

    throwsIfPathMatchMoreThanOne = function() {
      let { routesProps } = this.context;
      const matchs = [];
      routesProps.forEach(r => {
        let { getRouteMatchedResult, path } = r;
        if (path !== undefined) {
          if (getRouteMatchedResult()) {
            matchs.push(path);
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
    render() {
      return false;
    }
  };
}

export default Warnings;
