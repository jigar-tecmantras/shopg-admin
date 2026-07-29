/* eslint-disable no-unexpected-multiline */
import {apiEndpoints} from 'utils/apis';
import api from './Index';

// Define the structure of an API Call
interface ApiCall {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  data?: any;
  params?: any;
  id?: number | string;
}
// Generic CRUD Function
const genericApiCall = async ({
  method,
  endpoint,
  data,
  params,
  id,
}: ApiCall): Promise<unknown> => {
  const url = id != null ? `${endpoint}?id=${id}` : endpoint;
  return await new Promise((resolve, reject) => {
    (api as any)
      [method.toLowerCase()](url, data, {params})
      .then((response: any) => {
        resolve(response.data);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

// Define individual calls using the new structure
const ApiUtils = {
  authLogin: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.LOGIN,
      data: params,
    }),

  verifyOTP: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.VERIFY_OTP,
      data: params,
    }),
  forgetPassword: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.FORGET_PASSWORD,
      data: params,
    }),
  resetPassword: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.RESET_PASSWORD,
      data: params,
    }),
  getProfile: async () =>
    await genericApiCall({
      method: 'GET',
      endpoint: apiEndpoints.GET_PROFILE,
    }),
  updateProfile: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.UPDATE_PROFILE,
      data: params,
    }),
  getOptionsList: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.GET_OPTIONS_LIST}${params}`,
    }),
  createOption: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.CREATE_OPTION,
      data: params,
    }),
  updateOption: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.UPDATE_OPTION,
      data: params,
    }),
  createOptionValue: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.CREATE_OPTION_VALUE,
      data: params,
    }),
  updateOptionValue: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.UPDATE_OPTION_VALUE,
      data: params,
    }),
  deleteOptionValue: async (params: any) =>
    await genericApiCall({
      method: 'DELETE',
      endpoint: `${apiEndpoints.DELETE_OPTION_VALUE}?id=${params}`,
      params,
    }),
  deleteOption: async (params: any) =>
    await genericApiCall({
      method: 'DELETE',
      endpoint: `${apiEndpoints.DELETE_OPTION}?${params}`,
      params,
    }),
  addProduct: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.CREATE_PRODUCT,
      data: params,
    }),
  updateProduct: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.UPDATE_PRODUCT,
      data: params,
    }),
  getProduct: async (productId: string) =>
    await genericApiCall({
      method: 'GET',
      endpoint: apiEndpoints.GET_PRODUCT + `/${productId}`,
    }),
  createCoupon: async (params: any) => {
    return await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.CREATE_COUPON,
      data: params,
    });
  },
  updateCoupon: async (params: any) => {
    return await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.UPDATE_COUPON,
      data: params,
    });
  },
  couponList: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.LIST_COUPON}?${params}`,
    }),
  deleteCoupon: async (params: any) =>
    await genericApiCall({
      method: 'DELETE',
      endpoint: `${apiEndpoints.DELETE_COUPON}?${params}`,
    }),

  createBrand: async (params: any) => {
    return await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.CREATE_BRAND,
      data: params,
    });
  },
  updateBrand: async (params: any) => {
    return await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.UPDATE_BRAND,
      data: params,
    });
  },
  brandList: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.LIST_BRAND}?${params}`,
    }),
  deletebrand: async (params: any) =>
    await genericApiCall({
      method: 'DELETE',
      endpoint: `${apiEndpoints.DELETE_BRAND}?${params}`,
    }),
  getBrand: async () =>
    await genericApiCall({
      method: 'GET',
      endpoint: apiEndpoints.GET_BRAND,
    }),
  getBrandByCategory: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.GET_BRAND_BY_CATEGORY}?id=${params}`,
      params,
    }),
  bannersList: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.LIST_BANNERS}?${params}`,
    }),
  updateBanner: async (params: any) => {
    return await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.UPDATE_BANNERS,
      data: params,
    });
  },
  couponMediaType: async () =>
    await genericApiCall({
      method: 'GET',
      endpoint: apiEndpoints.GET_COUPON_MEDIA_TYPE,
    }),
  addProductOption: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.CREATE_PRODUCT_OPTION,
      data: params,
    }),
  editProductOption: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.UPDATE_PRODUCT_OPTION,
      data: params,
    }),
  deleteProductOption: async (params: any) =>
    await genericApiCall({
      method: 'DELETE',
      endpoint: apiEndpoints.DELETE_PRODUCT_OPTION,
      id: params,
    }),
  getProductOptionsById: async (optionId: string) =>
    await genericApiCall({
      method: 'GET',
      endpoint: apiEndpoints.GET_OPTION_VALUE_BY_ID + `&option_id=${optionId}`,
    }),
  getOptionsById: async (optionId: string) =>
    await genericApiCall({
      method: 'GET',
      endpoint: apiEndpoints.GET_OPTIONS_BY_ID + `/${optionId}`,
    }),
  getGstTax: async () =>
    await genericApiCall({
      method: 'GET',
      endpoint: apiEndpoints.GET_GST_TAX,
    }),
  getCategory: async () =>
    await genericApiCall({
      method: 'GET',
      endpoint: apiEndpoints.GET_CATEGORY,
    }),
  getOptions: async () =>
    await genericApiCall({
      method: 'GET',
      endpoint: apiEndpoints.GET_OPTIONS,
    }),
  getWeightLength: async () =>
    await genericApiCall({
      method: 'GET',
      endpoint: apiEndpoints.GET_WEIGHT_LENGTH,
    }),
  getOptionValue: async (optionId: string) =>
    await genericApiCall({
      method: 'GET',
      endpoint: apiEndpoints.GET_OPTION_VALUE + `&option_id=${optionId}`,
    }),
  getProductList: async (params: any) => {
    return await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.PRODUCT_LIST}${params}`,
    });
  },
  getProductOptionList: async (params: any) => {
    return await genericApiCall({
      method: 'POST',
      endpoint: `${apiEndpoints.PRODUCT_OPTION_LIST}`,
      data: params,
    });
  },
  getProductById: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.PRODUCT_LIST_BY_ID}/${params}`,
    }),
  deleteProduct: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.DELETE_PRODUCT,
      id: params,
    }),
  deleteMultipleProduct: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.DELETE_MULTIPLE_PRODUCT,
      data: params,
    }),
  addCategory: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.ADD_CATEGORY,
      data: params,
    }),
  getStatus: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.GET_STATUS}?${params}`,
      params,
    }),

  updateCategory: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.UPDATE_CATEGORY,
      data: params,
    }),
  getCategoryList: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.CATEGORY_LISTING}${params}`,
    }),
  deleteCategory: async (params: any) =>
    await genericApiCall({
      method: 'DELETE',
      endpoint: apiEndpoints.DELETE_CATEGORY,
      id: params,
    }),
  createHsn: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.CREATE_HSN,
      data: params,
    }),
  updateHsn: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.UPDATE_HSN,
      data: params,
    }),
  getHSNList: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.HSN_LISTING}${params}`,
    }),
  deleteHSN: async (params: any) =>
    await genericApiCall({
      method: 'DELETE',
      endpoint: apiEndpoints.HSN_DELETE,
      id: params,
    }),

  getSubscribersList: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.SUBSCRIBERS_LIST}${params}`,
    }),

  deleteSubscriber: async (params: any) =>
    await genericApiCall({
      method: 'DELETE',
      endpoint: apiEndpoints.DELETE_SUBSCRIBERS,
      id: params,
    }),
  ExportSubscribers: async () =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.EXPORT_SUBSCRIBERS}`,
    }),

  getOrderList: async (params: any) => {
    return await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.GET_ORDERLIST}${params}`,
    });
  },
  getPaymentTrackingList: async (params: any) => {
    return await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.GET_PAYMENT_TRACKING}${params}`,
    });
  },
  getProductStockList: async (params: any) => {
    return await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.GET_STOCK,
      data: params,
    });
  },
  getProductByCategoryId: async (params: any) => {
    return await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.GET_PRODUCT_BY_CATEGORY_ID,
      data: params,
    });
  },
  getOptionByProductById: async (params: any) => {
    return await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.GET_OPTION_BY_PRODUCT_ID,
      data: params,
    });
  },
  getOptionValueByOptionId: async (params: any) => {
    return await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.GET_OPTION_VALUE_BY_OPTION_ID,
      data: params,
    });
  },
  updateOrderStatus: async (params: any) => {
    return await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.UPDATE_ORDER_STATUS,
      data: params,
    });
  },
  getPolicyList: async (params: any) => {
    return await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.GET_POLICY_LIST}?${params}`,
    });
  },
  getRecentOrders: async () => {
    return await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.GET_ORDERLIST}?${`sort_direction=desc`}`,
    });
  },
  getDasbordData: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.GET_DASHBOARD_DATA}${params}`,
    }),
  getCouponAnalysisList: async (params: any) => {
    return await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.GET_COUPON_ANALYSIS}${params}`,
    });
  },
  getOrderCount: async (params: any = '') => {
    return await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.ORDER_COUNT}${params}`,
    });
  },
  getDeliveryPerson: async (params: any) => {
    return await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.GET_DELIVERY_PERSON}?${params}`,
    });
  },
  createDeliveryPerson: async (params: any) => {
    return await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.CREATE_DELIVERY_PERSON,
      data: params,
    });
  },
  updateDeliveryPerson: async (params: any) => {
    return await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.UPDATE_DELIVERY_PERSON,
      data: params,
    });
  },
  deleteDeliveryPerson: async (params: any) => {
    return await genericApiCall({
      method: 'DELETE',
      endpoint: `${apiEndpoints.DELETE_DELEVERY_PERSON}?${params}`,
    });
  },
  getDiscountList: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.GET_DISCOUNT}${params}`,
    }),
  createDiscount: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.CREATE_DISCOUNT,
      data: params,
    }),

  updateDiscount: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.UPDATE_DISCOUNT,
      data: params,
    }),
  deleteDiscount: async (params: any) =>
    await genericApiCall({
      method: 'DELETE',
      endpoint: apiEndpoints.DELETE_DISCOUNT,
      id: params,
    }),
  updateHeaderStatus: async (params: any) => {
    return await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.UPDATE_HEADER_STATUS,
      data: params,
    });
  },
  downloadSalesReport: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.GET_SALES_REPORT}?${params}`,
    }),
  assignDeliveryPerson: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.ASSIGN_DELIVERY_PERSON,
      data: params,
    }),
  getTeplates: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.GET_TEMPLATE}?${params}`,
    }),
  deleteTeplate: async (params: any) =>
    await genericApiCall({
      method: 'DELETE',
      endpoint: `${apiEndpoints.DELETE_TEMPLETE}?${params}`,
    }),
  createTeplate: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.CREATE_TEPLATE,
      data: params,
    }),
  updateTamplate: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.UPDATE_TEPLATE,
      data: params,
    }),
  updateProductStatus: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.UPDATE_PRODUCT_STATUS,
      data: params,
    }),
  priceComparision: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.PRICE_COMPARISION}?${params}`,
    }),
  updateCategoryStatus: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.UPDATE_CATEGORY_STATUS,
      data: params,
    }),
  cancelOrder: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.CANCEL_ORDER}${params}`,
    }),
  downloadShiprocketInvoice: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.DOWNLOAD_INVOICE}${params}`,
    }),
  shipmentTrackActivities: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.SHIPMENT_STATUS_TRACK}${params}`,
    }),
  shiprocketOrderUrl: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.SHIP_ORDER_URL}${params}`,
    }),

  ExportProductDiscount: async () =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.PRODCUT_DISCOUNT}`,
    }),
  // ExportProduct: async () =>
  //   await genericApiCall({
  //     method: 'GET',
  //     endpoint: `${apiEndpoints.EXPORT_PRODCUT}`,
  //   }),
  ExportProduct: async (data: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: `${apiEndpoints.EXPORT_PRODCUT}`,
      data,
    }),
  ExportCategory: async () =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.EXPORT_CATEGORY}`,
    }),
  ExportOrder: async () =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.EXPORT_ORDER}`,
    }),
  ExportBrand: async () =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.EXPORT_BRAND}`,
    }),
  ExportOption: async () =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.EXPORT_OPTION}`,
    }),
  ExportCoupon: async () =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.EXPORT_COUPON}`,
    }),
  ExportStock: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: `${apiEndpoints.EXPORT_STOCK}`,
      data: params,
    }),

  importDiscount: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: `${apiEndpoints.IMPORT_DISCOUNT}`,
      data: params,
    }),

  getCustomerList: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.GET_CUSTOMER_LIST}?${params}`,
    }),
  updateCustomerDetails: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.UPDATE_CUSTOMER,
      data: params,
    }),
  deleteCustomer: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.DELET_CUSTOMER,
      data: params,
    }),

  getWishlistedItem: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.GET_WISHLISTED_ITEM}?${params}`,
    }),
    
  getAreaSpecificSalesList: async (params: any) => {
    return await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.GET_AREA_SPECIFIC_SALES}${params}`,
    });
  },

  policyList: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.GET_POLICY_LIST}?${params}`,
    }),

  deletePolicy: async (params: any) =>
    await genericApiCall({
      method: 'DELETE',
      endpoint: `${apiEndpoints.DELETE_POLICY}?${params}`,
    }),
  
  addPolicy: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.ADD_POLICY,
      data: params,
    }),

  getSinglePolicy: async (params: any) =>
    await genericApiCall({
      method: 'GET',
      endpoint: `${apiEndpoints.GET_POLICY_LIST}?id=${params}`,
    }),
    
  updatePolicy: async (params: any) =>
    await genericApiCall({
      method: 'POST',
      endpoint: apiEndpoints.UPDATE_POLICY,
      data: params,
    }),
};

export default ApiUtils;
