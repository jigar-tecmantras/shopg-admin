// Include Both Helper File with needed methods
// action

import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';
import {setFlushState} from './reducer';

// Is user register successfull then direct plot user in redux.
export const SelectedDeletes =
  (statusValue: any, selectedIds: any[], type: string) =>
  async (dispatch: any) => {
    try {
      // console.log('selectedIds', selectedIds);
      const reqBody: any = {
        id: selectedIds,
      };
      ApiUtils.deleteProduct(reqBody)
        .then((data: any): any => {
          // console.log(data?.message);
          toast.success(data?.message);
          dispatch(setFlushState());
        })
        .catch((error: any) => {
          toast.error(error.message);
        });
    } catch (error) {
      // console.log(error);
    }
  };
