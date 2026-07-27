export const variables = {
  ecommerce_admin: 'ecommerce_warehouse',
  DISCOUNT_ACTIVE_STATUS_ID: 35,
  DISCOUNT_ACTIVE_IN_STATUS_ID: 36,
  DISCOUNT_ACTIVE_STATUS: 'Active',
  DISCOUNT_INACTIVE_STATUS: 'In active',

  WAREHOUSE_USERNAME: 'ware_username',

  PRODUCT_ACTIVE_STATUS: 'Active',
  PRODUCT_INACTIVE_STATUS: 'Inactive',
  PRODUCT_ACTIVE_STATUS_ID: 9,
  PRODUCT_INACTIVE_STATUS_ID: 10,

  PRODUCT_OPTION_ACTIVE_STATUS_ID: 39,
  PRODUCT_OPTION_INACTIVE_STATUS_ID: 40,

  CATEGORY_ACTIVE_STATUS: 'Active',
  CATEGORY_INACTIVE_STATUS: 'In Active',
  CATEGORY_ACTIVE_STATUS_ID: 3,
  CATEGORY_INACTIVE_STATUS_ID: 4,

  GIFT_ACTIVE_STATUS: 'true',
  GIFT_INACTIVE_STATUS: 'false',
  GIFT_ACTIVE_STATUS_ID: 23,
  GIFT_INACTIVE_STATUS_ID: 24,

  OPTION_ACTIVE_STATUS: 'Active',
  OPTION_APPROVE_STATUS: 'Approve',
  OPTION_ACTIVE_STATUS_ID: 5,
  OPTION_APPROVE_STATUS_ID: 3,

  COUPON_ACTIVE_STATUS: 'Active',
  COUPON_INACTIVE_STATUS: 'In active',
  COUPON_ACTIVE_STATUS_ID: 28,

  DELIVERY_PENDING_STATUS: 'Pending',
  DELIVERY_ACCEPTED_STATUS: 'Accepted',
  DELIVERY_PENDING_STATUS_ID: 17,
  DELIVERY_ACCEPTED_STATUS_ID: 18,
};
export const regex = {
  passwordRegex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
};

export const productTabKeys = {
  DATA: 'data',
  OPTIONS: 'options',
};
export const editorConfiguration = {
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    'bulletedList',
    'numberedList',
    'blockQuote',
    '|',
    'insertTable', // Adds table functionality
    'tableColumn', // Manage table columns
    'tableRow', // Manage table rows
    'mergeTableCells', // Merge cells
    '|',
    'undo',
    'redo',
  ], // Removed 'imageUpload' and 'view' related options
};
