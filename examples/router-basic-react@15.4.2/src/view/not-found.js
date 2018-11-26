import React from 'react';

export default class Index extends React.Component {
  componentDidMount() {
    console.log('404 mounted');
  }

  render() {
    console.log('404 rendered');
    return <div>404 Not Found</div>;
  }
}
