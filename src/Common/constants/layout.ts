enum LAYOUT_TYPES {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  TWOCOLUMN = 'twocolumn',
}

enum LAYOUT_MODE_TYPES {
  LIGHTMODE = 'light',
  DARKMODE = 'dark',
}

enum LAYOUT_SIDEBAR_TYPES {
  LIGHT = 'light',
  DARK = 'dark',
  GRADIENT = 'gradient',
  GRADIENT_2 = 'gradient-2',
  GRADIENT_3 = 'gradient-3',
  GRADIENT_4 = 'gradient-4',
}

enum LAYOUT_WIDTH_TYPES {
  FLUID = 'lg',
  BOXED = 'boxed',
}

enum LAYOUT_POSITION_TYPES {
  FIXED = 'fixed',
  SCROLLABLE = 'scrollable',
}

enum LAYOUT_TOPBAR_THEME_TYPES {
  LIGHT = 'light',
  DARK = 'dark',
  BRAND = 'brand',
}

enum LEFT_SIDEBAR_SIZE_TYPES {
  DEFAULT = 'lg',
  COMPACT = 'md',
  SMALLICON = 'sm',
  SMALLHOVER = 'sm-hover',
}

enum LEFT_SIDEBAR_VIEW_TYPES {
  DEFAULT = 'default',
  DETACHED = 'detached',
}

enum LEFT_SIDEBAR_IMAGE_TYPES {
  NONE = 'none',
  IMG1 = 'img-1',
  IMG2 = 'img-2',
  IMG3 = 'img-3',
  IMG4 = 'img-4',
}

enum PERLOADER_TYPES {
  ENABLE = 'enable',
  DISABLE = 'disable',
}

enum BODY_IMAGE_TYPES {
  NONE = 'none',
  IMG1 = 'img-1',
  IMG2 = 'img-2',
  IMG3 = 'img-3',
}

enum DOCUMENT_TITLE {
  DASHBOARD_TITLE = 'Dashboard | Warehouse',
  UPDATE_PROFILE = 'Update Profile | Warehouse',
  CREATE_PRODUCT = 'Create Product | Warehouse',
  COUPONS = 'Coupons | Warehouse',
  BRANDS = 'Brands | Warehouse',
  BANNERS = 'Banners | Warehouse',

  INVOICE_LIST = 'Invoice List | Warehouse',
  CREATE_INVOICE = 'Create Invoice | Warehouse',
  INVOICE_DETAILS = 'Invoice Details | Warehouse',
  LOG_OUT = 'Log Out | Warehouse',
  CATEGORIES = 'Categories | Warehouse',
  HSN_CODE = '  GST Tax | Warehouse ',
  PRODUCT_LIST = 'Product List | Warehouse',
  LOGIN_PAGE = 'Login | Warehouse',
  FORGOT_PASSWORD = 'Forgot Password | Warehouse',
  CHANGE_PASSWORD = 'Change Password | Warehouse',
  OPTION_LISTING = 'Options List | Warehouse',
  PAYMENT_TRACKING = 'Payment Tracking | Warehouse',
  STOCK_MANAGEMENT = 'Stock Management | Warehouse',
  delivery_LIST = 'Delivery Management | warehouse',
  SUBSCRIBERS_LIST = 'Subscribers | Warehouse',
}

enum ORDER_STATUS {
  PENDING = 11,
  ACCEPTED = 12,
  DELIVERY_PERSON_ASSIGN = 13,
  DELIVERED = 15,
  ON_THE_WAY = 14,
  CANCELED = 16,
}

enum ORDER_STATUS_VALUE {
  PENDING = 'PENDING',
  ACCEPTED = 'Accepted',
  DELIVERY_PERSON_ASSIGN = '13',
  DELIVERED = 'DELIVERED',
  ON_THE_WAY = 'Pickup Scheduled',
  CANCELED = 'CANCELED',
  SHIPPED = 'Shipped',
  READY_TO_SHIP = 'Ready To Ship',
}
enum DELIVERY_PERSON_STATUS {
  ACTIVE = 1,
  INACTIVE = 2,
}

export {
  LAYOUT_TYPES,
  LAYOUT_MODE_TYPES,
  LAYOUT_SIDEBAR_TYPES,
  LAYOUT_WIDTH_TYPES,
  LAYOUT_POSITION_TYPES,
  LAYOUT_TOPBAR_THEME_TYPES,
  LEFT_SIDEBAR_SIZE_TYPES,
  LEFT_SIDEBAR_VIEW_TYPES,
  LEFT_SIDEBAR_IMAGE_TYPES,
  PERLOADER_TYPES,
  BODY_IMAGE_TYPES,
  DOCUMENT_TITLE,
  ORDER_STATUS,
  ORDER_STATUS_VALUE,
  DELIVERY_PERSON_STATUS,
};
