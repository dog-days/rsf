import React from 'react';
import { connect } from 'react-redux';
import { Table, Tag, Icon } from 'antd';
import { Link } from 'rsf-router/lib/browser-router';
import { reactAxiosCancelHOC, LOADINGNAMESPACE } from 'rsf';

import { namespace as userListNamespace } from '../../mutations/api/getUserList';

const { Column } = Table;

class HomeView extends React.Component {
  static displayName = 'HomeView';

  dispatch = this.props.dispatch;

  componentDidMount() {
    this.dispatch({
      type: `${userListNamespace}/request`,
    });
  }

  renderParamsInfo() {
    return;
  }

  render() {
    const {
      userListData: { data },
      userListloading,
    } = this.props;
    return (
      <Table dataSource={data} loading={userListloading}>
        <Column title="First Name" dataIndex="firstName" key="firstName" />
        <Column title="Last Name" dataIndex="lastName" key="lastName" />
        <Column title="Age" dataIndex="age" key="age" />
        <Column title="Address" dataIndex="address" key="address" />
        <Column
          title="Tags"
          dataIndex="tags"
          key="tags"
          render={tags => (
            <span>
              {tags.map(tag => (
                <Tag color="blue" key={tag}>
                  {tag}
                </Tag>
              ))}
            </span>
          )}
        />
        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <Link to={`/personal-detail/${record.id}`}>
              <Icon type="eye-o" />
            </Link>
          )}
        />
      </Table>
    );
  }
}

const ReduxComponent = connect(state => {
  return {
    userListData: state[userListNamespace],
    userListloading: state[LOADINGNAMESPACE][userListNamespace],
  };
})(HomeView);
const WithAxiosCancelComponent = reactAxiosCancelHOC([userListNamespace]);

export default WithAxiosCancelComponent(ReduxComponent);
