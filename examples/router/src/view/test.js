import React from 'react';
import PropTypes from 'prop-types';

export default class Index extends React.Component {
  static contextTypes = {
    routesProps: PropTypes.array.isRequired,
    history: PropTypes.object,
  };

  componentDidMount() {
    console.log('TestView mount');
  }

  render() {
    console.log('testView render');
    return <div>test view</div>;
  }
}
