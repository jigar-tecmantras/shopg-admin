import axios, {type AxiosError} from 'axios';
import Cookies from 'js-cookie';
import {BASE_URL} from 'utils/AppConfig';
import {variables} from 'utils/constant';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  async (config: any) => {
    const authDetails = Cookies.get(variables.ecommerce_admin);
    if (
      config.url === '/api/common/create-product' ||
      config.url === '/api/common/create-option-value' ||
      config.url === '/api/common/update-option-value' ||
      config.url === '/api/common/create-product-option' ||
      config.url === '/api/common/update-product-option' ||
      config.url === 'api/common/create-category' ||
      config.url === 'api/common/update-category' ||
      config.url === '/api/common/update-delivery-person' ||
      config.url === '/api/common/create-delivery-person' ||
      config.url === '/api/common/create-product-discount-by-excel' ||
      config.url === '/api/common/create-brand' ||
      config.url === '/api/common/update-brand' 
    ) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    if (authDetails != null) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${authDetails}`,
      };
    }
    const loader: HTMLElement | null = document.getElementById('cover-spin');
    if (loader !== null) {
      loader.style.display = 'block';
    }

    return config;
  },
  async (error: AxiosError) => {
    // Do something with request error
    return await Promise.reject(error);
  },
);

// Add a response interceptor
instance.interceptors.response.use(
  response => {
    const loader: HTMLElement | null = document.getElementById('cover-spin');
    if (loader !== null) {
      loader.style.display = 'none';
    }

    // Any status code that lies within the range of 2xx causes this function to trigger
    // Do something with response data
    return response;
  },
  async (error: AxiosError) => {
    if (error?.response?.status === 401 || error?.response?.status === 405) {
      Cookies.remove(variables.ecommerce_admin);
      window.location.href = '/';
    }

    const loader: HTMLElement | null = document.getElementById('cover-spin');
    if (loader !== null) {
      loader.style.display = 'none';
    }

    // Any status codes that fall outside the range of 2xx cause this function to trigger
    // Do something with response error
    return await Promise.reject(error);
  },
);

export default instance;
