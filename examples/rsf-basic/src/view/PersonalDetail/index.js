import React from 'react';
import { connect } from 'react-redux';
import { Comment, Avatar, Tooltip, Skeleton } from 'antd';
import { reactAxiosCancelHOC, LOADINGNAMESPACE } from 'rsf';
import moment from 'moment';

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
        data: { firstName, comment = [] },
      },
      userInfoloading,
    } = this.props;

    return (
      <Skeleton loading={userInfoloading} active avatar>
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
    userInfoloading: state[LOADINGNAMESPACE][userInfoNamespace],
  };
})(PersonalDetailView);
const WithAxiosCancelComponent = reactAxiosCancelHOC([userInfoNamespace]);

export default WithAxiosCancelComponent(ReduxComponent);
