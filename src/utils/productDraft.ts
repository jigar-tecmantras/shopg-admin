const PRODUCT_CREATE_KEY = "product_create_draft";
const PRODUCT_OPTION_KEY = "product_option_draft";

export const saveDraft = (key:string, data:any) => {
  localStorage.setItem(key, JSON.stringify(data));
};


export const getDraft = (key:string) => {
  const data = localStorage.getItem(key);

  return data ? JSON.parse(data) : null;
};


export const clearDraft = (key:string) => {
  localStorage.removeItem(key);
};