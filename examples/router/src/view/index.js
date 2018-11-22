import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'rsf-router';

export default class Index extends React.Component {
  static contextTypes = {
    routesProps: PropTypes.array.isRequired,
    history: PropTypes.object,
  };

  componentDidMount() {
    console.log('IndexView mount');
  }

  onClick = () => {
    this.forceUpdate();
  };

  render() {
    console.log('indexView render');
    // console.log(this.props);
    return (
      <div>
        index view
        <br />
        <button onClick={this.onClick}>forceUpdate indexView</button>
        <br />
        <Link to="/main/test">/main/test</Link>
        <br />
        <Link to="/main/demo">/main/demo</Link>
        <br />
        <Link to="/main/index">/main/index</Link>
        <br />
        <Link to="/main/index/222">/main/index/222</Link>
        <br />
        <Link to="/main/nomatch">/main/no-match</Link>
      </div>
    );
  }
}
