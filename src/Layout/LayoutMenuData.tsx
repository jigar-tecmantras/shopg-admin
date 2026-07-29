import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {setisFormUpdate} from 'slices/location/reducer';

const Navdata = (): React.JSX.Element => {
  // state data
  const [isEcommerce, setIsEcommerce] = useState(false);
  const [isOrder, setIsOrder] = useState(false);
  const [isInvoice, setIsInvoice] = useState(false);
  const [isShipping, setIsShipping] = useState(false);
  const [isLocalization, setIsLocalization] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isCoupon, setIsCoupon] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isFormUpdate: boolean = useSelector(
    (state: any) => state.currentLocation.isFormUpdate,
  );

  const [iscurrentState, setIscurrentState] = useState('Dashboard');
  function updateIconSidebar(e: any): void {
    if (e?.target?.getAttribute('subitems') != null) {
      const ul: any = document.getElementById('two-column-menu');
      const iconItems: any = ul.querySelectorAll('.nav-item.active');
      const activeIconItems = [...iconItems];
      activeIconItems.forEach(item => {
        item.classList.remove('active');
      });
    }
  }

  // const testclick: any = (link: string) => {
  //   if (isFormUpdate) {
  //     console.warn(isFormUpdate, 'isFormDirty');
  //     const confirmNavigate = window.confirm(
  //       'You have unsaved changes. Do you really want to leave? test',
  //     );

  //     if (confirmNavigate) {
  //       console.warn('----------------------- navigate', isFormUpdate);
  //       // Dispatch the location to Redux
  //       dispatch(setCurrentLocation(link));

  //       // // Navigate to the link if confirmed
  //       navigate(link);
  //     }
  //   } else {
  //     console.warn('----------------------- cancel navigate');
  //     return false;
  //   }
  // };
  const handlePageNavigation: any = (e: any, path: string) => {
    e.preventDefault();
    if (isFormUpdate) {
      const userConfirmed = window.confirm(
        'You have unsaved changes. Do you really want to leave?',
      );
      if (!userConfirmed) {
        return; // Stay on the current page
      }
      dispatch(setisFormUpdate(false));
    }

    dispatch(setisFormUpdate(false));
    navigate(path); // Proceed with navigation
  };

  useEffect(() => {
    document.body.classList.remove('twocolumn-panel');
    if (iscurrentState !== 'Ecommerce') {
      setIsEcommerce(false);
    }
    if (iscurrentState !== 'Orders') {
      setIsOrder(false);
    }
    if (iscurrentState !== 'Coupon') {
      setIsCoupon(false);
    }

    if (iscurrentState !== 'Invoice') {
      setIsInvoice(false);
    }
    if (iscurrentState !== 'Shipping') {
      setIsShipping(false);
    }
    if (iscurrentState !== 'Localization') {
      setIsLocalization(false);
    }
    if (iscurrentState !== 'Auth') {
      setIsAuth(false);
    }
  }, [
    iscurrentState,
    isEcommerce,
    isOrder,
    isCoupon,
    isInvoice,
    isShipping,
    isLocalization,
    isAuth,
  ]);

  const menuItems: any = [
    {
      label: 'Menu',
      isHeader: true,
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'bi bi-speedometer2',
      link: '/dashboard',
      badgeName: 'Hot',
      badgeColor: 'danger',
      click: (e: any) => {
        e.preventDefault();
        handlePageNavigation(e, '/dashboard');
      },
    },
    {
      id: 'userlist',
      label: 'User List',
      icon: 'bi bi-person-bounding-box',
      link: '/user-list',
      click: (e: any) => {
        e.preventDefault();
        handlePageNavigation(e, '/user-list');
      },
    },
    {
      id: 'products',
      label: 'Products',
      icon: 'bi bi-box-seam',
      link: '/product',
      click: function (e: any) {
        e.preventDefault();
        setIsEcommerce(!isEcommerce);
        setIscurrentState('Ecommerce');
        updateIconSidebar(e);
      },
      stateVariables: isEcommerce,
      subItems: [
        {
          id: 'listview',
          label: 'Products',
          link: '/products',
          parentId: 'products',
          click: (e: any) => {
            e.preventDefault();
            handlePageNavigation(e, '/products');
          },
        },
        {
          id: 'categories',
          label: 'Category',
          link: '/categories',
          parentId: 'products',
          click: (e: any) => {
            handlePageNavigation(e, '/categories');
          },
        },
        {
          id: 'brands',
          label: 'Brands',
          link: '/brands',
          parentId: 'brands',
          click: (e: any) => {
            handlePageNavigation(e, '/brands');
          },
        },
        {
          id: 'options',
          label: 'Options',
          link: '/options',
          parentId: 'products',
          click: (e: any) => {
            handlePageNavigation(e, '/options');
          },
        },
      ],
    },
    {
      id: 'GST Tax',
      label: 'GST Tax',
      icon: 'bi bi-tag',
      link: '/gstInfo',
      click: (e: any) => {
        e.preventDefault();
        handlePageNavigation(e, '/gstInfo');
      },
    },
    {
      id: 'Subscribers',
      label: 'Email Subscribers',
      icon: 'bi bi-people',
      link: '/subscribers',
      click: (e: any) => {
        e.preventDefault();
        handlePageNavigation(e, '/subscribers');
      },
    },
    {
      id: 'order',
      label: 'Orders',
      icon: 'bi bi-cart4',
      link: '/order-list',
      click: (e: any) => {
        e.preventDefault();
        handlePageNavigation(e, '/order-list');
      },
    },
    // {
    //   id: 'invoice',
    //   label: 'Invoice',
    //   icon: 'bi bi-archive',
    //   link: '/invoice-list',
    // },
    {
      id: 'coupons',
      label: 'Coupon',
      icon: 'bi bi-tag',
      link: '/coupons',
      click: function (e: any) {
        e.preventDefault();
        setIsCoupon(!isCoupon);
        setIscurrentState('Coupon');
        updateIconSidebar(e);
      },
      stateVariables: isCoupon,
      subItems: [
        {
          id: 'listview',
          label: 'Coupons',
          link: '/coupon',
          parentId: 'coupons',
          click: (e: any) => {
            handlePageNavigation(e, '/coupon');
          },
        },
        {
          id: 'analysis',
          label: 'Analysis',
          link: '/analysis',
          parentId: 'coupons',
          click: (e: any) => {
            handlePageNavigation(e, '/analysis');
          },
        },
      ],
    },
    {
      id: 'reviewsAndRatings',
      label: 'Reviews & Ratings',
      icon: 'bi bi-star',
      link: '/reviews-ratings',
      click: (e: any) => {
        handlePageNavigation(e, '/reviews-ratings');
      },
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: 'bi bi-heart',
      link: '/wishlist',
      click: (e: any) => {
        e.preventDefault();
        handlePageNavigation(e, '/wishlist');
      },
    },
    {
      id: 'areaSpecificSales',
      label: 'Area Specific Sales',
      icon: 'bi bi-tag',
      link: '/area-specific-sales',
      click: (e: any) => {
        e.preventDefault();
        handlePageNavigation(e, '/area-specific-sales');
      },
    },
    {
      id: 'stockmanagement',
      label: 'Stock Management',
      icon: 'bi bi-box',
      link: '/stock-management',
      click: (e: any) => {
        handlePageNavigation(e, '/stock-management');
      },
    },
    {
      id: 'Discounts',
      label: 'Price Up & Down',
      icon: 'bi bi-tag',
      link: '/discount',
      click: (e: any) => {
        handlePageNavigation(e, '/discount');
      },
    },
    {
      id: 'policy',
      label: 'Policy Mangement',
      icon: 'bi bi-tag',
      link: '/policy-list',
      click: (e: any) => {
        handlePageNavigation(e, '/policy-list');
      },
    },
    {
      id: 'paymenttracking',
      label: 'Payment Tracking',
      icon: 'bi bi-currency-dollar',
      link: '/payment-tracking',
      click: (e: any) => {
        handlePageNavigation(e, '/payment-tracking');
      },
    },
    // {
    //   id: 'DeliveryManagement',
    //   label: 'Delivery Management',
    //   icon: 'bi bi-truck',
    //   link: '/delivery-management',
    //   click: (e: any) => {
    //     handlePageNavigation(e, '/delivery-management');
    //   },
    // },

    {
      id: 'banner',
      label: 'Banner',
      icon: 'bi bi-box',
      link: '/banner',
      click: (e: any) => {
        handlePageNavigation(e, '/banner');
      },
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
