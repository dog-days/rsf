import React from 'react';
import { connect } from 'react-redux';
import { Table, Tag, Icon } from 'antd';
import { Link } from 'rsf-router/lib/browser-router';
import { reactAxiosCancelHOC } from 'rsf';

import { LOADINGFIELDNAME } from '../../lib/mutation-loading-plugin';
import { namespace as getUserListNamespace } from '../../mutations/api/getUserList';

const { Column } = Table;

class HomeView extends React.Component {
  static displayName = 'HomeView';

  dispatch = this.props.dispatch;

  componentDidMount() {
    this.dispatch({
      type: `${getUserListNamespace}/request`,
    });
  }

  renderParamsInfo() {
    return;
  }

  render() {
    const {
      userListData: { [LOADINGFIELDNAME]: loading, data },
    } = this.props;
    return (
      <Table dataSource={data} loading={loading}>
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
    userListData: state[getUserListNamespace],
  };
})(HomeView);
const WithAxiosCancelComponent = reactAxiosCancelHOC([getUserListNamespace]);

export default WithAxiosCancelComponent(ReduxComponent);
