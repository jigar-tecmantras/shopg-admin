// import {useSelector} from 'react-redux';
// import {setCurrentLocation} from 'slices/location/reducer';

import {useSelector} from 'react-redux';

// export const handleCommonClick = (
//   link: string,
//   isFormDirty: boolean,
//   dispatch: any,
//   navigate: (path: string) => void,
// ): any => {
//   // Perform check (e.g., for unsaved form data)
//   const {isFormUpdate}: any = useSelector(state => state);
//   console.warn(isFormUpdate, 'isFormDirty----------');
//   if (isFormDirty) {
//     const confirmNavigate = window.confirm(
//       'You have unsaved changes. Do you really want to leave?',
//     );

//     if (confirmNavigate) {
//       // Dispatch the location to Redux
//       dispatch(setCurrentLocation(link));

//       // Navigate to the link if confirmed
//       navigate(link);
//     }
//   } else {
//     console.log('----------------------- no navigate');
//     // No unsaved changes, navigate directly
//     // dispatch(setCurrentLocation(link));
//     // navigate(link);
//   }
// };

export const handleCommonClick = (link: string): void => {
  const isFormUpdate: boolean = useSelector(
    (state: any) => state.currentLocation.isFormUpdate,
  );

  console.warn(isFormUpdate, 'isFormUpdate----------');
  if (isFormUpdate) {
    console.warn(isFormUpdate, 'isFormDirty');
    const confirmNavigate = window.confirm(
      'You have unsaved changes. Do you really want to leave? test',
    );

    if (confirmNavigate) {
      console.warn('----------------------- navigate', isFormUpdate);
      // Dispatch the location to Redux
      // dispatch(setCurrentLocation(link));

      // // Navigate to the link if confirmed
      // navigate(link);
    }
  } else {
    console.warn('----------------------- no navigate');
    // No unsaved changes, navigate directly
    // dispatch(setCurrentLocation(link));
    // navigate(link);
  }
};

// // Create the custom hook
// const handleCommonClick: any = () => {
//   // const dispatch = useDispatch();
//   // const navigate = useNavigate();

//   // Use useSelector inside the custom hook to get the required state
//   const isFormUpdate: boolean = useSelector(
//     (state: any) => state.location.isFormUpdate,
//   );
//   console.warn(isFormUpdate, 'isFormUpdate----------');
//   // Return a function to handle the common click
//   // const handleCommonClick = (link: string, isFormDirty: boolean): void => {
//   //   if (isFormDirty) {
//   //     const confirmNavigate = window.confirm(
//   //       'You have unsaved changes. Do you really want to leave? test',
//   //     );

//   //     if (confirmNavigate) {
//   //       console.warn('----------------------- navigate', isFormDirty);
//   //       // Dispatch the location to Redux
//   //       // dispatch(setCurrentLocation(link));

//   //       // // Navigate to the link if confirmed
//   //       // navigate(link);
//   //     }
//   //   } else {
//   //     console.warn('----------------------- no navigate');
//   //     // No unsaved changes, navigate directly
//   //     // dispatch(setCurrentLocation(link));
//   //     // navigate(link);
//   //   }
//   // };

//   // console.log(handleCommonClick);
//   // return handleCommonClick;
// };
// export default handleCommonClick;
