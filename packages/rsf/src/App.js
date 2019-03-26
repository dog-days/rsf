import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { applyMiddleware } from 'redux';
import { configCreateStore, applyPlugin, compose } from 'redux-mutation';
import createLoadingPlugin from 'redux-mutation-loading';

class App extends React.Component {
  static displayName = 'RsfApp';

  constructor(props) {
    super(props);
    const {
      store,
      plugins = [],
      options = {},
      mutations,
      initialState,
      enhancer,
    } = props;
    // 如果定义了 store 则使用新的 store
    // 一般都不需要新的 store
    this.store = store;
    if (!this.store && mutations) {
      // 没定义 props.store， 定义了 mutations。
      const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
      this.store = configCreateStore(
        applyPlugin(createLoadingPlugin(), ...plugins),
        options
      )(
        mutations,
        initialState,
        composeEnhancers(applyMiddleware(...enhancer))
      );
    }
  }

  static childContextTypes = {
    store: PropTypes.object,
  };

  getChildContext() {
    return { store: this.store };
  }

  render() {
    const { children } = this.props;
    if (!this.store) {
      return children;
    }
    return <Provider store={this.store}>{children}</Provider>;
  }
}

// eslint-disable-next-line
if (__DEV__) {
  App.propTypes = {
    store: PropTypes.object,
    options: PropTypes.object,
    plugins: PropTypes.array,
  };
}

export default App;
