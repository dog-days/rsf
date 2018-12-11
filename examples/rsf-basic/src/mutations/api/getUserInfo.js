import { createHttpRequestMutation } from 'rsf';

import axios from '../../utils/axios';

const url = 'user-info.json';

//直接使用 url 当做 mutation namespace
export const namespace = url;

export default createHttpRequestMutation({
  namespace,
  initialState: {
    data: {},
  },
  request: async ({ payload }, { delay }) => {
    await delay(1000);
    return axios.get(url, { params: payload }).then(response => {
      const {
        data: { data },
      } = response;
      return {
        data,
      };
    });
  },
});
