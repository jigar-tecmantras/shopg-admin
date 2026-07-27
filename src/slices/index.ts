import {combineReducers} from 'redux';

// Front
import LayoutReducer from './layouts/reducer';

// Authentication
import LoginReducer from './auth/login/reducer';
import AccountReducer from './auth/register/reducer';
import ForgetPasswordReducer from './auth/forgetpwd/reducer';
import ProfileReducer from './auth/profile/reducer';
import DeliveryPersonSlice from './deliveryPerson/reducer';
import OrderStatusSlice from './orderStatus/reducer';
import currentLocationSlice from './location/reducer';
import statusChangeSlice from './statusChange/reducer';
import DeleteProductSlice from './multipleDelete/reducer';

const rootReducer = combineReducers({
  Layout: LayoutReducer,
  Login: LoginReducer,
  Account: AccountReducer,
  ForgetPassword: ForgetPasswordReducer,
  Profile: ProfileReducer,
  DeliverPerson: DeliveryPersonSlice,
  OrderStatus: OrderStatusSlice,
  currentLocation: currentLocationSlice,
  statusChange: statusChangeSlice,
  SelectedDeletes: DeleteProductSlice,
});

export default rootReducer;
