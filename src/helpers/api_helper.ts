import axios, {type AxiosResponse, type AxiosRequestConfig} from 'axios';

axios.defaults.baseURL = '';
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.response.use(
  function (response) {
    return response.data ?? response;
  },
  async function (error) {
    let message;
    switch (error.status) {
      case 500:
        message = 'Internal Server Error';
        break;
      case 401:
        message = 'Invalid credentials';
        break;
      case 404:
        message = 'Sorry! The data you are looking for could not be found';
        break;
      default:
        message = error.message ?? error;
    }
    return await Promise.reject(message);
  },
);

const setAuthorization = (token: string): void => {
  axios.defaults.headers.common.Authorization = 'Bearer ' + token;
};

class APIClient {
  get = async (url: string, params?: any): Promise<AxiosResponse> => {
    let response;

    const paramKeys: string[] = [];

    if (params != null) {
      Object.keys(params).forEach(key => {
        paramKeys.push(`${key}=${params[key]}`);
      });

      const queryString = paramKeys.length > 0 ? paramKeys.join('&') : '';
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return await response;
  };

  create = async (url: string, data: any): Promise<AxiosResponse> => {
    return await axios.post(url, data);
  };

  update = async (url: string, data: any): Promise<AxiosResponse> => {
    return await axios.patch(url, data);
  };

  put = async (url: string, data: any): Promise<AxiosResponse> => {
    return await axios.put(url, data);
  };

  delete = async (
    url: string,
    config: AxiosRequestConfig,
  ): Promise<AxiosResponse> => {
    return await axios.delete(url, {...config});
  };
}

const getLoggedinUser = (): any | null => {
  const user: string | null = localStorage.getItem('authUser');
  if (user != null) {
    return JSON.parse(user);
  } else {
    return null;
  }
};

export {APIClient, setAuthorization, getLoggedinUser};
