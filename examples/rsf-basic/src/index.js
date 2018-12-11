import './polyfills';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

function render(dom) {
  ReactDOM.render(<App />, dom);
}
render(document.getElementById('root'));
