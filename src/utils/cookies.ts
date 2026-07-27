import Cookies from 'js-cookie';
import {variables} from './constant';

interface CustomCookies {
  createCookies: (data: string, options?: Record<string, any>) => void;
  readCookies: () => string | undefined;
  deleteCookies: () => void;
}

export function useCustomCookies(): CustomCookies {
  const createCookies = (data: string, options?: Record<string, any>): void => {
    // Set the cookie with js-cookie
    // If options are provided, use them; otherwise, set the cookie without options
    if (options != null) {
      Cookies.set(variables.ecommerce_admin, data, options);
    } else {
      Cookies.set(variables.ecommerce_admin, data);
    }
  };

  const readCookies = (): string | undefined => {
    // Read the cookie with js-cookie
    return Cookies.get(variables.ecommerce_admin);
  };

  const deleteCookies = (): void => {
    // Delete the cookie with js-cookie
    Cookies.remove(variables.ecommerce_admin);
  };

  return {createCookies, readCookies, deleteCookies};
}
