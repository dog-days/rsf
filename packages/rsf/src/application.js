// import React from 'react';
import ReactDOM from 'react-dom';
import { createCompose } from './compose';

export default class Rsf {
  constructor() {
    this.middleware = [];
  }
  /**
   * Use the given middleware `fn`.
   * @param {Function} fn
   * @return {Application} self
   */
  use(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected the middleware to be a function.');
    }
    this.middleware.push(fn);
    return this;
  }
  /**
   * Return a react component
   * for ReactDOM to render.
   * @return {Function}
   */
  getComponent() {
    const compose = createCompose(next => {
      return new Promise(resolve => {
        resolve();
      });
    });
    const fn = compose(this.middleware);
    return fn();
  }
  listen(dom) {
    ReactDOM.render(this.getComponent(), dom);
  }
}
