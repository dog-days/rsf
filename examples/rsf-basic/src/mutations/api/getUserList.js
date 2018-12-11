import { createHttpRequestMutation } from 'rsf';

import axios from '../../utils/axios';

const url = 'user-list.json';

//直接使用 url 当做 mutation namespace
export const namespace = url;

export default createHttpRequestMutation({
  namespace,
  initialState: {
    data: undefined,
  },
  request: async ({ payload }, { delay }) => {
    // 延时 1 秒
    await delay(1000);
    return axios.get(url, { params: payload }).then(response => {
      const {
        data: { data },
      } = response;
      return {
        data: dataAdapter(data),
      };
    });
  },
});

function dataAdapter(data) {
  // antd table 需要每条数据都设置唯一 key 值
  return data.map((d, k) => {
    d.key = k;
    return d;
  });
}
