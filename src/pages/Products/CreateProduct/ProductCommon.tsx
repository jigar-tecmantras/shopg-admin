/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-void */
import React, {useEffect, useState, useRef, useMemo} from 'react';
import {Button, Card, Form, Row} from 'react-bootstrap';
import {useLocation, useNavigate} from 'react-router-dom';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {editorConfiguration, productTabKeys, variables} from 'utils/constant';
import ModalContainer from 'Common/ModalContainer';
import CategoryForm from 'Category/CategoryForm';
import {renderCategoryOptions} from 'helpers/CategoryOption';
import TamplateModal from './TamplateModal';
import TooltipWithInfoIcon from 'Common/InfoTool';
import {tooltipMessage} from '../../../utils/Tooltips';
import {useDispatch} from 'react-redux';
import {setCurrentLocation, setisFormUpdate} from 'slices/location/reducer';
import Swal from 'sweetalert2';

import {
  saveDraft,
  getDraft,
} from 'utils/productDraft';

interface ProductCommonInterface {
  editData: any;
  setActiveKey: (key: string) => void;
}

const ProductCommon = ({
  editData,
  setActiveKey,
}: ProductCommonInterface): React.JSX.Element => {
  document.title = 'Create Product | Warehouse';

  const [modalFlag, setModalFlag] = useState<boolean>(false);

  const [brandData, setBrandData] = useState<any[]>([]);
  const [gstTaxData, setGstTaxData] = useState();
  const [categoryData, setCategoryData] = useState();
  const [tamplateModal, setTamplateModal] = useState(false);
  const [templateDescription, setTemplateDescription] = useState();
  const search = useLocation().search;
  const productId = new URLSearchParams(search).get('productId');
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isFormDirty, setIsFormDirty] = useState(false);
  const isEditMode = productId !== null;
  const [isBrandDataLoaded, setIsBrandDataLoaded] = useState(false);
  const [isCategoryDataLoaded, setIsCategoryDataLoaded] = useState(false);
  const [isGstDataLoaded, setIsGstDataLoaded] = useState(false);

  useEffect(()=>{
    const draft=getDraft("product_create_draft");
    if(draft){
      validationCreateProduct.setValues(draft);
    }

  },[]);

  const handleInputChange: any = (event: any) => {
    // console.log(event, 'event---------');
    setIsFormDirty(event.target.value.length > 0);
    dispatch(setisFormUpdate(event.target.value.length > 0));
  };

  const checkEditorContent = (editor: any) => {
    const data = editor.getData(); // Get the editor data
    // Check if data is entered (not empty)
    if (data.trim() !== '') {
      setIsFormDirty(true);
      dispatch(setisFormUpdate(true));
    }
  };

  const handleCheckboxChange = (e: any, cheked: boolean, type: string) => {
    if (type === 'gift') {
      const selectedValue = cheked
        ? variables.GIFT_ACTIVE_STATUS_ID
        : variables.GIFT_INACTIVE_STATUS_ID;

      // Compare the new value with the initial value to determine if the form is dirty
      if (selectedValue !== validationCreateProduct.values.is_gift_packing) {
        setIsFormDirty(true);
        dispatch(setisFormUpdate(true));
      }
    } else {
      const selectedValue = cheked
        ? variables.PRODUCT_ACTIVE_STATUS_ID
        : variables.PRODUCT_INACTIVE_STATUS_ID;

      if (selectedValue !== validationCreateProduct.values.pov_status_id) {
        setIsFormDirty(true);
        dispatch(setisFormUpdate(true));
      }
    }
  };

  const saveDraftFunc = () => {

    saveDraft("product_create_draft",{
      ...validationCreateProduct.values
    });

  };

  // Get only changed fields for edit mode
  const getChangedFields = (currentValues: any, initialValues: any): any => {
    const changed: any = {};
    Object.keys(currentValues).forEach(key => {
      if (currentValues[key] !== initialValues[key]) {
        changed[key] = currentValues[key];
      }
    });
    return changed;
  };

  const formRef = useRef<HTMLFormElement>(null);

  const initialFormValues = useMemo(
    () => ({
      sku: String(
        editData?.sku ??
        getDraft("product_create_draft")?.sku ??
        ''
      ),

      name:
        editData?.name ??
        getDraft("product_create_draft")?.name ??
        '',

      category_id:
        editData?.category_id ??
        getDraft("product_create_draft")?.category_id ??
        '',

      is_gift_packing:
        editData?.is_gift_packing ??
        getDraft("product_create_draft")?.is_gift_packing ??
        variables.GIFT_INACTIVE_STATUS_ID,

      description:
        editData?.description ??
        getDraft("product_create_draft")?.description ??
        '',

      description_json:
        editData?.description_json ??
        getDraft("product_create_draft")?.description_json ??
        {
          name:'iphone',
          colour:'blue'
        },

      status_id:
        editData?.status_id ??
        getDraft("product_create_draft")?.status_id ??
        variables.PRODUCT_ACTIVE_STATUS_ID,

      gst_tax_id:
        editData?.gst_tax_id ??
        getDraft("product_create_draft")?.gst_tax_id ??
        '',

      category_brand_id:
        editData?.category_brand_id ??
        getDraft("product_create_draft")?.category_brand_id ??
        '',
    }),

    [editData],
  );

  const validationCreateProduct: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: initialFormValues,
    validationSchema: Yup.object().shape({
      // sku: Yup.string().required('SKU is required'),
      name: Yup.string().required('Name is required'),
      category_id: Yup.string().required('Category Name is required'),
      category_brand_id: Yup.string().required('Brand Name is required'),
      is_gift_packing: Yup.number().required('Gift Packing field is required'),
      description: Yup.string().required('Description is required'),
      description_json: Yup.object().shape({
        name: Yup.string().required('Description JSON name is required'),
        colour: Yup.string().required('Description JSON colour is required'),
      }),
      status_id: Yup.number().required('Status ID is required'),
      gst_tax_id: Yup.string().required('GST Tax ID is required'),
    }),
    onSubmit: async (values: any) => {

      saveDraft("product_create_draft",values);

      setActiveKey(productTabKeys.OPTIONS);

      window.scrollTo({
      top:0,
      left:0,
      behavior:'smooth'
      });
      
    },
  });

  const validateAndSubmit: any = async () => {
    const errors = await validationCreateProduct.validateForm();

    if (Object.keys(errors).length > 0) {
      // Scroll to the form if there are errors
      if (formRef.current != null) {
        formRef.current.scrollIntoView({behavior: 'smooth'});
      }
      // Set touched fields to show validation messages
      validationCreateProduct.setTouched({
        sku: true,
        name: true,
        category_id: true,
        category_brand_id: true,
        is_gift_packing: true,
        description: true,
        description_json: {name: true, colour: true},
        status_id: true,
        gst_tax_id: true,
      });

    }
  };
  const handleTamplateModal = (): any => {
    setTamplateModal(!tamplateModal);
  };

  useEffect(() => {
    dispatch(setCurrentLocation(location.pathname));
    dispatch(setisFormUpdate(false));

    ApiUtils.getGstTax()
      .then((res: any) => {
        setGstTaxData(res?.data);
        setIsGstDataLoaded(true);
      })
      .catch((_err: any) => {
        setIsGstDataLoaded(true);
      });
    fetchCategoryList();
    // void fetchStatus();
  }, []);

  const fetchCategoryList = (): void => {
    ApiUtils.getCategory()
      .then((res: any) => {
        setCategoryData(res?.data);
        setIsCategoryDataLoaded(true);
      })
      .catch((_err: any) => {
        setIsCategoryDataLoaded(true);
      });
  };

  useEffect(() => {
    fetchCategoryList();
  }, [modalFlag]);

  function modalToggle(): void {
    setModalFlag(!modalFlag);
    if (!modalFlag) {
      fetchCategoryList();
    }
  }

  useEffect(() => {
    const fetchBrandList = async (): Promise<void> => {
      try {
        const selectedCategory: any =
          validationCreateProduct?.values?.category_id;
        if (selectedCategory !== undefined) {
          const response: any =
            await ApiUtils.getBrandByCategory(selectedCategory);
          if (response?.data.length > 0) {
            const mappedData: any = response?.data?.map((data: any) => {
              return {value: data.id, label: data.brand_name};
            });
            setBrandData(mappedData);
          } else {
            const response: any = await ApiUtils.getBrand();
            const mappedData = response?.data?.map((data: any) => {
              const categoryName = renderCategoryOptions(data, response?.data);
              return {value: data.id, label: categoryName};
            });

            setBrandData(mappedData);
          }
        }
      } catch (err) {
        // toast.error('Something went wrong');
      }
    };
    if (
      validationCreateProduct.values.category_id !== undefined &&
      validationCreateProduct.values.category_id !== ''
    ) {
      void fetchBrandList();
      // Only clear brand in create mode, not in edit mode
      if (!editData) {
        validationCreateProduct.values.category_brand_id = '';
      }
    }
  }, [validationCreateProduct.values.category_id, editData]);

  useEffect(() => {
    const fetchBrandList = async (): Promise<void> => {
      try {
        const selectedCategory: any = editData?.category_id;
        if (selectedCategory !== undefined) {
          const response: any =
            await ApiUtils.getBrandByCategory(selectedCategory);
          if (response?.data.length > 0) {
            const mappedData: any = response?.data?.map((data: any) => {
              return {value: data.id, label: data.brand_name};
            });
            setBrandData(mappedData);
          } else {
            const response: any = await ApiUtils.getBrand();
            const mappedData = response?.data?.map((data: any) => {
              const categoryName = renderCategoryOptions(data, response?.data);
              return {value: data.id, label: categoryName};
            });

            setBrandData(mappedData);
          }
        }
        setIsBrandDataLoaded(true);
      } catch (err) {
        toast.error('Something went wrong');
        setIsBrandDataLoaded(true);
      }
    };

    if (editData?.category_id !== undefined) {
      setIsBrandDataLoaded(false);
      void fetchBrandList();
    } else {
      setIsBrandDataLoaded(true);
    }
  }, [editData?.category_id]);

  useEffect(() => {
    const loader: HTMLElement | null = document.getElementById('cover-spin');


    const allDataLoaded = isEditMode
      ? editData && isBrandDataLoaded && isCategoryDataLoaded && isGstDataLoaded
      : isCategoryDataLoaded && isGstDataLoaded;

    if (!allDataLoaded) {
      if (loader !== null) {
        loader.style.display = 'block';
      }
    } else {
      if (loader !== null) {
        loader.style.display = 'none';
      }
    }
  }, [isEditMode, editData, isBrandDataLoaded, isCategoryDataLoaded, isGstDataLoaded]);

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

  useEffect(() => {
    dispatch(setisFormUpdate(false));
  }, [editData]);

  return (
    <>
      <Form
        ref={formRef}
        action="#"
        className="needs-validation createCategory-form"
        id="product-common"
        onSubmit={e => {
          e.preventDefault();
          validationCreateProduct.handleSubmit();
          validateAndSubmit();
        }}>
        <Row>
          <Card>
            <Card.Header>
              <div className="d-flex">
                <div className="flex-shrink-0 me-3">
                  <div className="avatar-sm">
                    <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                      <i className="bi bi-box-seam"></i>
                    </div>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h5 className="card-title mb-1">Product Information</h5>
                  <p className="text-muted mb-0">Fill all information below.</p>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              
              <div className="mb-3">
                <div className="d-flex">
                  <Form.Label htmlFor="name-input">Product title</Form.Label>

                  <TooltipWithInfoIcon text={tooltipMessage.FormProductTitle} />
                </div>

                <Form.Control
                  name="name"
                  type="text"
                  className="form-control"
                  id="name-input"
                  placeholder="Enter product title"
                  onChange={e => {
                    validationCreateProduct.handleChange(e);
                    handleInputChange(e);
                    setTimeout(()=>{
                      saveDraftFunc();
                    },0);
                  }}
                  onBlur={validationCreateProduct.handleBlur}
                  value={validationCreateProduct.values.name ?? ''}
                  isInvalid={
                    !!(
                      Boolean(validationCreateProduct.touched.name) &&
                      Boolean(validationCreateProduct.errors.name)
                    )
                  }
                />

                {Boolean(validationCreateProduct.touched.name) &&
                Boolean(validationCreateProduct.errors.name) ? (
                  <Form.Control.Feedback
                    type="invalid"
                    className="required-mark">
                    {validationCreateProduct.errors.name}
                  </Form.Control.Feedback>
                ) : null}
              </div>
              <div className="mb-3">
                <div className="d-flex">
                  <Form.Label htmlFor="description-input">
                    Product description
                  </Form.Label>
                  <TooltipWithInfoIcon
                    text={tooltipMessage.FormProductDescription}
                  />
                  <Button
                    onClick={handleTamplateModal}
                    variant="primary"
                    className="btn-sm mb-2 ml-2"
                    style={{
                      borderRadius: '20px',
                      marginLeft: '10px',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    }}>
                    <span style={{marginRight: '5px'}}>Select Template</span>
                  </Button>
                </div>
                <CKEditor
                  name="description"
                  htmlFor="description-input"
                  config={editorConfiguration}
                  editor={ClassicEditor}
                  data={
                    templateDescription ??
                    validationCreateProduct?.values?.description
                  }
                  onReady={() => {
                    // You can store the "editor" and use when it is needed.
                  }}
                  onChange={(_event: any, editor: any) => {
                    editor.getData();
                    validationCreateProduct.setFieldValue(
                      'description',
                      editor.getData(),
                    );
                  }}
                  onBlur={(_event: any, editor: any) => {
                    checkEditorContent(editor); // Check editor content on key down
                    saveDraftFunc();
                  }}
                />
                {Boolean(validationCreateProduct.touched.description) &&
                Boolean(validationCreateProduct.errors.description) ? (
                  <Form.Control.Feedback
                    type="invalid"
                    className="required-mark">
                    {validationCreateProduct.errors.description}
                  </Form.Control.Feedback>
                ) : null}
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-start">
                  <div className="d-flex flex-grow-1">
                    <Form.Label htmlFor="description-input">
                      {' '}
                      Product category
                    </Form.Label>

                    <TooltipWithInfoIcon
                      text={tooltipMessage.FormCategoryList}
                    />
                  </div>

                  <div className="flex-shrink-0">
                    <Button onClick={modalToggle} className="float-end  mb-2">
                      Add New Category
                    </Button>
                  </div>
                </div>
                <div>
                  <Form.Select
                    className="form-select"
                    id="category_id"
                    name="category_id"
                    onChange={e => {
                      const selectedValue = e.target.value;
                      validationCreateProduct.setFieldValue(
                        'category_id',
                        selectedValue,
                      );
                      handleInputChange(e);

                      setTimeout(()=>{
                        saveDraftFunc();
                      },0);

                    }}
                    value={validationCreateProduct.values.category_id ?? ''}
                    onBlur={validationCreateProduct.handleBlur}
                    isInvalid={
                      !!(
                        Boolean(validationCreateProduct.touched.category_id) &&
                        Boolean(validationCreateProduct.errors.category_id)
                      )
                    }>
                    <option value="">Select product category</option>
                    {(categoryData as any)?.map((category: any) => {
                      const categoryName = renderCategoryOptions(
                        category,
                        categoryData,
                      );
                      return (
                        <option key={category.id} value={category.id}>
                          {categoryName}
                        </option>
                      );
                    })}
                  </Form.Select>
                </div>
                {Boolean(validationCreateProduct.touched.category_id) &&
                Boolean(validationCreateProduct.errors.category_id) ? (
                  <Form.Control.Feedback
                    type="invalid"
                    className="required-mark">
                    {validationCreateProduct.errors.category_id}
                  </Form.Control.Feedback>
                ) : null}
              </div>
              <div className="mb-3">
                <div className="d-flex">
                  <Form.Label>Brand</Form.Label>

                  <TooltipWithInfoIcon text={tooltipMessage.FormBrandList} />
                </div>

                <Form.Select
                  className="form-select"
                  id="category_brand_id"
                  name="category_brand_id"
                  value={validationCreateProduct.values.category_brand_id ?? ''}
                  onChange={e => {
                    const selectedValue = e.target.value;
                    validationCreateProduct.setFieldValue(
                      'category_brand_id',
                      selectedValue,
                    );
                    handleInputChange(e);
                    setTimeout(()=>{
                      saveDraftFunc();
                    },0);
                  }}
                  onBlur={validationCreateProduct.handleBlur}
                  isInvalid={
                    !!(
                      Boolean(
                        validationCreateProduct.touched.category_brand_id,
                      ) &&
                      Boolean(validationCreateProduct.errors.category_brand_id)
                    )
                  }>
                  <option value="">Select Brand</option>
                  {(brandData as any)?.map((brand: any) => {
                    return (
                      <option key={brand.value} value={brand.value}>
                        {brand.label}
                      </option>
                    );
                  })}
                </Form.Select>
                {Boolean(validationCreateProduct.touched.category_brand_id) &&
                Boolean(validationCreateProduct.errors.category_brand_id) ? (
                  <Form.Control.Feedback
                    type="invalid"
                    className="required-mark">
                    {validationCreateProduct.errors.category_brand_id}
                  </Form.Control.Feedback>
                ) : null}
              </div>

              <div className="mb-3">
                <div className="d-flex">
                  <Form.Label>Gst Tax id</Form.Label>

                  <TooltipWithInfoIcon text={tooltipMessage.FormGstList} />
                </div>
                <Form.Select
                  className="form-select"
                  id="gst_tax_id"
                  name="gst_tax_id"
                  value={validationCreateProduct.values.gst_tax_id ?? ''}
                  onChange={e => {
                    const selectedValue = e.target.value;
                    validationCreateProduct.setFieldValue(
                      'gst_tax_id',
                      selectedValue,
                    );
                    handleInputChange(e);
                    setTimeout(()=>{
                      saveDraftFunc();
                    },0);
                  }}
                  onBlur={validationCreateProduct.handleBlur}
                  isInvalid={
                    !!(
                      Boolean(validationCreateProduct.touched.gst_tax_id) &&
                      Boolean(validationCreateProduct.errors.gst_tax_id)
                    )
                  }>
                  <option value="">Select gst tax option</option>
                  {(gstTaxData as any)?.map((gst: any) => {
                    return (
                      <option key={gst.value} value={gst.id}>
                        {gst.name} - {gst.hsn_code} - {gst.value}
                      </option>
                    );
                  })}
                </Form.Select>
                {Boolean(validationCreateProduct.touched.gst_tax_id) &&
                Boolean(validationCreateProduct.errors.gst_tax_id) ? (
                  <Form.Control.Feedback
                    type="invalid"
                    className="required-mark">
                    {validationCreateProduct.errors.gst_tax_id}
                  </Form.Control.Feedback>
                ) : null}
              </div>

              <div className="mb-3">
                <div className="d-flex">
                  <Form.Label>Product status</Form.Label>
                  <TooltipWithInfoIcon text={tooltipMessage.ProductStatus} />
                </div>
                <div className="form-check form-switch">
                  <Form.Check
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckChecked"
                    onChange={e => {
                      const selectedValue = e.target.checked
                        ? variables.PRODUCT_ACTIVE_STATUS_ID
                        : variables.PRODUCT_INACTIVE_STATUS_ID;
                      validationCreateProduct.setFieldValue(
                        'status_id',
                        selectedValue,
                      );
                      // handleInputChange(e);
                      handleCheckboxChange(e, e.target.checked, 'status');
                      setTimeout(()=>{
                        saveDraftFunc();
                      },0);
                    }}
                    checked={
                      validationCreateProduct.values.status_id ===
                      variables.PRODUCT_ACTIVE_STATUS_ID
                    }
                    onBlur={validationCreateProduct.handleBlur}
                    isInvalid={
                      !!(
                        Boolean(validationCreateProduct.touched.status_id) &&
                        Boolean(validationCreateProduct.errors.status_id)
                      )
                    }
                  />

                  <Form.Label htmlFor="flexSwitchCheckChecked">
                    Available
                  </Form.Label>
                </div>
                {Boolean(validationCreateProduct.touched.status_id) &&
                Boolean(validationCreateProduct.errors.status_id) ? (
                  <Form.Control.Feedback
                    type="invalid"
                    className="required-mark">
                    {validationCreateProduct.errors.status_id}
                  </Form.Control.Feedback>
                ) : null}
              </div>

              <div className="form-check">
                <Form.Check
                  type="checkbox"
                  value=""
                  id="weeklyActivity"
                  onChange={e => {
                    const selectedValue = e.target.checked
                      ? variables.GIFT_ACTIVE_STATUS_ID
                      : variables.GIFT_INACTIVE_STATUS_ID;
                    validationCreateProduct.setFieldValue(
                      'is_gift_packing',
                      selectedValue,
                    );
                    handleCheckboxChange(e, e.target.checked, 'gift');
                    setTimeout(()=>{
                      saveDraftFunc();
                    },0);
                  }}
                  checked={
                    validationCreateProduct.values.is_gift_packing ===
                    variables.GIFT_ACTIVE_STATUS_ID
                  }
                  onBlur={validationCreateProduct.handleBlur}
                  isInvalid={
                    !!(
                      Boolean(
                        validationCreateProduct.touched.is_gift_packing,
                      ) &&
                      Boolean(validationCreateProduct.errors.is_gift_packing)
                    )
                  }
                />
                <Form.Label
                  htmlFor="weeklyActivity"
                  className="form-check-label">
                  Gift Option
                </Form.Label>
                <p className="text-muted">
                  The "Gift Option" feature provides customers with the ability
                  to designate a product as a gift during the checkout process.
                  This feature is designed to accommodate special occasions such
                  as birthdays, holidays, anniversaries, or any other
                  celebratory event. When selecting the gift option, customers
                  can often customize certain aspects of the purchase to make it
                  more personalized for the recipient.
                </p>
                {Boolean(validationCreateProduct.touched.is_gift_packing) &&
                Boolean(validationCreateProduct.errors.is_gift_packing) ? (
                  <Form.Control.Feedback
                    type="invalid"
                    className="required-mark"
                    onChange={e => {
                      handleInputChange(e);
                      setTimeout(()=>{
                        saveDraftFunc();
                      },0);
                    }}>
                    {validationCreateProduct.errors.is_gift_packing}
                  </Form.Control.Feedback>
                ) : null}
              </div>
            </Card.Body>
          </Card>
        </Row>
        <div className="text-end mb-3">
          <Button variant="primary" type="submit" className="w-sm">
            Next
          </Button>
        </div>
      </Form>
      <ModalContainer
        showModal={modalFlag}
        handleClose={modalToggle}
        modalTitle={'Add Category'}
        modalBody={
          <>
            <CategoryForm handleClose={modalToggle} />
          </>
        }
      />

      <TamplateModal
        toogleStatus={handleTamplateModal}
        showModal={tamplateModal}
        setTemplateDescription={setTemplateDescription}
      />
    </>
  );
};

export default ProductCommon;
