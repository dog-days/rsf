import { LOADINGNAMESPACE } from 'redux-mutation-loading';

/**
 * axios cancel 高阶组件，根据 cancel urls ，组件销毁时取消相关请求。
 * @param {array} cancelUrls
 * @returns {class}
 */
function cancelDecorator(cancelUrls = []) {
  return component => {
    component.prototype.prev_componentWillUnmount =
      component.prototype.componentWillUnmount;
    component.prototype.componentWillUnmount = function() {
      this.prev_componentWillUnmount && this.prev_componentWillUnmount();
      const dispatch = this.props.dispatch || this.context.store.dispatch;
      if (!dispatch) {
        throw new Error(
          'Expected the dispatch method from redux, you should use react-redux `connect()`'
        );
      }
      cancelUrls.forEach(v => {
        dispatch({
          type: `${v}/cancelAxios`,
          // 不触发 loading 插件
          [LOADINGNAMESPACE]: false,
        });
      });
    };
    return component;
  };
}
export default cancelDecorator;
