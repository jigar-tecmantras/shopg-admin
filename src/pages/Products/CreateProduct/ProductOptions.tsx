/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/dot-notation */
import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, Col, Form, Row} from 'react-bootstrap';
import {useLocation, useNavigate} from 'react-router-dom';
import Dropzone from 'react-dropzone';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApiUtils from 'api/ApiUtils';
import {type OptionsType} from 'utils/types';
import TooltipWithInfoIcon from 'Common/InfoTool';
import ModalContainer from 'Common/ModalContainer';
import CreateOptionValue from './CreateOptionValue';
import {tooltipMessage} from 'utils/Tooltips';
import {setisFormUpdate} from 'slices/location/reducer';
import {useDispatch} from 'react-redux';
import {handleWheel} from 'utils/handleWheel';
import Swal from 'sweetalert2';
import {changeStatus} from 'slices/thunk';

import {variables} from 'utils/constant';

interface Product {
  image: string;
  name: string;
  price: string;
  mrp: string;
}

function ProductOptions({editOptionData}: any): React.JSX.Element {
  const [options, setOptions] = useState([]);
  const {pathname} = useLocation();
  const [optionValue, setOptionValue] = useState([]);
  const [weightClass, setWeightClass] = useState<OptionsType[]>([]);
  const [lengthClass, setLengthClass] = useState([]);
  const [weightDefualt, setweightDefualt] = useState();
  const [lengthDefualt, setlengthDefualt] = useState();

  const search = useLocation().search;
  const productId = new URLSearchParams(search).get('productId');
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null); // Specify the type for TypeScript
  const [modalOptionValue, setModalOptionValue] = useState(false);
  const [optionValueId, setOptionValueId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<any>();
  const [isFormDirty, setIsFormDirty] = useState(false);

  const handleInputChange: any = (event: any) => {
    setIsFormDirty(event.target.value.length > 0);
    dispatch(setisFormUpdate(event.target.value.length > 0));
  };
  useEffect(() => {
    const handleBeforeUnload: any = (event: BeforeUnloadEvent) => {
      if (isFormDirty) {
        const message =
          'You have unsaved changes, do you really want to leave?';
        event.returnValue = message; // Standard for most browsers
        return message; // For some older browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isFormDirty]);

  const productOptionValueSchema = Yup.object().shape({
    option_id: Yup.string().required('option is required'),
    product_id: Yup.string().required('product id is required'),
    product_option_value: Yup.array().of(
      Yup.object().shape({
        sku: Yup.string().required('SKU is required'),
        id: Yup.string().optional(),
        product_id: Yup.string().required('product id is required'),
        option_value_id: Yup.string()
          .required('option value is required')
          .test('not-disallowed', 'Invalid option value', value => {
            // Check if value is not NaN, null, blank, or 0
            return value !== null && value !== '' && value !== '0';
          }),

        //  &&!Number.isNaN(Number(value))
        // quantity: Yup.number()
        //   .positive('Quantity must be in positive')
        //   .required('quantity is required'),
        quantity: Yup.number()
          .required('Quantity is required')
          .typeError('Quantity is required'),
        price: Yup.number()
          .positive('Price must be in positive')
          .required('Price is required')
          .typeError('Price is required'),
        // special_price: Yup.number()
        //   .positive('Special Price must be in positive')
        //   .required('special price is required'),

        special_price: Yup.number()

          .required('Special Price required')
          .typeError('Special Price required'),
        minimum_quantity: Yup.number()
          .required('Minimum Quantity is required')
          .typeError('Minimum Quantity is required')
          .test(
            'is-positive-or-zero',
            'Minimum Quantity must be positive',
            function (value) {
              const {quantity} = this.parent;
              // Allow 0 only if both quantity and minimum_quantity are 0
              if (quantity === 0 && value === 0) {
                return true;
              }
              return value > 0; // Standard positive check
            },
          )
          .test(
            'is-greater',
            'Minimum Quantity must be less than Quantity',
            function (value) {
              const {quantity} = this.parent;
              if (quantity === 0 && value === 0) {
                return true;
              }
              return value !== undefined && value <= quantity;
            },
          ),

        weight: Yup.number()
          .positive('Weight must be in positive')
          .required('weight is required')
          .typeError('weight is required'),
        // weight_id: Yup.string()
        //   .required('weight class is required')
        //   .typeError('weight class is required'),
        length: Yup.number()
          .positive('Length must be in positive')
          .required('length is required')
          .typeError('length is required'),
        // length_id: Yup.string().required('length class is required'),
        width: Yup.number()
          .positive('Width must be in positive')
          .required('width is required')
          .typeError('width is required'),
        height: Yup.number()
          .positive('Height must be in positive')
          .required('height is required')
          .typeError('height is required'),
        disable_after_out_of_stock: Yup.string()
          .required('disable after out of stock is required')
          .typeError('disable after out of stock is required'),
        cost_to_company: Yup.number()
          .positive('Cost to company must be in positive')
          .required('cost to company is required')
          .typeError('cost to company is required')
          .test(
            'is-greater',
            'Cost to company must be less than Price',
            function (value) {
              const {price} = this.parent; // Access the value of the 'price' field
              return value !== undefined && value < price;
            },
          )
          .test(
            'is-greater',
            'Cost to company must be less than Sale Price',
            function (value) {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              const {special_price} = this.parent; // Access the value of the 'price' field
              return value !== undefined && value < special_price;
            },
          ),
        image: Yup.array().min(1, 'Image is required'),
      }),
    ),
  });
  const blankProductOptionsObj = {
    product_id: productId ?? '',
    option_value_id: '',
    quantity: '',
    price: '',
    special_price: '',
    minimum_quantity: '',
    weight: '',
    weight_id: weightDefualt ?? '',
    length: '',
    length_id: lengthDefualt ?? '',
    width: '',
    height: '',
    disable_after_out_of_stock: 'false',
    status_id: variables.PRODUCT_OPTION_ACTIVE_STATUS_ID,
    cost_to_company: '',
    product_tag: '',
    sku: '',
    is_new_arrival: '',
    image: [],
  };

  const formik: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      option_id: editOptionData?.option_id ?? '',
      product_id: productId ?? '',
      product_option_value:
        editOptionData?.product_option_value?.length > 0
          ? editOptionData?.product_option_value
          : [blankProductOptionsObj],
    },
    validationSchema: productOptionValueSchema,

    // onSubmit: async (values: any) => {
    //   try {
    //     if (editOptionData) {
    //       deleteIntialOption();
    //     }
    //     if (values?.product_option_value[0]['id']) {
    //       if (editOptionData) {
    //         const modifiedData = values?.product_option_value.map(
    //           (item: any, index: any) => {
    //             const modifiedImageArray = item.image
    //               .map((img: any) => {
    //                 if (img.type === 'delete' && img.id) {
    //                   return {
    //                     id: img['id'],
    //                     type: 'delete',
    //                   };
    //                 }

    //                 if (img.type === undefined && img.image instanceof File) {
    //                   return {
    //                     image: img.image,
    //                     sort_order: img['sort_order'],
    //                     id: -1,
    //                   };
    //                 }
    //                 if (
    //                   img.type === undefined &&
    //                   !(img.image instanceof File) &&
    //                   img['sort_order']
    //                 ) {
    //                   return {
    //                     id: img['id'],
    //                     sort_order: img['sort_order'],
    //                   };
    //                 }

    //                 // Add additional conditions if necessary
    //                 return undefined; // Return the original item if no conditions are met
    //               })
    //               .filter((a: any) => a); // Filter out undefined values

    //             return {
    //               ...item,
    //               image:
    //                 modifiedImageArray.length > 0
    //                   ? modifiedImageArray
    //                   : undefined,
    //             };
    //           },
    //         );

    //         values = {
    //           ...values,
    //           id: editOptionData.id,
    //           product_option_value: modifiedData,
    //         };
    //       }
    //     } else {
    //       const addNewData = values?.product_option_value.map((item: any) => {
    //         const newImageArray: Array<{
    //           image?: File | string;
    //           id?: number;
    //           type?: string;
    //         }> = [];
    //         const sortOrderArray: number[] = [];

    //         item.image.forEach((img: any) => {
    //           if (img.type === 'delete' && img.id) {
    //             newImageArray.push({id: img.id, type: 'delete'});
    //           } else if (img.type === undefined && img.image instanceof File) {
    //             newImageArray.push({image: img.image, id: -1});
    //           }

    //           // Assuming sort_order is part of the image object, adjust this condition accordingly
    //           if (img.sort_order) {
    //             sortOrderArray.push(img.sort_order);
    //           }
    //         });

    //         return {
    //           ...item,
    //           image: newImageArray
    //             .map(imgItem => imgItem.image)
    //             .filter(img => img !== undefined),
    //           sort_order: sortOrderArray,
    //         };
    //       });

    //       values = {
    //         ...values,
    //         // id: editOptionData.id,
    //         product_option_value: addNewData,
    //       };
    //     }
    //     // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    //     console.log(
    //       'value',
    //       editOptionData,
    //       values?.product_option_value[0]['id'],
    //     );
    //     const response: any =
    //       editOptionData && values?.product_option_value[0]['id']
    //         ? await ApiUtils.editProductOption({...values})
    //         : await ApiUtils.addProductOption({...values});

    //     toast.success(response.message);
    //     dispatch(setisFormUpdate(false));
    //     navigate('/products');
    //   } catch (error: any) {
    //     // Handle API call failure
    //     toast.error(error.response.data.message);
    //   }
    // },

    onSubmit: async (values: any) => {
      try {
        // if (editOptionData) {
        //   deleteIntialOption();
        // }
        // console.log('isFormDirty', isFormDirty);
        if (isFormDirty) {
          const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Looks like you made some changes. Want to save them now?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Save it!',
          });
          if (result.isConfirmed) {
            // Check if we are editing existing data
            if (values?.product_option_value[0]?.id) {
              if (editOptionData) {
                const modifiedData = values?.product_option_value.map(
                  (item: any) => {
                    // Track the number of deleted images
                    let deletedImages = 0;

                    const modifiedImageArray = item.image
                      .map((img: any, index: number) => {
                        // If image is marked for deletion, keep track and skip in sorting
                        if (img.type === 'delete' && img.id) {
                          deletedImages++;
                          return {id: img['id'], type: 'delete'};
                        }

                        // New image uploaded (binary file), assign sort_order properly
                        if (
                          img.type === undefined &&
                          img.image instanceof File
                        ) {
                          return {
                            image: img.image,
                            sort_order: index - deletedImages + 1,
                            id: -1,
                          }; // Adjust sort_order based on deletions and start from 1
                        }

                        // For existing images (not deleted and not new)
                        if (
                          img.type === undefined &&
                          !(img.image instanceof File) &&
                          img['sort_order']
                        ) {
                          return {id: img['id'], sort_order: img['sort_order']};
                        }

                        return undefined; // If no conditions match, skip
                      })
                      .filter((a: any) => a); // Filter out undefined values

                    // Return the modified image array with the correct sort order
                    return {
                      ...item,
                      image:
                        modifiedImageArray.length > 0
                          ? modifiedImageArray
                          : undefined,
                    };
                  },
                );

                values = {
                  ...values,
                  id: editOptionData.id,
                  product_option_value: modifiedData,
                };
              }
            } else {
              // Handle new data (no editing, just adding new options)
              const addNewData = values?.product_option_value.map(
                (item: any) => {
                  const newImageArray: Array<{
                    sort_order: number;
                    image?: File | string;
                    id?: number;
                    type?: string;
                  }> = [];
                  const sortOrderArray: number[] = [];

                  // Process each image
                  item.image.forEach((img: any, index: number) => {
                    if (img.type === 'delete' && img.id) {
                      // Mark image for deletion
                      newImageArray.push({
                        id: img.id,
                        type: 'delete',
                        sort_order: 0,
                      });
                    } else if (
                      img.type === undefined &&
                      img.image instanceof File
                    ) {
                      // New image upload (binary), we'll assign a sort_order later
                      newImageArray.push({
                        image: img.image,
                        id: -1,
                        sort_order: 0,
                      });
                    }

                    // Collect sort_order for existing images
                    if (img.sort_order) {
                      sortOrderArray.push(img.sort_order);
                    }
                  });

                  // Renumber the sort_order starting from 1
                  let sortOrderCount = 1;
                  newImageArray.forEach(imgItem => {
                    if (imgItem.image) {
                      imgItem.sort_order = sortOrderCount; // Assign sequential sort_order starting from 1
                      sortOrderCount++;
                    }
                  });

                  // Return the modified product option values with new images and their correct sort_order
                  return {
                    ...item,
                    image: newImageArray
                      .map(imgItem => imgItem.image)
                      .filter(img => img !== undefined),
                    sort_order: sortOrderArray,
                  };
                },
              );

              values = {...values, product_option_value: addNewData};
            }

            // console.log(
            //   'value',
            //   editOptionData,
            //   values?.product_option_value[0]?.id,
            // );

            // Call the API based on whether we are editing or adding a new product option
            const response: any =
              editOptionData && values?.product_option_value[0]?.id
                ? await ApiUtils.editProductOption({...values})
                : await ApiUtils.addProductOption({...values});

            toast.success(response.message);
            dispatch(setisFormUpdate(false));
            navigate('/products');
          }
        } else {
          // Check if we are editing existing data
          if (values?.product_option_value[0]?.id) {
            if (editOptionData) {
              const modifiedData = values?.product_option_value.map(
                (item: any) => {
                  // Track the number of deleted images
                  let deletedImages = 0;

                  const modifiedImageArray = item.image
                    .map((img: any, index: number) => {
                      // If image is marked for deletion, keep track and skip in sorting
                      if (img.type === 'delete' && img.id) {
                        deletedImages++;
                        return {id: img['id'], type: 'delete'};
                      }

                      // New image uploaded (binary file), assign sort_order properly
                      if (img.type === undefined && img.image instanceof File) {
                        return {
                          image: img.image,
                          sort_order: index - deletedImages + 1,
                          id: -1,
                        }; // Adjust sort_order based on deletions and start from 1
                      }

                      // For existing images (not deleted and not new)
                      if (
                        img.type === undefined &&
                        !(img.image instanceof File) &&
                        img['sort_order']
                      ) {
                        return {id: img['id'], sort_order: img['sort_order']};
                      }

                      return undefined; // If no conditions match, skip
                    })
                    .filter((a: any) => a); // Filter out undefined values

                  // Return the modified image array with the correct sort order
                  return {
                    ...item,
                    image:
                      modifiedImageArray.length > 0
                        ? modifiedImageArray
                        : undefined,
                  };
                },
              );

              values = {
                ...values,
                id: editOptionData.id,
                product_option_value: modifiedData,
              };
            }
          } else {
            // Handle new data (no editing, just adding new options)
            const addNewData = values?.product_option_value.map((item: any) => {
              const newImageArray: Array<{
                sort_order: number;
                image?: File | string;
                id?: number;
                type?: string;
              }> = [];
              const sortOrderArray: number[] = [];

              // Process each image
              item.image.forEach((img: any, index: number) => {
                if (img.type === 'delete' && img.id) {
                  // Mark image for deletion
                  newImageArray.push({
                    id: img.id,
                    type: 'delete',
                    sort_order: 0,
                  });
                } else if (
                  img.type === undefined &&
                  img.image instanceof File
                ) {
                  // New image upload (binary), we'll assign a sort_order later
                  newImageArray.push({
                    image: img.image,
                    id: -1,
                    sort_order: 0,
                  });
                }

                // Collect sort_order for existing images
                if (img.sort_order) {
                  sortOrderArray.push(img.sort_order);
                }
              });

              // Renumber the sort_order starting from 1
              let sortOrderCount = 1;
              newImageArray.forEach(imgItem => {
                if (imgItem.image) {
                  imgItem.sort_order = sortOrderCount; // Assign sequential sort_order starting from 1
                  sortOrderCount++;
                }
              });

              // Return the modified product option values with new images and their correct sort_order
              return {
                ...item,
                image: newImageArray
                  .map(imgItem => imgItem.image)
                  .filter(img => img !== undefined),
                sort_order: sortOrderArray,
              };
            });

            values = {...values, product_option_value: addNewData};
          }

          // console.log(
          //   'value',
          //   editOptionData,
          //   values?.product_option_value[0]?.id,
          // );

          // Call the API based on whether we are editing or adding a new product option
          const response: any =
            editOptionData && values?.product_option_value[0]?.id
              ? await ApiUtils.editProductOption({...values})
              : await ApiUtils.addProductOption({...values});

          toast.success(response.message);
          dispatch(setisFormUpdate(false));
          navigate('/products');
        }
      } catch (error: any) {
        // Handle API call failure
        toast.error(error.response?.data?.message || 'An error occurred');
      }
    },
  });

  // const validateAndSubmit: any = async () => {
  //   const errors = await formik.validateForm();

  //   if (Object.keys(errors).length > 0) {
  //     // Scroll to the form if there are errors
  //     if (formRef.current != null) {
  //       formRef.current.scrollIntoView({behavior: 'smooth'});
  //     }
  //     // Set touched fields to show validation messages
  //     // Set touched fields to show validation messages
  //     const touchedFields = {
  //       option_id: true,
  //       product_id: true,
  //       product_option_value: formik.values.product_option_value.map(() => ({
  //         id: true,
  //         product_id: true,
  //         option_value_id: true,
  //         quantity: true,
  //         price: true,
  //         special_price: true,
  //         minimum_quantity: true,
  //         disable_after_out_of_stock: true,
  //         cost_to_company: true,
  //         image: true,
  //       })),
  //     };

  //     // Use setTouched to update touched fields
  //     formik.setTouched(touchedFields);
  //     return false; // Stop further execution if there are validation errors

  //     // Stop further execution if there are validation errors
  //   }

  //   // Call the submit function if no errors
  //   // await validationCreateProduct.handleSubmit();
  // };
  // console.log('Errors:', formik.errors);

  const validateAndSubmit: any = async () => {
    const errors = await formik.validateForm();

    if (Object.keys(errors).length > 0) {
      // Scroll to the form if there are general form errors
      if (formRef.current != null) {
        formRef.current.scrollIntoView({behavior: 'smooth'});
      }

      // Set touched fields to show validation messages
      const touchedFields = {
        option_id: true,
        product_id: true,
        product_option_value: formik.values.product_option_value.map(() => ({
          option_value_id: true,
          quantity: true,
          price: true,
          special_price: true,
          weight: true,
          length: true,
          width: true,
          height: true,
          minimum_quantity: true,
          disable_after_out_of_stock: true,
          status_id: true,
          cost_to_company: true,
          image: true,
          id: true,
          product_id: true,
          product_tag: true,
          is_new_arrival: true,
          sku: true,
        })),
      };

      console.warn(formik.values.product_option_value.length >= 1);
      const arr = [
        'option_value_id',
        'quantity',
        'price',
        'weight',
        'length',
        'width',
        'height',
        'special_price',
        'minimum_quantity',
        'cost_to_company',
        'disable_after_out_of_stock',
        'status_id',
        'image',
        'product_tag',
        'sku',
        'is_new_arrival',
      ];

      if (formik.values.product_option_value.length > 0) {
        arr.forEach((field: string) => {
          formik.values.product_option_value.forEach(
            (_: any, index: number) => {
              // Generate the field id based on the current `field` and `index`
              const fieldId = `${field}-${index}`;
              console.warn(fieldId, index);
              // Check if the field has an error and scroll to the element if it does
              const fieldError = errors?.product_option_value?.[index]?.[field];

              if (fieldError) {
                const fieldRef = document.getElementById(fieldId);
                if (fieldRef) {
                  fieldRef.scrollIntoView({behavior: 'smooth'});
                }
              }

              // Create touched fields object dynamically
              touchedFields.product_option_value[index][field] = true;
              formik.setTouched(touchedFields);
              return false;
            },
          );
        });
        // Use setTouched to update touched fields
      } else {
        // Use setTouched to update touched fields
        formik.setTouched(touchedFields);
        return false;
      }
      // Iterate through each product_option_value to check for specific field errors

      return false; // Stop further execution if there are validation errors
    }

    // Call the submit function if no errors
    // await validationCreateProduct.handleSubmit();
  };

  const inputHandler = (e: any, index: number): any => {
    const {name, value} = e.target;
    const data = [...formik.values.product_option_value];
    // data[index] = {
    //   ...data[index],
    //   [e.target.name]: parseFloat(e?.target?.value ?? 0),
    // };

    // data[index] = {
    //   ...data[index],
    //   [name]: name === 'sku' ? value : parseFloat(value ?? '0'),
    // };
    const parsedValue = name === 'sku' ? value : parseFloat(value || '0');

    data[index] = {
      ...data[index],
      [name]: parsedValue,
      // ...(name === 'special_price_value' && {special_price: parsedValue}), // 👈 Copy value if it's special_price_value
    };

    formik.setFieldValue('product_option_value', data);
  };
  // const inputHandler = (e: any, index: number): any => {
  //   const data = [...formik.values.product_option_value];
  //   const fieldName = e.target.name;
  //   const value = parseFloat(e?.target?.value ?? 0);

  //   // Validate if special price is less than price
  //   if (
  //     fieldName === 'special_price' &&
  //     value >= parseFloat(data[index].price)
  //   ) {
  //     // Display error message
  //     formik.setFieldError(
  //       `product_option_value[${index}].special_price`,
  //       'Special price must be less than price',
  //     );
  //   } else {
  //     // Update values and clear error message
  //     data[index] = {
  //       ...data[index],
  //       [fieldName]: value,
  //     };
  //     formik.setFieldValue('product_option_value', data);
  //     formik.setFieldError(
  //       `product_option_value[${index}].special_price`,
  //       undefined,
  //     );
  //   }
  // };

  function handleAcceptedFiles(files: any, index: number): void {
    const data = [...formik.values.product_option_value];
    const updatedData = data.map((item, i) => {
      if (i === index) {
        const existingImagesCount = item.image.filter(
          (img: any) => img.id,
        ).length;
        const updatedImages = item.image.map(
          (image: any, imageIndex: number) => ({
            ...image,
            sort_order:
              image.sort_order !== undefined
                ? image.sort_order
                : imageIndex + 1,
          }),
        );

        const newImagesWithSortOrder = files.map(
          (file: any, fileIndex: number) => ({
            ...file,
            sort_order: existingImagesCount + fileIndex + 1,
            image: file instanceof File ? file : file.image, // Set image property accordingly
          }),
        );
        setIsFormDirty(true);
        dispatch(setisFormUpdate(true));
        return {
          ...item,
          image: [...updatedImages, ...newImagesWithSortOrder],
          // special_price: item.special_price_value ?? item.special_price, // 👈 update from same item
        };
      }
      return item;
    });

    formik.setFieldValue('product_option_value', updatedData);
  }

  function handleRemovedFiles(index: number, indexToRemove: number): void {
    const updatedProductOptionValue = formik.values.product_option_value.map(
      (option: any, optionIndex: number) => {
        if (optionIndex === index) {
          setIsFormDirty(true);
          dispatch(setisFormUpdate(true));
          return {
            ...option,
            image: option.image.map((imageItem: any, imageIndex: number) => {
              if (imageIndex === indexToRemove) {
                if (imageItem.image) {
                  // Image URL exists, remove the object
                  return {...imageItem, type: 'delete', id: imageItem.id};
                  // return undefined;
                } else {
                  // Image is a file, mark for deletion by adding type: 'delete' and id
                  return {...imageItem, type: 'delete', id: imageItem.id};
                }
              } else {
                return {...imageItem};
              }
            }),
          };
        }
        setIsFormDirty(true);
        dispatch(setisFormUpdate(true));
        return option;
      },
    );

    formik.setFieldValue('product_option_value', updatedProductOptionValue);
  }

  const OptionformRefs = useRef<Array<HTMLDivElement | null>>([]);
  // Handle the scroll logic to scroll to the last element
  const handleScrollToBottom: any = () => {
    // Check if there are refs and scroll to the last one
    const lastRef = OptionformRefs.current[OptionformRefs.current.length - 1];
    if (lastRef) {
      lastRef.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
  };
  const handleAdd = (): any => {
    const data = [
      ...formik.values.product_option_value,
      blankProductOptionsObj,
    ];

    if (formik.values.option_id !== '') {
      if (data.length <= optionValue.length) {
        formik.setFieldValue('product_option_value', data, true);
        setTimeout(() => handleScrollToBottom(), 0); // Scroll after the re-render
      } else {
        toast.error('Cannot add more options than available.');
      }
    }
  };

  // Use useEffect to ensure scroll happens after component re-renders

  const handleRemove = (index: number, id?: number): any => {
    if (index < 1 && formik.values.product_option_value.length === 1) {
      toast.error('Do not remove these fields.');
    } else {
      if (id) {
        ApiUtils.deleteProductOption(id)
          .then((res: any) => {
            toast.success(res.message);
          })
          .catch((_err: any) => {});
      }
      const data = [...formik.values.product_option_value];
      if (index > -1) {
        data.splice(index, 1);
      }
      formik.setFieldValue('product_option_value', data, true);
      OptionformRefs.current = OptionformRefs.current.slice(0, data.length);
      setIsFormDirty(true);
      dispatch(setisFormUpdate(true));
    }
  };
  useEffect(() => {
    ApiUtils.getOptions()
      .then((res: any) => {
        setOptions(res?.data);
      })
      .catch((_err: any) => {});
    ApiUtils.getWeightLength()
      .then((res: any) => {
        setLengthClass(res?.data?.Length);
        setWeightClass(res?.data?.weight);
        setweightDefualt(res?.data?.weight?.[0]?.id);
        setlengthDefualt(res?.data?.Length?.[0]?.id);
      })
      .catch((_err: any) => {});
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    void fetchOptionValues();
  }, [formik.values.option_id]);
  async function fetchOptionValues(): Promise<void> {
    if (formik.values.option_id) {
      ApiUtils.getOptionValue(formik.values.option_id)
        .then((res: any) => {
          setOptionValue(res?.data);
        })
        .catch((_err: any) => {});
    }
  }
  const optionPrev =
    editOptionData?.product_option_value?.length > 0 &&
    editOptionData?.product_option_value;
  const datastore: any = {};
  if (optionPrev) {
    datastore[`${editOptionData?.option_id}`] = editOptionData?.option_id;
  }

  const handleResetForm = (id: any): void => {
    if (datastore[id]) {
      formik.resetForm();
    } else if (pathname === '/product-edit') {
      formik.setFieldValue('product_option_value', [blankProductOptionsObj]);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deleteIntialOption = (): void => {
    if (
      formik.initialValues?.option_id !== datastore[formik.values.option_id]
    ) {
      editOptionData?.product_option_value.forEach((v: {id: any}): any => {
        ApiUtils.deleteProductOption(v.id)
          .then((_res: any) => {})
          .catch((_err: any) => {});
      });
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    productOptionIndex: number,
    imageIndex: number,
  ): any => {
    e.dataTransfer.setData('productOptionIndex', productOptionIndex.toString());
    e.dataTransfer.setData('imageIndex', imageIndex.toString());
  };
  const handleDragOver = async (e: any): Promise<void> => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    productOptionIndex: number,
    imageIndex: number,
  ): void => {
    e.preventDefault();

    const droppedProductOptionIndex = parseInt(
      e.dataTransfer.getData('productOptionIndex'),
      10,
    );

    const droppedImageIndex = parseInt(
      e.dataTransfer.getData('imageIndex'),
      10,
    );

    if (
      droppedProductOptionIndex === productOptionIndex &&
      droppedImageIndex === imageIndex
    ) {
      return;
    }

    const updatedProductOptionValue = [...formik.values.product_option_value];
    const draggedImage = updatedProductOptionValue[
      droppedProductOptionIndex
    ].image.splice(droppedImageIndex, 1)[0]; // Remove the dragged image from its original position

    if (draggedImage.type !== 'delete') {
      updatedProductOptionValue[productOptionIndex].image.splice(
        imageIndex,
        0,
        draggedImage,
      ); // Insert the dragged image into the new position
    }

    // Update sort_order for the images in the new position for the specific product_option_value
    updatedProductOptionValue[productOptionIndex].image.forEach(
      (img: any, idx: number) => {
        if (img.type !== 'delete') {
          img.sort_order = idx + 1;
        }
      },
    );

    formik.setFieldValue('product_option_value', updatedProductOptionValue);
  };
  function modalToggleOptionValue(): void {
    if (modalOptionValue) {
      void fetchOptionValues();
    }
    setOptionValueId(formik.values.option_id);
    setModalOptionValue(!modalOptionValue);
  }

  // get the product details by calling by id in useEffect for price comparision

  const [productName, setProductName] = useState('');
  const [comparisonType, setComparisonType] = useState('');
  const [priceComparisionModalOpen, setPriceComparisionModalOpen] =
    useState(false);

  const [priceComparisionData, setPriceComparisionData] = useState<Product[]>(
    [],
  );

  useEffect(() => {
    if (productId !== null) {
      const fetchData = async (): Promise<void> => {
        try {
          const res: any = await ApiUtils.getProduct(productId);
          const data: any = res?.data;
          setProductName(data?.name.toLowerCase().replace(/\s+/g, ''));
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };

      void fetchData();
    }
  }, []);

  const handleApplyClick = async (): Promise<void> => {
    try {
      const response: any = await ApiUtils.priceComparision(
        `product_name=${productName}&type=${comparisonType}`,
      );

      setPriceComparisionData(response?.data);
      setPriceComparisionModalOpen(true);
      setComparisonType('');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handlepriceComparisionCloseModal = (): void => {
    setPriceComparisionModalOpen(false);
  };

  // console.log(
  //   'formik.values.product_option_value',
  //   formik.values.product_option_value,
  //   formik.errors.product_option_value,
  // );

  return (
    <Card ref={containerRef} style={{overflowY: 'auto'}}>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex">
            <div className="flex-shrink-0 me-3">
              <div className="avatar-sm">
                <div
                  data-testid="list-icon"
                  className="avatar-title rounded-circle bg-light text-primary fs-20">
                  <i className="bi bi-list-ul"></i>
                </div>
              </div>
            </div>
            <div className="flex-grow-1">
              <h5 className="card-title mb-1">Product Options</h5>
              <p className="text-muted mb-0">Fill all information below.</p>
            </div>
          </div>
          <div className="d-flex align-items-center d-none">
            <select
              className="form-select me-2"
              value={comparisonType}
              onChange={e => {
                setComparisonType(e.target.value);
                handleInputChange(e);
              }}>
              <option value="" selected>
                Price Comparison
              </option>
              {/* <option value="flipkart">Flipkart</option> */}
              <option value="amazon">Amazon</option>
            </select>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleApplyClick}>
              Apply
            </button>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <Form
          ref={formRef}
          action="#"
          id="product-options"
          className="needs-validation createCategory-form"
          onSubmit={e => {
            e.preventDefault();
            formik.handleSubmit();
            validateAndSubmit();
            // handleInputChange(e);
          }}>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between">
                <div>
                  <div className="d-flex">
                    <Form.Label
                      className='h5 className="card-title mb-1'
                      htmlFor="option_id">
                      Option
                    </Form.Label>

                    <TooltipWithInfoIcon text={tooltipMessage.SelectOption} />
                  </div>
                  <Form.Select
                    className="form-select"
                    data-testid="form-select"
                    id="option_id"
                    name="option_id"
                    value={formik.values.option_id ?? ''}
                    onChange={async e => {
                      const selectedValue = e.target.value;
                      formik.setFieldValue('option_id', selectedValue);
                      handleResetForm(e.target.value);
                      handleInputChange(e);
                    }}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      !!(
                        Boolean(formik.touched.option_id) &&
                        Boolean(formik.errors.option_id)
                      )
                    }>
                    <option value="" selected>
                      Select your Option
                    </option>
                    {options?.map((option: OptionsType) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </Form.Select>
                  {Boolean(formik.touched.option_id) &&
                  Boolean(formik.errors.option_id) ? (
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.option_id}
                    </Form.Control.Feedback>
                  ) : null}
                </div>
                <div className="flex-shrink-0">
                  <Button
                    className="btn btn-success btn-label btn-hover rounded-pill"
                    onClick={() => {
                      handleAdd(); // First function
                    }}>
                    <i className="bi bi-box-seam label-icon align-middle rounded-pill fs-16 me-2"></i>{' '}
                    Add New Option
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {formik.values.product_option_value.map(
                (productOption: any, index: number) => {
                  // Inside your component, before the return or inside a map

                  return (
                    <React.Fragment key={index}>
                      <Row>
                        <Button
                          type="button"
                          role="remove"
                          className="btn btn-danger btn-icon ms-auto"
                          onClick={() => {
                            handleRemove(index, productOption?.id);
                          }}>
                          <i className="ri-delete-bin-5-line"></i>
                        </Button>
                      </Row>
                      <Row>
                        <Col lg={3} sm={6}>
                          <div className="mb-3">
                            <div
                              className="d-flex"
                              ref={el => (OptionformRefs.current[index] = el)}>
                              <Form.Label htmlFor={`option_value_id-${index}`}>
                                Option Value
                              </Form.Label>
                              <TooltipWithInfoIcon
                                text={tooltipMessage.SelectOptionValue}
                              />

                              <Button
                                type="button"
                                variant="success"
                                style={{bottom: '4px'}}
                                onClick={modalToggleOptionValue}
                                className="p-1 ml-2 ms-auto">
                                <i className="mdi mdi-plus" />
                                Add new
                              </Button>
                            </div>
                            <Form.Select
                              className="form-select"
                              id={`option_value_id-${index}`}
                              name="option_value_id"
                              value={productOption.option_value_id ?? ''} // This will bind the selected option value
                              onChange={e => {
                                const selectedValue = e.target.value;

                                // If the value is '0', do not proceed further
                                if (selectedValue === '0') {
                                  return;
                                }

                                // Update Formik values
                                const updatedValues = [
                                  ...formik.values.product_option_value,
                                ];

                                // Check if the selected option_value_id already exists in the updatedValues
                                const isAlreadySelected = updatedValues.some(
                                  (option, idx) =>
                                    option.option_value_id.toString() ===
                                      selectedValue && idx !== index,
                                );

                                if (isAlreadySelected) {
                                  // If already selected, show the alert and return
                                  alert(
                                    'This option has already been selected!',
                                  );
                                  return;
                                }

                                // If not selected, update the value in Formik
                                updatedValues[index] = {
                                  ...updatedValues[index],
                                  [e.target.name]: selectedValue, // Set the selected value
                                };

                                // Update Formik state with new values
                                formik.setFieldValue(
                                  'product_option_value',
                                  updatedValues,
                                );

                                handleInputChange(e); // Call any additional custom handler if needed
                              }}
                              onBlur={formik.handleBlur} // Mark the field as touched on blur
                              isInvalid={
                                !!formik.errors.product_option_value?.[index]
                                  ?.option_value_id &&
                                formik.touched.product_option_value?.[index]
                                  ?.option_value_id
                              }>
                              <option value="0">Select your Option</option>
                              {optionValue?.map((option: OptionsType) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                            </Form.Select>

                            {/* Display error message after blur */}
                            {formik.touched.product_option_value?.[index]
                              ?.option_value_id &&
                            formik.errors.product_option_value?.[index]
                              ?.option_value_id ? (
                              <Form.Control.Feedback type="invalid">
                                {
                                  formik.errors.product_option_value[index]
                                    ?.option_value_id
                                }
                              </Form.Control.Feedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col lg={3} sm={6}>
                          <div className="mb-3">
                            <div className="d-flex">
                              <Form.Label htmlFor="stocks-input">
                                Quantity
                              </Form.Label>

                              <TooltipWithInfoIcon
                                text={tooltipMessage.ProductQuantity}
                              />
                            </div>
                            <Form.Control
                              type="number"
                              className="form-control"
                              id={`quantity-${index}`}
                              name="quantity"
                              min={0}
                              value={productOption.quantity ?? ''}
                              placeholder="Enter Quantity"
                              onWheel={handleWheel}
                              onChange={e => {
                                inputHandler(e, index);
                                handleInputChange(e);
                              }}
                              onBlur={formik.handleBlur}
                              isInvalid={
                                !!(
                                  Boolean(
                                    formik?.touched?.product_option_value?.[
                                      index
                                    ]?.quantity,
                                  ) &&
                                  Boolean(
                                    formik?.errors?.product_option_value?.[
                                      index
                                    ]?.quantity,
                                  )
                                )
                              }
                            />
                            {Boolean(
                              formik?.touched?.product_option_value?.[index]
                                ?.quantity,
                            ) &&
                            Boolean(
                              formik?.errors?.product_option_value?.[index]
                                ?.quantity,
                            ) ? (
                              <Form.Control.Feedback type="invalid">
                                {
                                  formik?.errors?.product_option_value?.[index]
                                    ?.quantity
                                }
                              </Form.Control.Feedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col lg={3} sm={6}>
                          <div className="mb-3">
                            <div className="d-flex">
                              <Form.Label htmlFor="stocks-input">
                                Price{' '}
                              </Form.Label>

                              <TooltipWithInfoIcon
                                text={tooltipMessage.ProductPrice}
                              />
                            </div>
                            <div className="input-group has-validation mb-3">
                              <span
                                className="input-group-text fs-6"
                                id="product-price-addon">
                                ₹
                              </span>
                              <Form.Control
                                type="number"
                                className="form-control"
                                id={`price-${index}`}
                                name="price"
                                min={0}
                                step="0.01"
                                value={productOption.price ?? ''}
                                placeholder="Enter Price"
                                onWheel={handleWheel}
                                onChange={e => {
                                  inputHandler(e, index);
                                  handleInputChange(e);
                                }}
                                onBlur={formik.handleBlur}
                                isInvalid={
                                  !!(
                                    Boolean(
                                      formik?.touched?.product_option_value?.[
                                        index
                                      ]?.price,
                                    ) &&
                                    Boolean(
                                      formik?.errors?.product_option_value?.[
                                        index
                                      ]?.price,
                                    )
                                  )
                                }
                              />
                            </div>
                            {Boolean(
                              formik?.touched?.product_option_value?.[index]
                                ?.price,
                            ) &&
                            Boolean(
                              formik?.errors?.product_option_value?.[index]
                                ?.price,
                            ) ? (
                              <Form.Control.Feedback type="invalid">
                                {
                                  formik?.errors?.product_option_value?.[index]
                                    ?.price
                                }
                              </Form.Control.Feedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col lg={3} sm={6}>
                          <div className="mb-3">
                            <div className="d-flex">
                              <Form.Label htmlFor="stocks-input">
                                {' '}
                                Special Price
                              </Form.Label>

                              <TooltipWithInfoIcon
                                text={tooltipMessage.ProductSpecialPrice}
                              />
                            </div>
                            <div className="input-group has-validation mb-3">
                              <span
                                className="input-group-text fs-6"
                                id="product-special_price-addon">
                                ₹
                              </span>
                              <Form.Control
                                type="number"
                                className="form-control"
                                id={`special-price-${index}`}
                                name="special_price"
                                min={0}
                                step="0.01"
                                value={productOption.special_price ?? ''}
                                placeholder="Enter special price"
                                onWheel={handleWheel}
                                onChange={e => {
                                  inputHandler(e, index);
                                  handleInputChange(e);
                                }}
                                onBlur={formik.handleBlur}
                                isInvalid={
                                  !!(
                                    Boolean(
                                      formik?.touched?.product_option_value?.[
                                        index
                                      ]?.special_price,
                                    ) &&
                                    Boolean(
                                      formik?.errors?.product_option_value?.[
                                        index
                                      ]?.special_price,
                                    )
                                  )
                                }
                              />
                            </div>
                            {Boolean(
                              formik?.touched?.product_option_value?.[index]
                                ?.special_price,
                            ) &&
                            Boolean(
                              formik?.errors?.product_option_value?.[index]
                                ?.special_price,
                            ) ? (
                              <Form.Control.Feedback type="invalid">
                                {
                                  formik?.errors?.product_option_value?.[index]
                                    ?.special_price
                                }
                              </Form.Control.Feedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col lg={3} sm={6}>
                          <div className="mb-3">
                            <div className="d-flex">
                              <Form.Label htmlFor="stocks-input">
                                Weight
                              </Form.Label>

                              <TooltipWithInfoIcon
                                text={tooltipMessage.ProductWeight}
                              />
                            </div>
                            <Form.Control
                              type="number"
                              className="form-control"
                              id={`weight-${index}`}
                              name="weight"
                              min={0}
                              step="0.01"
                              value={productOption.weight ?? ''}
                              placeholder="Enter weight"
                              onWheel={handleWheel}
                              onChange={e => {
                                inputHandler(e, index);
                                handleInputChange(e);
                              }}
                              onBlur={formik.handleBlur}
                              isInvalid={
                                !!(
                                  Boolean(
                                    formik?.touched?.product_option_value?.[
                                      index
                                    ]?.weight,
                                  ) &&
                                  Boolean(
                                    formik?.errors?.product_option_value?.[
                                      index
                                    ]?.weight,
                                  )
                                )
                              }
                            />
                            {Boolean(
                              formik?.touched?.product_option_value?.[index]
                                ?.weight,
                            ) &&
                            Boolean(
                              formik?.errors?.product_option_value?.[index]
                                ?.weight,
                            ) ? (
                              <Form.Control.Feedback type="invalid">
                                {
                                  formik?.errors?.product_option_value?.[index]
                                    ?.weight
                                }
                              </Form.Control.Feedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col lg={3} sm={6}>
                          <div className="mb-3">
                            <div className="d-flex">
                              <Form.Label htmlFor={`weight_id-${index}`}>
                                Weight class
                              </Form.Label>

                              <TooltipWithInfoIcon
                                text={tooltipMessage.WeigthClass}
                              />
                            </div>

                            <Form.Select
                              className="form-select"
                              id={`weight_id-${index}`}
                              name="weight_id"
                              value={
                                productOption.weight_id || weightDefualt || ''
                              }
                              onChange={e => {
                                const selectedValue = e.target.value;
                                const data = [
                                  ...formik.values.product_option_value,
                                ];
                                data[index] = {
                                  ...data[index],
                                  [e.target.name]: parseFloat(
                                    selectedValue ?? 0,
                                  ),
                                };
                                formik.setFieldValue(
                                  'product_option_value',
                                  data,
                                );
                                handleInputChange(e);
                              }}
                              onBlur={formik.handleBlur}
                              isInvalid={
                                !!(
                                  Boolean(
                                    formik?.touched?.product_option_value?.[
                                      index
                                    ]?.weight_id,
                                  ) &&
                                  Boolean(
                                    formik?.errors?.product_option_value?.[
                                      index
                                    ]?.weight_id,
                                  )
                                )
                              }>
                              <option>Select your Weight class</option>
                              {weightClass?.map((option: OptionsType) => (
                                <option
                                  key={option.id}
                                  value={option.id}
                                  selected>
                                  {option.name}
                                </option>
                              ))}
                            </Form.Select>
                            {Boolean(
                              formik?.touched?.product_option_value?.[index]
                                ?.weight_id,
                            ) &&
                            Boolean(
                              formik?.errors?.product_option_value?.[index]
                                ?.weight_id,
                            ) ? (
                              <Form.Control.Feedback type="invalid">
                                {
                                  formik?.errors?.product_option_value?.[index]
                                    ?.weight_id
                                }
                              </Form.Control.Feedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col lg={3} sm={6}>
                          <div className="mb-3">
                            <div className="d-flex">
                              <Form.Label htmlFor="stocks-input">
                                Length
                              </Form.Label>

                              <TooltipWithInfoIcon
                                text={tooltipMessage.ProductLength}
                              />
                            </div>
                            <Form.Control
                              type="number"
                              className="form-control"
                              id={`length-${index}`}
                              name="length"
                              min={0}
                              step="0.01"
                              value={productOption.length ?? ''}
                              placeholder="Enter length"
                              onWheel={handleWheel}
                              onChange={e => {
                                inputHandler(e, index);
                                handleInputChange(e);
                              }}
                              onBlur={formik.handleBlur}
                              isInvalid={
                                !!(
                                  Boolean(
                                    formik?.touched?.product_option_value?.[
                                      index
                                    ]?.length,
                                  ) &&
                                  Boolean(
                                    formik?.errors?.product_option_value?.[
                                      index
                                    ]?.length,
                                  )
                                )
                              }
                            />
                            {Boolean(
                              formik?.touched?.product_option_value?.[index]
                                ?.length,
                            ) &&
                            Boolean(
                              formik?.errors?.product_option_value?.[index]
                                ?.length,
                            ) ? (
                              <Form.Control.Feedback type="invalid">
                                {
                                  formik?.errors?.product_option_value?.[index]
                                    ?.length
                                }
                              </Form.Control.Feedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col lg={3} sm={6}>
                          <div className="mb-3">
                            <div className="d-flex">
                              <Form.Label htmlFor={`length_id-${index}`}>
                                Length class
                              </Form.Label>

                              <TooltipWithInfoIcon
                                text={tooltipMessage.lengthClass}
                              />
                            </div>
                            <Form.Select
                              className="form-select"
                              id={`length_id-${index}`}
                              name="length_id"
                              value={
                                productOption.length_id || lengthDefualt || ''
                              }
                              onChange={e => {
                                const selectedValue = e.target.value;
                                const data = [
                                  ...formik.values.product_option_value,
                                ];
                                data[index] = {
                                  ...data[index],
                                  [e.target.name]: parseFloat(
                                    selectedValue ?? 0,
                                  ),
                                };
                                formik.setFieldValue(
                                  'product_option_value',
                                  data,
                                );
                                handleInputChange(e);
                              }}
                              onBlur={formik.handleBlur}
                              isInvalid={
                                !!(
                                  Boolean(
                                    formik?.touched?.product_option_value?.[
                                      index
                                    ]?.length_id,
                                  ) &&
                                  Boolean(
                                    formik?.errors?.product_option_value?.[
                                      index
                                    ]?.length_id,
                                  )
                                )
                              }>
                              <option>Select your Length class</option>
                              {lengthClass?.map((option: OptionsType) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                            </Form.Select>
                            {Boolean(
                              formik?.touched?.product_option_value?.[index]
                                ?.length_id,
                            ) &&
                            Boolean(
                              formik?.errors?.product_option_value?.[index]
                                ?.length_id,
                            ) ? (
                              <Form.Control.Feedback type="invalid">
                                {
                                  formik?.errors?.product_option_value?.[index]
                                    ?.length_id
                                }
                              </Form.Control.Feedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col lg={3} sm={6}>
                          <div className="mb-3">
                            <div className="d-flex">
                              <Form.Label htmlFor="stocks-input">
                                Width
                              </Form.Label>

                              <TooltipWithInfoIcon
                                text={tooltipMessage.ProductWidth}
                              />
                            </div>
                            <Form.Control
                              type="number"
                              className="form-control"
                              id={`width-${index}`}
                              name="width"
                              min={0}
                              step="0.01"
                              value={productOption.width ?? ''}
                              placeholder="Enter width"
                              onWheel={handleWheel}
                              onChange={e => {
                                inputHandler(e, index);
                                handleInputChange(e);
                              }}
                              onBlur={formik.handleBlur}
                              isInvalid={
                                !!(
                                  Boolean(
                                    formik?.touched?.product_option_value?.[
                                      index
                                    ]?.width,
                                  ) &&
                                  Boolean(
                                    formik?.errors?.product_option_value?.[
                                      index
                                    ]?.width,
                                  )
                                )
                              }
                            />
                            {Boolean(
                              formik?.touched?.product_option_value?.[index]
                                ?.width,
                            ) &&
                            Boolean(
                              formik?.errors?.product_option_value?.[index]
                                ?.width,
                            ) ? (
                              <Form.Control.Feedback type="invalid">
                                {
                                  formik?.errors?.product_option_value?.[index]
                                    ?.width
                                }
                              </Form.Control.Feedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col lg={3} sm={6}>
                          <div className="mb-3">
                            <div className="d-flex">
                              <Form.Label htmlFor="stocks-input">
                                Height
                              </Form.Label>

                              <TooltipWithInfoIcon
                                text={tooltipMessage.ProductHeight}
                              />
                            </div>
                            <Form.Control
                              type="number"
                              className="form-control"
                              id={`height-${index}`}
                              name="height"
                              min={0}
                              step="0.01"
                              value={productOption.height ?? ''}
                              placeholder="Enter height"
                              onWheel={handleWheel}
                              onChange={e => {
                                inputHandler(e, index);
                                handleInputChange(e);
                              }}
                              onBlur={formik.handleBlur}
                              isInvalid={
                                !!(
                                  Boolean(
                                    formik?.touched?.product_option_value?.[
                                      index
                                    ]?.height,
                                  ) &&
                                  Boolean(
                                    formik?.errors?.product_option_value?.[
                                      index
                                    ]?.height,
                                  )
                                )
                              }
                            />
                            {Boolean(
                              formik?.touched?.product_option_value?.[index]
                                ?.height,
                            ) &&
                            Boolean(
                              formik?.errors?.product_option_value?.[index]
                                ?.height,
                            ) ? (
                              <Form.Control.Feedback type="invalid">
                                {
                                  formik?.errors?.product_option_value?.[index]
                                    ?.height
                                }
                              </Form.Control.Feedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col lg={3} sm={6}>
                          <div className="mb-3">
                            <div className="d-flex">
                              <Form.Label htmlFor="stocks-input">
                                Minimum Quantity
                              </Form.Label>

                              <TooltipWithInfoIcon
                                text={tooltipMessage.ProductMinimumQunatity}
                              />
                            </div>
                            <Form.Control
                              type="number"
                              className="form-control"
                              id={`minimum_quantity-${index}`}
                              name="minimum_quantity"
                              value={productOption.minimum_quantity ?? ''}
                              placeholder="Enter minimum quantity"
                              onWheel={handleWheel}
                              min={0}
                              onChange={e => {
                                inputHandler(e, index);
                                handleInputChange(e);
                              }}
                              onBlur={formik.handleBlur}
                              isInvalid={
                                !!(
                                  Boolean(
                                    formik?.touched?.product_option_value?.[
                                      index
                                    ]?.minimum_quantity,
                                  ) &&
                                  Boolean(
                                    formik?.errors?.product_option_value?.[
                                      index
                                    ]?.minimum_quantity,
                                  )
                                )
                              }
                            />
                            {Boolean(
                              formik?.touched?.product_option_value?.[index]
                                ?.minimum_quantity,
                            ) &&
                            Boolean(
                              formik?.errors?.product_option_value?.[index]
                                ?.minimum_quantity,
                            ) ? (
                              <Form.Control.Feedback type="invalid">
                                {
                                  formik?.errors?.product_option_value?.[index]
                                    ?.minimum_quantity
                                }
                              </Form.Control.Feedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col lg={3} sm={6}>
                          <div className="mb-3">
                            <div className="d-flex">
                              <Form.Label htmlFor="stocks-input">
                                Cost to company
                              </Form.Label>

                              <TooltipWithInfoIcon
                                text={tooltipMessage.ProductCostCompany}
                              />
                            </div>
                            <div className="input-group has-validation mb-3">
                              <span
                                className="input-group-text fs-6"
                                id="product-price-addon">
                                ₹
                              </span>
                              <Form.Control
                                type="number"
                                className="form-control"
                                id={`cost_to_company-${index}`}
                                name="cost_to_company"
                                min={0}
                                value={productOption.cost_to_company ?? ''}
                                placeholder="Enter Cost to company"
                                onWheel={handleWheel}
                                onChange={e => {
                                  inputHandler(e, index);
                                  handleInputChange(e);
                                }}
                                onBlur={formik.handleBlur}
                                isInvalid={
                                  !!(
                                    Boolean(
                                      formik?.touched?.product_option_value?.[
                                        index
                                      ]?.cost_to_company,
                                    ) &&
                                    Boolean(
                                      formik?.errors?.product_option_value?.[
                                        index
                                      ]?.cost_to_company,
                                    )
                                  )
                                }
                              />
                            </div>
                            {Boolean(
                              formik?.touched?.product_option_value?.[index]
                                ?.cost_to_company,
                            ) &&
                            Boolean(
                              formik?.errors?.product_option_value?.[index]
                                ?.cost_to_company,
                            ) ? (
                              <Form.Control.Feedback type="invalid">
                                {
                                  formik?.errors?.product_option_value?.[index]
                                    ?.cost_to_company
                                }
                              </Form.Control.Feedback>
                            ) : null}
                          </div>
                        </Col>

                        <Col lg={3} sm={6}>
                          <div className="mb-3">
                            <div className="d-flex">
                              <Form.Label htmlFor={`product_tag-${index}`}>
                                Product Tag
                              </Form.Label>

                              <TooltipWithInfoIcon
                                text={tooltipMessage.FormProductTag}
                              />
                            </div>

                            <Form.Select
                              className="form-select"
                              id={`product_tag-${index}`}
                              name="product_tag"
                              value={productOption.product_tag ?? ''}
                              onChange={e => {
                                const selectedValue = e.target.value;
                                const data = [
                                  ...formik.values.product_option_value,
                                ];
                                data[index] = {
                                  ...data[index],
                                  [e.target.name]: selectedValue ?? '',
                                };
                                formik.setFieldValue(
                                  'product_option_value',
                                  data,
                                );
                                handleInputChange(e);
                              }}
                              onBlur={formik.handleBlur}
                              isInvalid={
                                !!(
                                  Boolean(
                                    formik?.touched?.product_option_value?.[
                                      index
                                    ]?.product_tag,
                                  ) &&
                                  Boolean(
                                    formik?.errors?.product_option_value?.[
                                      index
                                    ]?.product_tag,
                                  )
                                )
                              }>
                              {/* <option selected>Select your Option</option> */}
                              <option value="">Select Tag</option>
                              <option value="sale">Sale</option>
                              <option value="featured">Featured</option>
                            </Form.Select>
                            {Boolean(
                              formik?.touched?.product_option_value?.[index]
                                ?.product_tag,
                            ) &&
                            Boolean(
                              formik?.errors?.product_option_value?.[index]
                                ?.product_tag,
                            ) ? (
                              <Form.Control.Feedback type="invalid">
                                {
                                  formik?.errors?.product_option_value?.[index]
                                    ?.product_tag
                                }
                              </Form.Control.Feedback>
                            ) : null}
                          </div>
                        </Col>

                        <Col lg={3} sm={6}>
                          <div className="mb-3">
                            <div className="d-flex">
                              <Form.Label htmlFor="stocks-input">
                                SKU
                              </Form.Label>

                              <TooltipWithInfoIcon
                                text={tooltipMessage.FormSKU}
                              />
                            </div>
                            <Form.Control
                              type="text"
                              className="form-control"
                              id={`sku-${index}`}
                              name="sku"
                              value={productOption?.sku ?? ''}
                              placeholder="Enter sku id"
                              onChange={e => {
                                inputHandler(e, index);
                                handleInputChange(e);
                              }}
                              onBlur={formik.handleBlur}
                              isInvalid={
                                !!(
                                  Boolean(
                                    formik?.touched?.product_option_value?.[
                                      index
                                    ]?.sku,
                                  ) &&
                                  Boolean(
                                    formik?.errors?.product_option_value?.[
                                      index
                                    ]?.sku,
                                  )
                                )
                              }
                            />
                            {Boolean(
                              formik?.touched?.product_option_value?.[index]
                                ?.sku,
                            ) &&
                            Boolean(
                              formik?.errors?.product_option_value?.[index]
                                ?.sku,
                            ) ? (
                              <Form.Control.Feedback type="invalid">
                                {
                                  formik?.errors?.product_option_value?.[index]
                                    ?.sku
                                }
                              </Form.Control.Feedback>
                            ) : null}
                          </div>
                        </Col>

                        <Col lg={3} sm={6}>
                          <div className="mb-3">
                            <div className="d-flex">
                              <Form.Label htmlFor={`product_tag-${index}`}>
                                Is New Arrival
                              </Form.Label>

                              <TooltipWithInfoIcon
                                text={tooltipMessage.isNewArrival}
                              />
                            </div>

                            <Form.Select
                              className="form-select"
                              id={`is_new_arrival-${index}`}
                              name="is_new_arrival"
                              value={productOption.is_new_arrival ?? ''}
                              onChange={e => {
                                const selectedValue = e.target.value;
                                const data = [
                                  ...formik.values.product_option_value,
                                ];
                                data[index] = {
                                  ...data[index],
                                  [e.target.name]: selectedValue ?? '',
                                };
                                formik.setFieldValue(
                                  'product_option_value',
                                  data,
                                );
                                handleInputChange(e);
                              }}
                              onBlur={formik.handleBlur}
                              isInvalid={
                                !!(
                                  Boolean(
                                    formik?.touched?.product_option_value?.[
                                      index
                                    ]?.is_new_arrival,
                                  ) &&
                                  Boolean(
                                    formik?.errors?.product_option_value?.[
                                      index
                                    ]?.is_new_arrival,
                                  )
                                )
                              }>
                              {/* <option selected>Select your Option</option> */}

                              <option value="1">Yes</option>
                              <option value="2" selected>
                                No
                              </option>
                            </Form.Select>
                            {Boolean(
                              formik?.touched?.product_option_value?.[index]
                                ?.product_tag,
                            ) &&
                            Boolean(
                              formik?.errors?.product_option_value?.[index]
                                ?.product_tag,
                            ) ? (
                              <Form.Control.Feedback type="invalid">
                                {
                                  formik?.errors?.product_option_value?.[index]
                                    ?.product_tag
                                }
                              </Form.Control.Feedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col lg={3} sm={6}>
                          <div style={{marginTop: '40px'}}>
                            <div className="form-check form-switch">
                              <Form.Check
                                type="checkbox"
                                role="switch"
                                id={`disable_after_out_of_stock-${index}`}
                                name="disable_after_out_of_stock"
                                onChange={e => {
                                  const selectedValue = e.target.checked
                                    ? 'true'
                                    : 'false';
                                  const data = [
                                    ...formik.values.product_option_value,
                                  ];
                                  data[index] = {
                                    ...data[index],
                                    [e.target.name]: selectedValue,
                                  };
                                  formik.setFieldValue(
                                    'product_option_value',
                                    data,
                                  );
                                  handleInputChange(e);
                                }}
                                checked={
                                  formik?.values?.product_option_value?.[index]
                                    ?.disable_after_out_of_stock === 'true'
                                }
                                onBlur={formik.handleBlur}
                                isInvalid={
                                  !!(
                                    Boolean(
                                      formik?.touched?.product_option_value?.[
                                        index
                                      ]?.disable_after_out_of_stock,
                                    ) &&
                                    Boolean(
                                      formik?.errors?.product_option_value?.[
                                        index
                                      ]?.disable_after_out_of_stock,
                                    )
                                  )
                                }
                              />
                              <Form.Label
                                htmlFor={`disable_after_out_of_stock-${index}`}>
                                Disable after out of stock
                              </Form.Label>
                            </div>
                            {Boolean(
                              formik?.touched?.product_option_value?.[index]
                                ?.disable_after_out_of_stock,
                            ) &&
                            Boolean(
                              formik?.errors?.product_option_value?.[index]
                                ?.disable_after_out_of_stock,
                            ) ? (
                              <Form.Control.Feedback type="invalid">
                                {
                                  formik?.errors?.product_option_value?.[index]
                                    ?.disable_after_out_of_stock
                                }
                              </Form.Control.Feedback>
                            ) : null}
                          </div>
                        </Col>
                      </Row>

                      <Row className="mt-2">
                        <Col lg={3} sm={6}>
                          <div className="mb-1">
                            <div className="d-flex">
                              <Form.Label className="mb-0">
                                Product status
                              </Form.Label>
                              <TooltipWithInfoIcon
                                text={tooltipMessage.ProductStatus}
                              />
                            </div>
                          </div>

                          <div
                            className="form-check form-switch mb-3"
                            style={{paddingLeft: '3px'}}>
                            <Form.Check
                              type="checkbox"
                              role="switch"
                              id={`status_id-${index}`}
                              className="form-switch-md"
                              checked={
                                Number(
                                  formik?.values?.product_option_value?.[index]
                                    ?.status_id ??
                                    variables.PRODUCT_OPTION_ACTIVE_STATUS_ID,
                                ) === variables.PRODUCT_OPTION_ACTIVE_STATUS_ID
                              }
                              label={
                                Number(
                                  formik?.values?.product_option_value?.[index]
                                    ?.status_id ??
                                    variables.PRODUCT_OPTION_ACTIVE_STATUS_ID,
                                ) === variables.PRODUCT_OPTION_ACTIVE_STATUS_ID
                                  ? 'Available'
                                  : 'Unavailable'
                              }
                              onChange={() => {
                                const currentStatusId = Number(
                                  formik?.values?.product_option_value?.[index]
                                    ?.status_id ??
                                    variables.PRODUCT_OPTION_ACTIVE_STATUS_ID,
                                );
                                const isActive =
                                  currentStatusId ===
                                  variables.PRODUCT_OPTION_ACTIVE_STATUS_ID;
                                const newStatusId = isActive
                                  ? variables.PRODUCT_OPTION_INACTIVE_STATUS_ID
                                  : variables.PRODUCT_OPTION_ACTIVE_STATUS_ID;

                                const optionValueId = Number(
                                  formik?.values?.product_option_value?.[index]
                                    ?.id,
                                );
                                const data = [
                                  ...formik.values.product_option_value,
                                ];
                                data[index] = {
                                  ...data[index],
                                  status_id: newStatusId,
                                };
                                formik.setFieldValue(
                                  'product_option_value',
                                  data,
                                );

                                // Only call API for existing (already-saved) option rows
                                if (optionValueId) {
                                  dispatch(
                                    changeStatus(
                                      newStatusId,
                                      [optionValueId],
                                      'product',
                                    ),
                                  );
                                }
                              }}
                            />
                          </div>
                        </Col>
                      </Row>

                      <Card>
                        <Card.Header>
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar-sm">
                                <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                  <i className="bi bi-images"></i>
                                </div>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h5 className="card-title mb-1">
                                Product Gallery
                              </h5>
                              <p className="text-muted mb-0">
                                Add product gallery images.
                              </p>
                            </div>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          <div
                            data-testid="dropzone"
                            className="dropzone my-dropzone">
                            <Dropzone
                              onDrop={acceptedFiles => {
                                handleAcceptedFiles(acceptedFiles, index);
                              }}>
                              {({getRootProps, getInputProps}) => (
                                <div className="dropzone dz-clickable text-center">
                                  <div
                                    className="dz-message needsclick"
                                    {...getRootProps()}>
                                    <div className="mb-3">
                                      <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                    </div>
                                    <h5>Drop files here or click to upload.</h5>
                                  </div>
                                </div>
                              )}
                            </Dropzone>

                            <div
                              className="list-unstyled mb-0"
                              id={`file-previews-${index}`}>
                              {productOption?.image
                                // ?.filter(
                                //   (f: {type?: string}) => f?.type !== 'delete',
                                // )
                                ?.sort(
                                  (
                                    a: {sort_order?: number},
                                    b: {sort_order?: number},
                                  ) => {
                                    const sortOrderA =
                                      a?.sort_order !== undefined
                                        ? a.sort_order
                                        : 0; // Use 0 if sort_order is undefined
                                    const sortOrderB =
                                      b?.sort_order !== undefined
                                        ? b.sort_order
                                        : 0; // Use 0 if sort_order is undefined
                                    return sortOrderA - sortOrderB;
                                  },
                                ) // Sort by sort_order
                                .map(
                                  (
                                    f: {
                                      image?: File | string | any;
                                      name?: string;
                                      path?: string;
                                      type: string;
                                    },
                                    i: number,
                                  ) => (
                                    <div
                                      key={i}
                                      draggable
                                      onDragStart={e => {
                                        handleDragStart(e, index, i);
                                      }}
                                      onDragOver={handleDragOver}
                                      onDrop={e => {
                                        handleDrop(e, index, i);
                                      }}
                                      className={`image-container ${
                                        f.type === 'delete' ? 'd-none' : ''
                                      }`}>
                                      <Card
                                        className="mt-1 mb-0 shadow-none border dz-preview dz-processing dz-image-preview dz-success dz-image dz-complete"
                                        key={i + '-file'}>
                                        <div className="p-2">
                                          <Row className="align-items-center">
                                            <Col className="col-auto">
                                              {/* <div className="image">
                                                {f.image &&
                                                typeof f.image === 'object' &&
                                                f.image instanceof File ? (
                                                  // Display uploaded File
                                                  <img
                                                    className="avatar-sm rounded bg-light test"
                                                    alt={f.name}
                                                    src={URL.createObjectURL(
                                                      f.image,
                                                    )}
                                                  />
                                                ) : (
                                                  // Display existing URL
                                                  <img
                                                    className="avatar-sm rounded bg-light"
                                                    alt={f.name}
                                                    src={f.image}
                                                  />
                                                )}
                                              </div> */}
                                              <div className="media-container image">
                                                {
                                                  f.image &&
                                                  typeof f.image === 'object' &&
                                                  f.image instanceof File ? (
                                                    (() => {
                                                      const file = f.image;
                                                      const mimeType =
                                                        file.type;

                                                      // Determine if it's an image or video
                                                      const isImage =
                                                        mimeType.startsWith(
                                                          'image/',
                                                        );
                                                      const isVideo =
                                                        mimeType.startsWith(
                                                          'video/',
                                                        );

                                                      // Generate object URL for the file
                                                      const fileUrl =
                                                        URL.createObjectURL(
                                                          file,
                                                        );

                                                      // Render based on file type
                                                      if (isImage) {
                                                        return (
                                                          <img
                                                            className="avatar-sm rounded bg-light test"
                                                            alt={f.name}
                                                            src={fileUrl}
                                                          />
                                                        );
                                                      } else if (isVideo) {
                                                        return (
                                                          <video
                                                            className="avatar-sm rounded bg-light test"
                                                            style={{
                                                              width: '100%',
                                                              maxHeight:
                                                                '200px',
                                                            }}>
                                                            <source
                                                              src={fileUrl}
                                                              type={mimeType}
                                                            />
                                                            Your browser does
                                                            not support the
                                                            video tag.
                                                          </video>
                                                        );
                                                      } else {
                                                        return (
                                                          <p>
                                                            Unsupported file
                                                            type
                                                          </p>
                                                        );
                                                      }
                                                    })()
                                                  ) : /\.(mp4|webm|ogg)$/i.test(
                                                      f.image,
                                                    ) ? (
                                                    <video
                                                      className="avatar-sm rounded bg-light"
                                                      style={{
                                                        width: '100%',
                                                        maxHeight: '200px',
                                                      }}
                                                      controls>
                                                      <source
                                                        src={f.image}
                                                        type="video/mp4"
                                                      />
                                                      Your browser does not
                                                      support the video tag.
                                                    </video>
                                                  ) : (
                                                    <img
                                                      className="avatar-sm rounded bg-light"
                                                      alt={f.name}
                                                      src={f.image}
                                                    />
                                                  )

                                                  // If it's not a File object, use the existing image URL
                                                  // <img
                                                  //   className="avatar-sm rounded bg-light"
                                                  //   alt={f.name}
                                                  //   src={f.image}
                                                  // />
                                                }
                                              </div>
                                            </Col>
                                            <Col>
                                              <p className="text-muted font-weight-bold my-auto">
                                                {f.image instanceof File
                                                  ? f.path
                                                  : f.image?.split('/').pop()}
                                              </p>
                                            </Col>
                                            <Button
                                              type="button"
                                              className="btn btn-danger btn-icon me-3"
                                              onClick={() => {
                                                handleRemovedFiles(index, i);
                                              }}>
                                              <i className="ri-delete-bin-5-line"></i>
                                            </Button>
                                          </Row>
                                        </div>
                                      </Card>
                                    </div>
                                  ),
                                )}
                            </div>
                          </div>
                          <div className="error-msg mt-1">
                            Please add a product images.
                          </div>
                          {Boolean(
                            formik?.touched?.product_option_value?.[index]
                              ?.image,
                          ) &&
                          Boolean(
                            formik?.errors?.product_option_value?.[index]
                              ?.image,
                          ) ? (
                            <Form.Control.Feedback
                              type="invalid"
                              className="required-mark">
                              {
                                formik?.errors?.product_option_value?.[index]
                                  ?.image
                              }
                            </Form.Control.Feedback>
                          ) : null}
                        </Card.Body>
                      </Card>
                    </React.Fragment>
                  );
                },
              )}
            </Card.Body>
          </Card>
          <div className="text-end mb-3">
            <Button variant="primary" type="submit" className="w-sm">
              Submit
            </Button>
          </div>
        </Form>
        <ModalContainer
          showModal={modalOptionValue}
          handleClose={modalToggleOptionValue}
          modalTitle="Add Option Value"
          modalBody={
            <CreateOptionValue
              handleClose={modalToggleOptionValue}
              optionValueId={optionValueId}
            />
          }
        />
      </Card.Body>
      {/* Modal */}
      <ModalContainer
        showModal={priceComparisionModalOpen}
        handleClose={handlepriceComparisionCloseModal}
        // modalTitle={`Price Comparison in - ${comparisonType.toUpperCase()}`}
        modalTitle="Price Comparison in Amazon"
        modalBody={
          <div className="mx-4 w-full">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border border-gray-200">Image</th>
                  <th className="px-4 border border-gray-200">Name</th>
                  <th className="px-4 border border-gray-200">Price</th>
                  <th className="px-4 border border-gray-200">MRP</th>
                </tr>
              </thead>
              <tbody>
                {priceComparisionData?.map((product, index) => (
                  <tr key={index}>
                    <td className="py-4 px-4 border border-gray-200">
                      <img
                        style={{width: '50px'}}
                        src={product.image}
                        alt={product.name}
                      />
                    </td>
                    <td className="px-4 border border-gray-200">
                      {product.name}
                    </td>
                    <td className="px-4 border border-gray-200">
                      {product.price}
                    </td>
                    <td className="px-4 border border-gray-200">
                      {product.mrp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      />
    </Card>
  );
}

export default ProductOptions;
