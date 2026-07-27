import ApiUtils from 'api/ApiUtils';
import {useFormik} from 'formik';
import React, {useEffect, useRef, useState} from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';
import {toast} from 'react-toastify';
import {renderCategoryOptions} from 'utils/CategoryOption';
import {type CategoryDetailsTypes} from 'utils/TypeConfig';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as Yup from 'yup';
import {ToasterMessage} from 'helpers/ToastHelper';
import TooltipWithInfoIcon from 'Common/InfoTool';
import {tooltipMessage} from 'utils/Tooltips';
import {editorConfiguration} from 'utils/constant';
interface Status {
  id: number;
  name: string;
  model: string;
}
const AddCoupons: React.FC<{
  handleClose: () => void;
  editData: any;
  getListPolicy?: any;
}> = ({handleClose, editData, getListPolicy}) => {
  const [mediaType, setMediaType] = useState([]);
  const [couponType, setCouponType] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productListOption, setProductListOption] = useState([]);
  const [options, setOptions] = useState([]);
  const [optionValues, setOptionValues] = useState([]);
  const [statusList, setStatusList] = useState<Status[]>([]);
  const formRef = useRef<HTMLFormElement>(null); // Specify the type for TypeScript

  // Helper function to reset dependent fields
  const resetDependentFields = (
    level: 'category' | 'product' | 'option',
  ): void => {
    switch (level) {
      case 'category':
        void formik.setFieldValue('product_id', '');
        void formik.setFieldValue('product_option_id', '');
        void formik.setFieldValue('product_option_value_id', '');
        setProductListOption([]);
        setOptions([]);
        setOptionValues([]);
        break;
      case 'product':
        void formik.setFieldValue('product_option_id', '');
        void formik.setFieldValue('product_option_value_id', '');
        setOptions([]);
        setOptionValues([]);
        break;
      case 'option':
        void formik.setFieldValue('product_option_value_id', '');
        setOptionValues([]);
        break;
    }
  };

  const formik = useFormik({
    initialValues: {
      name: editData?.name ?? '',
      media_type_id: editData?.media_type_id ?? '',
      category_id: editData?.category_id ?? '',
      product_id: editData?.product_id ?? '',
      product_option_id: editData?.product_option_id ?? '',
      product_option_value_id: editData?.product_option_value_id ?? '',
      coupon_type_id: editData?.coupon_type_id ?? '',
      code: editData?.code ?? '',
      value: editData?.value ?? '',
      max_use: editData?.max_use ?? '',
      use_per_customer: editData?.use_per_customer ?? '',
      status: editData?.status ?? '',
      max_amount: editData?.max_amount ?? '',
      min_order_value: editData?.min_order_value ?? '',
      start_date: editData?.start_date ?? '',
      end_date: editData?.end_date ?? '',
      terms_and_condition: editData?.terms_and_condition ?? '',
      other_media_type: editData?.other_media_type ?? '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Name is Required'),
      media_type_id: Yup.number()
        .positive('Media Type must be positive')
        .required('Media Type is required'),
      other_media_type: Yup.string().when(
        'media_type_id',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        (media_type_id, schema) => {
          return Number(media_type_id) === 4
            ? schema
                .trim()
                .required('Other Type is required when Media Type is other')
            : schema.notRequired();
        },
      ),
      // category_id: Yup.mixed().required('Category is required'),
      product_id: Yup.mixed().optional(),
      product_option_id: Yup.mixed().optional(),
      product_option_value_id: Yup.mixed().optional(),
      coupon_type_id: Yup.string().required('Coupon type is required'),
      code: Yup.string().required('Code is required'),
      value: Yup.number()
        .positive('Value must be positive')
        .required('Value is required'),
      max_use: Yup.number()
        .positive('Max use of coupon must be positive')
        .required('Max use of coupon is required'),
      use_per_customer: Yup.number()
        .positive('Use per customer must be positive')
        .required('Use per customer is required'),
      status: Yup.number()
        .positive('Status must be positive')
        .required('Status is required'),
      // max_amount: Yup.number()
      //   .positive('Max Dicount Amount must be positive')
      //   .required('Max Dicount Amount is required'),
      min_order_value: Yup.number()
        .positive('Total Cart Amount must be positive')
        .required('Total Cart Amount is required'),
      start_date: Yup.date().required('Start Date is required'),
      end_date: Yup.date().required('End Date is required'),
      terms_and_condition: Yup.string().required(
        'Terms and Conditions are required',
      ),
    }),
    onSubmit: async values => {
      try {
        if (editData !== undefined) {
          (values as any).id = String(editData.id);
        }
        const response: any =
          editData !== undefined
            ? await ApiUtils.updateCoupon(values)
            : await ApiUtils.createCoupon(values);
        toast.success(response.message);
        getListPolicy();
        // Reset form state after successful submission
        resetDependentFields('category');
        handleClose();
      } catch (error: any | unknown) {
        if (
          Boolean(error.response) &&
          typeof error.response.data === 'object' &&
          'message' in error.response.data
        ) {
          toast.error(error.response.data.message);
        } else {
          // Something happened in setting up the request that triggered an Error

          toast.error('An unexpected error occurred.');
          handleClose();
        }
      }
    },
  });
  const validateAndSubmit: any = async () => {
    const errors = await formik.validateForm();

    if (Object.keys(errors).length > 0) {
      // Scroll to the form if there are errors
      if (formRef.current != null) {
        formRef.current.scrollIntoView({behavior: 'smooth'});
      }
      // Set touched fields to show validation messages

      return false; // Stop further execution if there are validation errors
    }
  };
  const fetchCouponMediaType = async (): Promise<void> => {
    try {
      const res = await ApiUtils.couponMediaType();
      setMediaType((res as any)?.data?.coupon_media_type);
      setCouponType((res as any)?.data?.coupon_type);
    } catch (err) {
      toast.error((err as any)?.message);
    }
  };

  const fetchCategories = async (): Promise<void> => {
    try {
      const res = await ApiUtils.getCategory();
      const mappedData = (res as any)?.data?.map(
        (data: CategoryDetailsTypes) => {
          const categoryName = renderCategoryOptions(data, (res as any)?.data);
          return {value: data.id, label: categoryName};
        },
      );
      setCategories(mappedData);
    } catch (err) {
      toast.error((err as any)?.message);
    }
  };

  useEffect(() => {
    void fetchCouponMediaType();
    void fetchCategories();
  }, []);

  // Handle form reset and cleanup when editData changes
  useEffect(() => {
    if (editData !== undefined && editData !== null) {
      // If category is empty, clear all dependent fields
      if (
        editData.category_id === undefined ||
        editData.category_id === null ||
        editData.category_id === ''
      ) {
        resetDependentFields('category');
      }
      // If product is empty, clear product option and option value fields
      else if (
        typeof editData.product_id === 'undefined' ||
        editData.product_id === null ||
        editData.product_id === ''
      ) {
        resetDependentFields('product');
      }
      // If product option is empty, clear option value field
      else if (
        editData.product_option_id === undefined ||
        editData.product_option_id === null ||
        editData.product_option_id === ''
      ) {
        resetDependentFields('option');
      }
    } else {
      // Reset all dependent fields when creating new coupon
      resetDependentFields('category');
    }
  }, [editData]);

  useEffect(() => {
    if (Boolean(editData?.product_id) && editData?.product_id !== '') {
      void fetchProductList(editData?.category_id);
    }
    if (
      Boolean(editData?.product_option_id) &&
      editData?.product_option_id !== ''
    ) {
      void fetchOptionsList(editData?.product_id);
    }
    if (
      Boolean(editData?.product_option_value_id) &&
      editData?.product_option_value_id !== ''
    ) {
      void fetchOptionValuesList(editData?.product_option_id);
    }
  }, [editData]);

  useEffect(() => {
    void fetchStatus();
  }, []);

  const fetchProductList = async (id: string): Promise<void> => {
    try {
      const response = await ApiUtils.getProductByCategoryId({
        category_id: [id],
      });
      const mappedData = (response as any)?.data?.map(
        (data: CategoryDetailsTypes) => {
          return {value: data.id, label: data.name};
        },
      );
      setProductListOption(mappedData);
    } catch (err) {
      toast.error((err as any)?.message);
    }
  };

  // Call the function wherever needed, passing the required 'id' parameter

  const fetchOptionsList = async (id: string): Promise<void> => {
    try {
      const response = await ApiUtils.getOptionByProductById({
        product_id: [id],
      });
      const mappedData = (response as any)?.data?.map(
        (data: CategoryDetailsTypes) => {
          return {value: data.id, label: data.name};
        },
      );
      setOptions(mappedData);
    } catch (err) {
      toast.error((err as any)?.message);
    }
  };

  // Call the function wherever needed, passing the required 'id' parameter

  const fetchOptionValuesList = async (id: string): Promise<void> => {
    try {
      const response = await ApiUtils.getOptionValueByOptionId({
        product_option_id: [id],
      });
      const mappedData = (response as any)?.data?.map(
        (data: CategoryDetailsTypes) => {
          return {value: data.id, label: data.name};
        },
      );
      setOptionValues(mappedData);
    } catch (err) {
      toast.error((err as any)?.message);
    }
  };

  const fetchStatus = async (): Promise<void> => {
    try {
      const response: any = await ApiUtils.getStatus(`type=coupon_code`);
      setStatusList(response.data);
    } catch (err: any) {
      ToasterMessage('error', err.message);
    }
  };

  return (
    <Form
      ref={formRef}
      onSubmit={e => {
        formik.handleSubmit(e);
        validateAndSubmit();
      }}>
      <Row>
        <Row>
          <div className="d-flex">
            <Form.Label className="mb-3">Coupon Type</Form.Label>
            <TooltipWithInfoIcon text={tooltipMessage.CouponType} />
          </div>
          <Col lg={6} className="d-flex justify-content-between">
            {couponType?.map((type: {id: number; name: string}) => (
              <div className="d-flex gap-1" key={type.id}>
                <Form.Check
                  type="radio"
                  name="coupon_type_id"
                  id={`coupon_type_id-${type.id}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={type.id}
                  checked={
                    Number(formik.values.coupon_type_id) === Number(type.id)
                  }
                />
                <Form.Label htmlFor={`coupon_type_id-${type.id}`}>
                  {type.name}
                </Form.Label>
              </div>
            ))}
          </Col>
          {Boolean(formik.touched.coupon_type_id) && (
            <Form.Control.Feedback className="mb-3" type="invalid">
              {formik.errors.coupon_type_id as string}
            </Form.Control.Feedback>
          )}
        </Row>

        <Col lg={6}>
          <div className="mb-3">
            <div className="d-flex">
              <Form.Label htmlFor="name">Coupon Name</Form.Label>

              <TooltipWithInfoIcon text={tooltipMessage.CouponName} />
            </div>
            <Form.Control
              type="text"
              id="name"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              isInvalid={
                Boolean(formik.touched.name) && !(formik.errors.name == null)
              }
            />
            {Boolean(formik.touched.name) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.name as string}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <div className="d-flex">
              <Form.Label htmlFor="code">Coupon Code</Form.Label>

              <TooltipWithInfoIcon text={tooltipMessage.CouponCode} />
            </div>
            <Form.Control
              type="text"
              id="code"
              name="code"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.code}
              isInvalid={
                Boolean(formik.touched.code) && !(formik.errors.code == null)
              }
            />
            {Boolean(formik.touched.code) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.code as string}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <div className="d-flex">
              <Form.Label htmlFor="value">Code Value</Form.Label>
              <TooltipWithInfoIcon text={tooltipMessage.CouponValue} />
            </div>
            <div className="input-group has-validation mb-3">
              <span
                className="input-group-text fs-6"
                id="product-special_price-addon">
                {Number(formik.values.coupon_type_id) === 1 ? '%' : '₹'}
              </span>
              <Form.Control
                type="number"
                id="value"
                name="value"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.value}
                isInvalid={
                  Boolean(formik.touched.value) &&
                  !(formik.errors.value == null)
                }
              />
            </div>
            {Boolean(formik.touched.value) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.value as string}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <div className="d-flex">
              <Form.Label htmlFor="media_type_id">Media Type</Form.Label>

              <TooltipWithInfoIcon text={tooltipMessage.CouponMedia} />
            </div>
            <Form.Select
              name="media_type_id"
              aria-label="Default select example"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.media_type_id ?? ''}
              isInvalid={
                Boolean(formik.touched.media_type_id) &&
                !(formik.errors.media_type_id == null)
              }>
              <option selected>Select media type </option>
              {mediaType?.map((type: {id: number; name: string}) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Form.Select>
            {Boolean(formik.touched.media_type_id) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.media_type_id as string}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>
        {Number(formik.values.media_type_id) === 4 && (
          <Col lg={6}>
            <div className="mb-3">
              <div className="d-flex">
                <Form.Label htmlFor="media_type_id">
                  Media Type Other
                </Form.Label>

                <TooltipWithInfoIcon text={tooltipMessage.CouponMediaOther} />
              </div>
              <Form.Control
                type="text"
                id="other_media_type"
                name="other_media_type"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik?.values?.other_media_type}
                isInvalid={
                  Boolean(formik?.touched?.other_media_type) &&
                  !(formik?.errors?.other_media_type == null)
                }
              />
              {Boolean(formik?.touched?.other_media_type) && (
                <Form.Control.Feedback type="invalid">
                  {formik?.errors?.other_media_type as string}
                </Form.Control.Feedback>
              )}
            </div>
          </Col>
        )}

        <Col lg={6}>
          <div className="mb-3">
            <div className="d-flex">
              <Form.Label htmlFor="category_id">Category</Form.Label>

              <TooltipWithInfoIcon text={tooltipMessage.CouponCategory} />
            </div>
            <Form.Select
              name="category_id"
              id="category_id"
              onChange={e => {
                void formik.setFieldValue('category_id', e.target.value);
                // Reset dependent fields when category is cleared
                if (e.target.value === '') {
                  resetDependentFields('category');
                } else {
                  void fetchProductList(String(e.target.value));
                }
              }}
              value={
                formik.values.category_id !== ''
                  ? formik.values.category_id
                  : ''
              }
              onBlur={formik.handleBlur}
              aria-label="Default select example"
              isInvalid={
                Boolean(formik.touched.category_id) &&
                !(formik.errors.category_id == null)
              }>
              <option value="" selected>
                Select Category{' '}
              </option>
              {categories?.map((category: {value: string; label: string}) => (
                <option value={category.value} key={category.value}>
                  {category.label}
                </option>
              ))}
            </Form.Select>
            {Boolean(formik.touched.category_id) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.category_id as string}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <div className="d-flex">
              <Form.Label htmlFor="product_id">Product</Form.Label>

              <TooltipWithInfoIcon text={tooltipMessage.CouponProduct} />
            </div>
            <Form.Select
              name="product_id"
              id="product_id"
              value={formik.values.product_id ?? ''}
              onChange={e => {
                void formik.setFieldValue('product_id', e.target.value);
                // Reset dependent fields when product is cleared
                if (e.target.value === '') {
                  resetDependentFields('product');
                } else {
                  void fetchOptionsList(String(e.target.value));
                }
              }}
              onBlur={formik.handleBlur}
              isInvalid={
                Boolean(formik.touched.product_id) &&
                !(formik.errors.product_id == null)
              }
              aria-label="Default select example">
              <option value="" selected>
                Select Product{' '}
              </option>
              {productListOption?.map(
                (product: {value: string; label: string}) => (
                  <option value={product.value} key={product.value}>
                    {product.label}
                  </option>
                ),
              )}
            </Form.Select>
            {Boolean(formik.touched.product_id) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.product_id as string}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <div className="d-flex">
              <Form.Label htmlFor="product_option_id">
                Product Option{' '}
              </Form.Label>

              <TooltipWithInfoIcon text={tooltipMessage.CouponOptionType} />
            </div>
            <Form.Select
              name="product_option_id"
              id="product_option_id"
              value={formik.values.product_option_id ?? ''}
              onChange={e => {
                void formik.setFieldValue('product_option_id', e.target.value);
                // Reset dependent field when product option is cleared
                if (e.target.value === '') {
                  resetDependentFields('option');
                } else {
                  void fetchOptionValuesList(String(e.target.value));
                }
              }}
              onBlur={formik.handleBlur}
              isInvalid={
                Boolean(formik.touched.product_option_id) &&
                !(formik.errors.product_option_id == null)
              }
              aria-label="Default select example">
              <option value="" selected>
                Select Product Option{' '}
              </option>
              {options?.map((option: {value: string; label: string}) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
            {Boolean(formik.touched.product_option_id) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.product_option_id as string}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <div className="d-flex">
              <Form.Label htmlFor="product_option_value_id">
                Product Option Value
              </Form.Label>

              <TooltipWithInfoIcon text={tooltipMessage.CouponOptionValue} />
            </div>
            <Form.Select
              name="product_option_value_id"
              id="product_option_value_id"
              value={formik.values.product_option_value_id ?? ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                Boolean(formik.touched.product_option_value_id) &&
                !(formik.errors.product_option_value_id == null)
              }
              aria-label="Default select example">
              <option value="" selected>
                Select Product Option Value{' '}
              </option>
              {optionValues?.map((option: {value: string; label: string}) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
            {Boolean(formik.touched.product_option_value_id) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.product_option_value_id as string}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <div className="d-flex">
              <Form.Label htmlFor="max_amount">Max Dicount Amount</Form.Label>

              <TooltipWithInfoIcon text={tooltipMessage.CouponMaximumAmount} />
            </div>
            <div className="input-group has-validation mb-3">
              <span
                className="input-group-text fs-6"
                id="product-special_price-addon">
                ₹
              </span>
              <Form.Control
                type="number"
                id="max_amount"
                name="max_amount"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.max_amount}
                isInvalid={
                  Boolean(formik.touched.max_amount) &&
                  !(formik.errors.max_amount == null)
                }
              />
            </div>
            {Boolean(formik.touched.max_amount) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.max_amount as string}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <div className="d-flex">
              <Form.Label htmlFor="use_per_customer">
                User Per Customer
              </Form.Label>

              <TooltipWithInfoIcon text={tooltipMessage.CouponUseTime} />
            </div>
            <Form.Control
              type="number"
              id="use_per_customer"
              name="use_per_customer"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.use_per_customer}
              isInvalid={
                Boolean(formik.touched.use_per_customer) &&
                !(formik.errors.use_per_customer == null)
              }
            />
            {Boolean(formik.touched.use_per_customer) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.use_per_customer as string}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <div className="d-flex">
              <Form.Label htmlFor="min_order_value">
                Total Cart Amount
              </Form.Label>

              <TooltipWithInfoIcon
                text={tooltipMessage.CouponMinimumOrderAmount}
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
                id="min_order_value"
                name="min_order_value"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik?.values?.min_order_value}
                isInvalid={
                  Boolean(formik?.touched?.min_order_value) &&
                  !(formik?.errors?.min_order_value == null)
                }
              />
            </div>
            {Boolean(formik?.touched?.min_order_value) && (
              <Form.Control.Feedback type="invalid">
                {formik?.errors?.min_order_value as string}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <div className="d-flex">
              <Form.Label htmlFor="max_use">Max usage of coupon</Form.Label>

              <TooltipWithInfoIcon text={tooltipMessage.CouponMaximumUse} />
            </div>
            <Form.Control
              type="number"
              id="max_use"
              name="max_use"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik?.values?.max_use}
              isInvalid={
                Boolean(formik?.touched?.max_use) &&
                !(formik?.errors?.max_use == null)
              }
            />
            {Boolean(formik?.touched?.max_use) && (
              <Form.Control.Feedback type="invalid">
                {formik?.errors?.max_use as string}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <div className="d-flex">
              <Form.Label htmlFor="start_date">Start Date</Form.Label>

              <TooltipWithInfoIcon text={tooltipMessage.CouponStartDate} />
            </div>
            <Form.Control
              type="date"
              id="start_date"
              name="start_date"
              // min={new Date().toISOString().split('T')[0]}
              min={
                editData?.id === undefined || editData?.id === null
                  ? new Date().toISOString().split('T')[0]
                  : undefined
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.start_date}
              isInvalid={
                Boolean(formik.touched.start_date) &&
                !(formik.errors.start_date == null)
              }
            />
            {Boolean(formik.touched.start_date) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.start_date as string}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3">
            <div className="d-flex">
              <Form.Label htmlFor="start_date">End Date</Form.Label>

              <TooltipWithInfoIcon text={tooltipMessage.CouponEndDate} />
            </div>
            <Form.Control
              type="date"
              id="end_date"
              name="end_date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.end_date}
              min={formik.values.start_date}
              isInvalid={
                Boolean(formik.touched.end_date) &&
                !(formik.errors.end_date == null)
              }
            />
            {Boolean(formik.touched.end_date) && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.end_date as string}
              </Form.Control.Feedback>
            )}
          </div>
        </Col>
        <Col lg={6}>
          <div className="mb-3">
            <div className="d-flex">
              <Form.Label htmlFor="status-Field">Status</Form.Label>

              <TooltipWithInfoIcon text={tooltipMessage.CouponStaus} />
            </div>
            <Form.Select
              className="form-select"
              name="status"
              id="status-Field"
              value={formik.values.status ?? ''}
              onChange={async e =>
                await formik.setFieldValue('status', Number(e.target.value))
              }
              isInvalid={
                Boolean(formik.touched.status) &&
                !(formik.errors.status == null)
              }>
              <option value="">Status</option>
              {statusList?.map((status: any) => (
                <option key={status?.id} value={status?.id}>
                  {status.name}
                </option>
              ))}
            </Form.Select>

            {Boolean(formik.touched.status) && Boolean(formik.errors.status) ? (
              <Form.Control.Feedback type="invalid">
                {formik.errors.status as string}
              </Form.Control.Feedback>
            ) : null}
          </div>
        </Col>
        <Col lg={12}>
          <div className="mb-3">
            <div className="d-flex">
              <Form.Label htmlFor="terms_and_condition">
                Terms and Conditions
              </Form.Label>

              <TooltipWithInfoIcon text={tooltipMessage.CouponTerms} />
            </div>
            <CKEditor
              editor={ClassicEditor}
              config={editorConfiguration}
              data={formik.values.terms_and_condition}
              name="terms_and_condition"
              onChange={(_event: any, editor: any) => {
                editor.getData();
                void formik.setFieldValue(
                  'terms_and_condition',
                  editor.getData(),
                );
              }}
              style={{
                maxWidth: '400px',
                wordWrap: 'break-word',
              }}
            />

            {Boolean(formik.touched.terms_and_condition) &&
            Boolean(formik.errors.terms_and_condition) ? (
              <div className="invalid-feedback  ">
                {formik.errors.terms_and_condition as string}
              </div>
            ) : null}
          </div>
        </Col>
        <Col lg={12} className="modal-footer">
          <div className="hstack gap-2 justify-content-end">
            <Button variant="primary" id="add-btn" type="submit">
              Submit
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default AddCoupons;
