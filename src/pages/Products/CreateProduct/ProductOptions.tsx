/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/dot-notation */
import React, {useEffect, useMemo, useRef, useState} from 'react';
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

import {
 getDraft,
 clearDraft,
 saveDraft
} from 'utils/productDraft';

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

  // Get only changed fields for edit mode
  const getChangedFields = (currentValues: any, originalValues: any): any => {
    const changed: any = {};
    Object.keys(currentValues).forEach(key => {
      if (currentValues[key] !== originalValues[key]) {
        changed[key] = currentValues[key];
      }
    });
    return changed;
  };

  const prepareImages = (images:any[], isEdit:boolean) => {

  let deletedCount = 0;

  return images
    .map((img, index) => {

      if(img.type === 'delete' && img.id){
        return isEdit
          ? {
              id: img.id,
              type: 'delete'
            }
          : undefined;
      }

      // Handle File objects (new uploads)
      if(img.image instanceof File){
        return isEdit
          ? {
              image: img.image,
              id: -1,
              sort_order: index - deletedCount + 1
            }
          : img.image;
      }

      // Handle existing images (edit mode)
      if(
        isEdit &&
        img.id &&
        img.image &&
        img.type !== 'delete'
      ){
        return {
          id: img.id,
          sort_order: img.sort_order
        };
      }

      // Handle localStorage images with path property (edit mode without id)
      if(isEdit && img.image && typeof img.image === 'object' && img.image.path){
        return {
          image: img.image,
          id: -1,
          sort_order: index - deletedCount + 1
        };
      }

      return undefined;

    })
    .filter(Boolean);
};

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
  
    product_option_value: Yup.array().of(
      Yup.object().shape({
        sku: Yup.string().required('SKU is required'),
        id: Yup.string().optional(),

        quantity: Yup.number()
          .required('Quantity is required')
          .typeError('Quantity is required'),
        price: Yup.number()
          .positive('Price must be in positive')
          .required('Price is required')
          .typeError('Price is required'),

        special_price: Yup.number()
          .required('Special Price required')
          .typeError('Special Price required')
          .test(
            'is-less-than-price',
            'Special Price must be less than or equal to Price',
            function (value) {
              const {price} = this.parent;
              return value !== undefined && value <= price;
            },
          ),
        minimum_quantity: Yup.number()
          .required('Minimum Quantity is required')
          .typeError('Minimum Quantity is required')
          .test(
            'is-positive-or-zero',
            'Minimum Quantity must be positive',
            function (value) {
              const {quantity} = this.parent;
              if (quantity === 0 && value === 0) {
                return true;
              }
              return value > 0; 
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
        image: Yup.array()
          .min(1, 'Image is required')
          .max(5, 'Maximum 5 images allowed')
          .test('image-types', 'Each file must be an image. | Each image must be of type: jpeg, png, jpg, gif, webp.', function(images) {
            if (!images || images.length === 0) return true;
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            return images.every((img: any) => {
              if (img.image instanceof File) {
                return validTypes.includes(img.image.type);
              }
              return true;
            });
          }),
      }),
    ),
  });
  const blankProductOptionsObj = {
    quantity: '',
    price: '',
    special_price: '',
    minimum_quantity: '',
    weight: '',
    weight_id: weightDefualt ?? '',
    disable_after_out_of_stock: 'false',
    status_id: variables.PRODUCT_OPTION_ACTIVE_STATUS_ID,
    cost_to_company: '',
    product_tag: '',
    sku: '',
    is_new_arrival: '1',
    image: [],
  };

  const initialFormikValues = useMemo(
    () => ({
      product_option_value:
        editOptionData?.product_option_value?.length > 0
          ? editOptionData?.product_option_value
          : [{...blankProductOptionsObj}],
    }),
    [editOptionData, productId],
  );

  const formik: any = useFormik({
    enableReinitialize: true,

    initialValues: initialFormikValues,
    validationSchema: productOptionValueSchema,

    onSubmit: async (values: any) => {
      try {

        const result = await Swal.fire({
          title: 'Are you sure?',
          text: editOptionData
            ? 'Do you want to update this product?'
            : 'Do you want to create this product?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: editOptionData
            ? 'Yes, Update it!'
            : 'Yes, Create it!',
        });


        if (!result.isConfirmed) {
          return;
        }


        // Flatten first product_option_value to top level for API
        const firstOption = values.product_option_value[0];

        // Helper to convert finalValues to FormData
        const buildFormData = (obj: any): FormData => {
          const formData = new FormData();
          Object.keys(obj).forEach(key => {
            if (key === 'image' && Array.isArray(obj[key])) {
              obj[key].forEach((img: any, idx: number) => {
                if (img instanceof File) {
                  formData.append(`image[${idx}]`, img);
                } else if (img && typeof img === 'object') {
                  Object.keys(img).forEach(imgKey => {
                    formData.append(`image[${idx}][${imgKey}]`, img[imgKey]);
                  });
                }
              });
            } else if (obj[key] !== undefined && obj[key] !== null) {
              if (obj[key] instanceof File) {
                formData.append(key, obj[key]);
              } else {
                formData.append(key, String(obj[key]));
              }
            }
          });
          return formData;
        };

        if (editOptionData) {

          // Get only changed ProductCommon fields from editOptionData
          const commonFieldsOriginal = {
            name: editOptionData.name,
            category_id: editOptionData.category_id,
            category_brand_id: editOptionData.category_brand_id,
            gst_tax_id: editOptionData.gst_tax_id,
            is_gift_packing: editOptionData.is_gift_packing,
            description: editOptionData.description,
          };

          const currentCommonFields = {
            name: values.name,
            category_id: values.category_id,
            category_brand_id: values.category_brand_id,
            gst_tax_id: values.gst_tax_id,
            is_gift_packing: values.is_gift_packing,
            description: values.description,
          };

          const changedCommonFields = getChangedFields(currentCommonFields, commonFieldsOriginal);

          // Get changed option fields
          const originalOptionData = editOptionData?.product_option_value?.[0] || {};
          const changedOptionFields = getChangedFields(firstOption, originalOptionData);

          // Only include images if they changed
          const originalImages = originalOptionData?.image || [];
          const imagesChanged = JSON.stringify(firstOption.image) !== JSON.stringify(originalImages);

          const finalValues: any = {
            id: editOptionData.id,
            ...changedCommonFields,
            ...changedOptionFields,
          };

          if (imagesChanged) {
            finalValues.image = prepareImages(firstOption.image, true);
          }

          const formData = buildFormData(finalValues);
          const response: any =
            await ApiUtils.updateProduct(formData);

          clearDraft("product_option_draft");
          clearDraft("product_create_draft");

          toast.success(response.message);

        }

        else {

          // Merge ProductCommon fields from draft for create mode
          const productCreateDraft = getDraft("product_create_draft");
          const commonFields = productCreateDraft ? {
            name: productCreateDraft.name,
            category_id: productCreateDraft.category_id,
            category_brand_id: productCreateDraft.category_brand_id,
            gst_tax_id: productCreateDraft.gst_tax_id,
            is_gift_packing: productCreateDraft.is_gift_packing,
            description: productCreateDraft.description,
          } : {};

          const finalValues = {
            ...commonFields,
            ...firstOption,
            image: prepareImages(firstOption.image, false),
          };

          const formData = buildFormData(finalValues);
          const response: any =
            await ApiUtils.addProduct(formData);

          clearDraft("product_option_draft");
          clearDraft("product_create_draft");

          toast.success(response.message);
        }


        dispatch(setisFormUpdate(false));
        navigate('/products');


      } catch(error:any) {

        toast.error(
          error.response?.data?.message ||
          'An error occurred'
        );

      }
    },

    
  });

  useEffect(() => {
    if (!weightDefualt || !formik.values.product_option_value) return;

    const updatedOptions = formik.values.product_option_value.map((option: any) => {
      if (!option.weight_id || option.weight_id === '') {
        return { ...option, weight_id: weightDefualt };
      }
      return option;
    });

    if (JSON.stringify(updatedOptions) !== JSON.stringify(formik.values.product_option_value)) {
      formik.setFieldValue('product_option_value', updatedOptions);
    }
  }, [weightDefualt]);

    useEffect(() => {
  const loadDraftFromStorage = async () => {
    const draft = getDraft("product_option_draft");

    if (draft) {
      let draftWithConvertedImages = { ...draft };

      if (draft.product_option_value) {
        draftWithConvertedImages.product_option_value = draft.product_option_value.map((option: any) => {
          if (option.image && Array.isArray(option.image)) {
            const images = option.image.map((img: any) => {
              if (img.image && typeof img.image === 'string' && img.image.startsWith('data:image')) {
                return {
                  ...img,
                  image: base64ToFile(img.image, img.path || 'image.jpg'),
                };
              }
              return img;
            });
            return { ...option, image: images };
          }
          return option;
        });
      }

      formik.setValues({
        ...formik.initialValues,
        ...draftWithConvertedImages,
        product_option_value:
          draftWithConvertedImages.product_option_value ?? [blankProductOptionsObj],
      });
    }
  };

  loadDraftFromStorage();
}, []);

  const isFirstDraftSave = useRef(true);

  useEffect(() => {
  if (isFirstDraftSave.current) {
    isFirstDraftSave.current = false;
    return;
  }

  const saveToLocalStorage = async () => {
    const draftToSave = { ...formik.values };

    if (draftToSave.product_option_value) {
      draftToSave.product_option_value = await Promise.all(
        draftToSave.product_option_value.map(async (option: any) => {
          if (option.image && Array.isArray(option.image)) {
            const images = await Promise.all(
              option.image.map(async (img: any) => {
                if (img.image instanceof File) {
                  const base64 = await fileToBase64(img.image);
                  return {
                    ...img,
                    image: base64,
                    path: img.path || img.image.name,
                  };
                }
                return img;
              })
            );
            return { ...option, image: images };
          }
          return option;
        })
      );
    }

    saveDraft("product_option_draft", draftToSave);
  };

  saveToLocalStorage();

}, [formik.values]);

  const validateAndSubmit: any = async () => {
  const errors = await formik.validateForm();

  if (Object.keys(errors).length === 0) {
    return;
  }

  if (formRef.current) {
    formRef.current.scrollIntoView({
      behavior: 'smooth',
    });
  }
  console.log("================>",formik.values.product_option_value , errors)
  const touchedFields = {
    product_option_value:
      formik.values.product_option_value?.map(() => ({
        option_value_id: true,
        quantity: true,
        price: true,
        special_price: true,
        weight: true,
        minimum_quantity: true,
        disable_after_out_of_stock: true,
        status_id: true,
        cost_to_company: true,
        image: true,
        sku: true,
        product_tag: true,
        is_new_arrival: true,
      })) ?? [],
  };

  formik.setTouched(touchedFields);
};

  const inputHandler = (e: any, index: number): any => {
    const {name, value} = e.target;
    const data = [...formik.values.product_option_value];
    const parsedValue = name === 'sku' ? value : parseFloat(value || '0');

    data[index] = {
      ...data[index],
      [name]: parsedValue,
      // ...(name === 'special_price_value' && {special_price: parsedValue}), // 👈 Copy value if it's special_price_value
    };

    formik.setFieldValue('product_option_value', data);
  };

  const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  function validateImageType(file: File): boolean {
    return VALID_IMAGE_TYPES.includes(file.type);
  }

  // Convert File to base64 for localStorage serialization
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Convert base64 back to File object
  const base64ToFile = (base64String: string, fileName: string): File => {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  };

  function handleAcceptedFiles(files: any, index: number): void {
  const fieldName = `product_option_value.${index}.image`;

  // Validate file types
  const invalidFiles = files.filter((file: File) => !validateImageType(file));
  if (invalidFiles.length > 0) {
    formik.setFieldTouched(fieldName, true, false);
    formik.setFieldError(
      fieldName,
      'Each file must be an image. | Each image must be of type: jpeg, png, jpg, gif, webp.'
    );
    return;
  }

  const data = [...formik.values.product_option_value];

  const updatedData = data.map((item, i) => {
    if (i === index) {

      const activeImages = item.image.filter(
        (img: any) => img.type !== 'delete'
      );

      const existingImagesCount = activeImages.filter(
        (img: any) => img.id
      ).length;

      const updatedImages = activeImages.map(
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
          sort_order: existingImagesCount + fileIndex + 1,
          image: file instanceof File ? file : file.image,
          path: file.name || (file.image?.name || ''),
        }),
      );

      setIsFormDirty(true);
      dispatch(setisFormUpdate(true));

      return {
        ...item,
        image: [...updatedImages, ...newImagesWithSortOrder],
      };
    }

    return item;
  });

  formik.setFieldValue(
    'product_option_value',
    updatedData,
  );

  formik.setFieldTouched(
    fieldName,
    true,
    false,
  );

  formik.setFieldError(fieldName, undefined);
}

  function handleRemovedFiles(index: number, indexToRemove: number): void {
    const updatedProductOptionValue = formik.values.product_option_value.map(
      (option: any, optionIndex: number) => {
        if (optionIndex === index) {
          setIsFormDirty(true);
          dispatch(setisFormUpdate(true));

          const updatedImages = option.image.map(
            (imageItem: any, imageIndex: number) => {
              if (imageIndex === indexToRemove) {
                return {
                  ...imageItem,
                  type: 'delete',
                  id: imageItem.id,
                };
              }

              return { ...imageItem };
            },
          );

          return {
            ...option,
            image: updatedImages,
          };
        }

        return option;
      },
    );

    const currentImages =
      updatedProductOptionValue[index]?.image?.filter(
        (img: any) => img.type !== 'delete',
      )?.length || 0;

    const fieldName = `product_option_value.${index}.image`;

    formik.setFieldValue(
      'product_option_value',
      updatedProductOptionValue,
    ).then(() => {
      formik.setFieldTouched(fieldName, true, false);

      if (currentImages === 0) {
        formik.setFieldError(
          fieldName,
          'Image is required',
        );
      } else {
        formik.setFieldError(
          fieldName,
          undefined,
        );
      }
    });
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

  // useEffect(() => {
  //   // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  //   void fetchOptionValues();
  // }, [formik.values.option_id]);
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
  // if (optionPrev) {
  //   datastore[`${editOptionData?.option_id}`] = editOptionData?.option_id;
  // }

  const handleResetForm = (id: any): void => {
    if (datastore[id]) {
      formik.resetForm();
    } else if (pathname === '/product-edit') {
      formik.setFieldValue('product_option_value', [blankProductOptionsObj]);
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
          onSubmit={async e => {
  e.preventDefault();

  const errors = await formik.validateForm();

  if (Object.keys(errors).length > 0) {
    validateAndSubmit();
    return;
  }

  await formik.submitForm();
}}>
          <Card>
            <Card.Body>
              {formik.values.product_option_value.map(
                (productOption: any, index: number) => {

                  return (
                    <React.Fragment key={index}>
                      <Row>
                    
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
                              value={productOption.is_new_arrival ?? '1'}
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

                              <option value="1" selected>Yes</option>
                              <option value="2">
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
                            {/* <Dropzone
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
                            </Dropzone> */}

                            <Dropzone
                              accept={{
                                'image/*': [],
                              }}
                              maxFiles={5}
                              onDrop={acceptedFiles => {
                                const fieldName = `product_option_value.${index}.image`;

                                const invalidFiles = acceptedFiles.filter(
                                  (file: File) => !validateImageType(file)
                                );

                                if (invalidFiles.length > 0) {
                                  formik.setFieldTouched(fieldName, true, false);
                                  formik.setFieldError(
                                    fieldName,
                                    'Each file must be an image. | Each image must be of type: jpeg, png, jpg, gif, webp.'
                                  );
                                  return;
                                }

                                const currentImages =
                                formik.values.product_option_value[index]?.image?.filter(
                                  (img: any) => img.type !== 'delete'
                                ).length || 0;

                                if (currentImages >= 5) {
                                  formik.setFieldTouched(fieldName, true, false);

                                  formik.setFieldError(
                                    fieldName,
                                    'Maximum 5 images are allowed'
                                  );

                                  return;
                                }

                                const remainingSlots = 5 - currentImages;

                                if (acceptedFiles.length > remainingSlots) {
                                  formik.setFieldTouched(fieldName, true, false);

                                  formik.setFieldError(
                                    fieldName,
                                    `You can upload only ${remainingSlots} more image(s)`
                                  );

                                  const filesToAdd = acceptedFiles.slice(0, remainingSlots);

                                  if (filesToAdd.length > 0) {
                                    handleAcceptedFiles(filesToAdd, index);
                                  }

                                  return;
                                }

                                formik.setFieldError(fieldName, undefined);

                                const filesToAdd = acceptedFiles.slice(0, remainingSlots);

                                if (filesToAdd.length > 0) {
                                  handleAcceptedFiles(filesToAdd, index);
                                }
                              }}
                            >
                              {({ getRootProps, getInputProps }) => (
                                <div
                                  {...getRootProps()}
                                  className="dropzone dz-clickable text-center"
                                >
                                  <input {...getInputProps()} />

                                  <div className="dz-message needsclick">
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

                                                }
                                              </div>
                                            </Col>
                                            <Col>
                                              <p className="text-muted font-weight-bold my-auto">
                                                {f.image instanceof File
                                                  ? f.path
                                                  : typeof f.image === 'string'
                                                  ? f.image.split('/').pop()
                                                  : f.image?.path || f.path}
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
{formik.touched.product_option_value?.[index]?.image &&
 formik.errors.product_option_value?.[index]?.image ? (
  <div className="error-msg mt-1">
    {formik.errors.product_option_value[index].image}
  </div>
) : null}
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
