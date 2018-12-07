import React from 'react';
import { Link } from 'rsf-router';
// to reduce code, you can use the following
// import { Link } from 'rsf-router/lib/browser-router';

export default class Index extends React.Component {
  componentDidMount() {
    console.log('Topic mounted');
  }

  render() {
    console.log('Topic rendered');
    const { match } = this.props;
    const {
      params: { topicId },
    } = match;
    // We set the parameters on the url.
    return (
      <div>
        <h2>Topics</h2>
        <ul>
          <li>
            <Link to={`${match.url}/topic-id/rendering`}>
              Rendering with React
            </Link>
          </li>
          <li>
            <Link to={`${match.url}/topic-id/components`}>Components</Link>
          </li>
          <li>
            <Link to={`${match.url}/topic-id/props-v-state`}>
              Props v. State
            </Link>
          </li>
        </ul>

        <h3>{topicId ? topicId : 'Please select a topic.'}</h3>
      </div>
    );
  }
}
