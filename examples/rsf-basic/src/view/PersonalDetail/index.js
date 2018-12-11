import React from 'react';
import { connect } from 'react-redux';
import { Comment, Avatar, Tooltip, Skeleton } from 'antd';
import { reactAxiosCancelHOC } from 'rsf';
import moment from 'moment';

import { LOADINGFIELDNAME } from '../../lib/mutation-loading-plugin';
import { namespace as userInfoNamespace } from '../../mutations/api/getUserInfo';

class PersonalDetailView extends React.Component {
  static displayName = 'PersonalDetailView';

  dispatch = this.props.dispatch;

  componentDidMount() {
    this.dispatch({
      type: `${userInfoNamespace}/request`,
    });
  }

  renderParamsInfo() {
    return;
  }

  render() {
    const {
      userInfoData: {
        [LOADINGFIELDNAME]: loading,
        data: { firstName, comment = [] },
      },
    } = this.props;

    return (
      <Skeleton loading={loading} active avatar>
        {comment.map((c, k) => {
          return (
            <Comment
              // actions={actions}
              key={k}
              // eslint-disable-next-line
              author={<a>{firstName}</a>}
              avatar={
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  alt="Han Solo"
                />
              }
              content={<p>{c.content}</p>}
              datetime={
                <Tooltip
                  title={moment(c.created * 1000).format('YYYY-MM-DD HH:mm:ss')}
                >
                  <span>{moment(c.created * 1000).fromNow()}</span>
                </Tooltip>
              }
            />
          );
        })}
      </Skeleton>
    );
  }
}

const ReduxComponent = connect(state => {
  return {
    userInfoData: state[userInfoNamespace],
  };
})(PersonalDetailView);
const WithAxiosCancelComponent = reactAxiosCancelHOC([userInfoNamespace]);

export default WithAxiosCancelComponent(ReduxComponent);
