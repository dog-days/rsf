import React from 'react';

export default class Index extends React.Component {
  componentDidMount() {
    console.log('Home mounted');
  }
  renderParamsInfo() {
    return;
  }
  render() {
    return <h2>Home</h2>;
  }
}
