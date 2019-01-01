import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { configCreateStore, applyPlugin } from 'redux-mutation';
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
      this.store = configCreateStore(
        applyPlugin(createLoadingPlugin(), ...plugins),
        options
      )(mutations, initialState, enhancer);
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
