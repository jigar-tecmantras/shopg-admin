import Dashboard from 'pages/Dashboard';

// Authentication

import Login from 'pages/Authentication/Login';
import ForgotPassword from 'pages/Authentication/ForgotPassword';
import CreateProduct from 'pages/Products/CreateProduct';
import ResetPassword from 'pages/Authentication/ResetPassword';
import Logout from 'pages/Authentication/Logout';

import Categories from 'Category/CatergoryListing';
import HsnComp from 'Hsn/HsnComp';
import Subscribers from 'pages/Subscribers/SubscribersList';
import ProductListing from 'pages/ProductListing';
import OptionForm from 'pages/Options/OptionForm';
import OptionsList from 'pages/Options/OptionsList';
// import Logout from 'pages/Authentication/Logout';

import OrdersList from 'pages/Orders/OrderList';
import OrderDetails from 'pages/Orders/OrderDetails';

import UpdateProfile from 'pages/Authentication/UpdateProfile';
import PaymentTrackingList from 'pages/Payment_Tracking';

import InvoiceDetails from 'pages/Invoice/InvoiceDetails';
import ReviewsAndRatings from 'pages/Reviews & Ratings';
import StockMangement from 'pages/StockManagement';
import Coupons from 'pages/Coupons';
import DiscountListing from 'Discounts/DiscountListing';
import policyList from 'pages/Policy';
import CouponAnalysis from 'pages/Coupons/Coupon-analysis';
import Reviews from 'pages/Reviews & Ratings/Reviews';
import DeliveryList from 'pages/DeliveryMangement/DeliveryList';
import Brands from 'pages/Brands';
import BannersList from 'pages/Banners';

import UserList from 'pages/UserList';

const authProtectedRoutes = [
  {path: '/dashboard', component: Dashboard},
  {path: '/update-profile', component: UpdateProfile},
  {path: '/products-create', component: CreateProduct},
  {path: '/products-edit', component: CreateProduct},
  {path: '/logout', component: Logout},

  {path: '/coupon', component: Coupons},
  {path: '/discount', component: DiscountListing},
  {path: '/order-invoice-detail/:id', component: InvoiceDetails},

  {path: '/categories', component: Categories},
  {path: '/brands', component: Brands},
  {path: '/gstInfo', component: HsnComp},
  {path: '/subscribers', component: Subscribers},
  {path: '/products', component: ProductListing},
  {path: '/options-form', component: OptionForm},
  {path: '/options', component: OptionsList},
  {path: '/options-form?optionId=', component: OptionForm},
  {path: '/stock-management', component: StockMangement},
  {path: '/order-list', component: OrdersList},
  {path: '/order-detail/:orderId', component: OrderDetails},
  {path: '/reviews-ratings', component: ReviewsAndRatings},
  {path: '/reviews-ratings/:id', component: Reviews},
  {path: '/payment-tracking', component: PaymentTrackingList},
  {path: '/policy-list', component: policyList},
  {path: '/analysis', component: CouponAnalysis},
  {path: '/delivery-management', component: DeliveryList},
  {path: '/banner', component: BannersList},

  {path: '/user-list', component: UserList},
];

const publicRoutes = [
  // Authentication
  {path: '/login', component: Login},
  {path: '/forgot-password', component: ForgotPassword},
  {path: '/reset-password/:token', component: ResetPassword},
];

export {authProtectedRoutes, publicRoutes};
