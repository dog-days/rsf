import React from 'react';

export default class Index extends React.Component {
  componentDidMount() {
    console.log('About mounted');
  }

  render() {
    console.log('About rendered');

    return <h2>About</h2>;
  }
}
