import React from 'react';
import PropTypes from 'prop-types';

export default class Index extends React.Component {
  static contextTypes = {
    routesProps: PropTypes.array.isRequired,
    history: PropTypes.object,
  };

  componentDidMount() {
    console.log('DemoView mount');
  }

  render() {
    console.log('demoView render');
    return <div>demo view</div>;
  }
}
