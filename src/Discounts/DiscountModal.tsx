/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Modal, Row} from 'react-bootstrap';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import ApiUtils from 'api/ApiUtils';
import {renderCategoryOptions} from 'utils/CategoryOption';
import {type CategoryDetailsTypes} from 'utils/TypeConfig';
import {toast} from 'react-toastify';
import {ToasterMessage} from 'helpers/ToastHelper';
import TooltipWithInfoIcon from 'Common/InfoTool';
import {tooltipMessage} from 'utils/Tooltips';
interface Status {
  id: string;
  name: string;
  model: string;
}
interface Discount {
  modalAddDiscountsModals: boolean;
  togAddDiscountsModals: () => void;
  title: string;
  editDiscount: any;
  isSetEditDiscount?: any;
  isSetAddDiscount?: any;
}
const DiscountModal = ({
  modalAddDiscountsModals,
  togAddDiscountsModals,
  editDiscount,
  title,
  isSetEditDiscount,
  isSetAddDiscount,
}: Discount): JSX.Element => {
  const [categories, setCategories] = useState([]);
  const [productListOption, setProductListOption] = useState([]);
  const [options, setOptions] = useState([]);
  const [optionValues, setOptionValues] = useState([]);
  const [statusList, setStatusList] = useState<Status[]>([]);

  const [priceList, setPriceList] = useState<Status[]>([]);
  const fetchStatus = async (): Promise<void> => {
    try {
      const response: any = await ApiUtils.getStatus(
        `type=product_discount_status`,
      );
      setStatusList(response.data);
    } catch (err: any) {
      ToasterMessage('error', err.message);
    }
  };
  const fetchPriceEffect = async (): Promise<void> => {
    try {
      const response: any = await ApiUtils.getStatus(`type=price_effect`);
      setPriceList(response.data);
    } catch (err: any) {
      ToasterMessage('error', err.message);
    }
  };

  useEffect(() => {
    void fetchStatus();
    void fetchPriceEffect();
  }, []);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editDiscount?.name !== '' ? editDiscount?.name : '',
      category_id: editDiscount?.category_id ?? '',
      priceType: editDiscount?.price_effect ?? '',
      product_id: editDiscount?.product_id ?? null,
      product_option_id: editDiscount?.product_option_id ?? null,
      product_option_value_id: editDiscount?.product_option_value_id ?? null,
      discount: editDiscount?.value !== '' ? editDiscount?.value : null,
      start_date: editDiscount?.start_date ?? '',
      end_date: editDiscount?.end_date ?? '',
      status: editDiscount?.status_id !== '' ? editDiscount?.status_id : null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Discount name is required'),
      discount: Yup.number().required(),
      priceType: Yup.number().required('Price Type is required'),
      category_id: Yup.mixed().required('Category is required'),
      status: Yup.number().required('Status is required'),
      start_date: Yup.date().required('Start Date is required'),
      end_date: Yup.date().required('End Date is required'),
    }),
    onSubmit: (values: any) => {
      const body = {
        name: values.name,
        category_id: values.category_id,
        product_id: values.product_id || '', // If no product_id, use an empty string
        product_option_id: values.product_option_id || '', // If no product_option_id, use an empty string
        product_option_value_id: values.product_option_value_id || '', // If no product_option_value_id, use an empty string
        value: values.discount,
        start_date: values.start_date,
        end_date: values.end_date,
        status_id: parseInt(values.status),
        price_effect: parseInt(values.priceType),
        ...(editDiscount.id && {id: editDiscount.id}), // Only add `id` if `editDiscount.id` exists
      };

      if (editDiscount.id) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        ApiUtils.updateDiscount(body)
          .then((data: any) => {
            toast.success(data?.message);
            validation.resetForm();
            isSetEditDiscount(true);
          })
          .catch((error: any) => {
            toast.error(error?.response?.data?.message);
          });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        ApiUtils.createDiscount(body)
          .then((data: any) => {
            toast.success(data?.message);
            isSetAddDiscount(true);
            validation.resetForm();
            togAddDiscountsModals();
          })
          .catch((error: any) => {
            toast.error(error?.response?.data?.message);
          });
      }
      togAddDiscountsModals();
    },
  });

  useEffect(() => {
    ApiUtils.getCategory()
      .then((res: any): any => {
        const mappedData = res?.data?.map((data: CategoryDetailsTypes) => {
          const categoryName = renderCategoryOptions(data, res?.data);
          return {value: data.id, label: categoryName};
        });
        setCategories(mappedData);
      })
      .catch(err => {
        toast.error(err?.message);
      });
  }, []);
  useEffect(() => {
    if (editDiscount?.product_id !== '') {
      fetchProductList(editDiscount?.category_id);
    }
    if (editDiscount?.product_option_id !== '') {
      fetchOptionsList(editDiscount?.product_id);
    }
    if (editDiscount?.product_option_value_id !== '') {
      fetchOptionValuesList(editDiscount?.product_option_id);
    }
  }, [editDiscount]);
  const fetchProductList = (id: string): void => {
    ApiUtils.getProductByCategoryId({category_id: [id]})
      .then((response: any) => {
        const mappedData = response?.data?.map((data: CategoryDetailsTypes) => {
          return {value: data.id, label: data.name};
        });
        setProductListOption(mappedData);
      })
      .catch(err => {
        toast.error(err?.message);
      });
  };
  const fetchOptionsList = (id: string): void => {
    ApiUtils.getOptionByProductById({product_id: [id]})
      .then((response: any) => {
        const mappedData = response?.data?.map((data: CategoryDetailsTypes) => {
          return {value: data.id, label: data.name};
        });
        setOptions(mappedData);
      })
      .catch(err => {
        toast.error(err?.message);
      });
  };
  const fetchOptionValuesList = (id: string): void => {
    ApiUtils.getOptionValueByOptionId({product_option_id: [id]})
      .then((response: any) => {
        const mappedData = response?.data?.map((data: CategoryDetailsTypes) => {
          return {value: data.id, label: data.name};
        });
        setOptionValues(mappedData);
      })
      .catch(err => {
        toast.error(err?.message);
      });
  };

  return (
    <Modal
      id="showModal"
      className="fade zoomIn"
      size="lg"
      show={modalAddDiscountsModals}
      onHide={() => {
        togAddDiscountsModals();
      }}
      centered>
      <Modal.Header className="px-4 pt-4" closeButton>
        <h5 className="modal-title fs-18" id="exampleModalLabel">
          {title}
        </h5>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form
          onSubmit={e => {
            e.preventDefault();
            validation.handleSubmit();
          }}
          className="tablelist-form">
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <div className="d-flex">
                  Discount Name
                  <TooltipWithInfoIcon text={tooltipMessage.DiscountName} />
                </div>
                <Form.Control
                  type="text"
                  id="discount-name"
                  placeholder="Enter discount name"
                  name="name"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  defaultValue={
                    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                    validation?.values?.name || editDiscount?.name
                      ? editDiscount?.name
                      : ''
                  }
                  isInvalid={
                    !!(
                      Boolean(validation.touched.name) &&
                      Boolean(validation.errors.name)
                    )
                  }
                />
                {Boolean(validation.touched.name) &&
                Boolean(validation.errors.name) ? (
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.name}
                  </Form.Control.Feedback>
                ) : null}
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3" data-testID="status">
                <div className="d-flex">
                  Status
                  <TooltipWithInfoIcon text={tooltipMessage.DiscountStaus} />
                </div>
                <Form.Select
                  className="form-select"
                  name="status"
                  id="status-Field"
                  value={validation.values.status ?? ''}
                  onChange={e =>
                    validation.setFieldValue('status', Number(e.target.value))
                  }
                  onBlur={validation.handleBlur}
                  isInvalid={
                    Boolean(validation.touched.status) &&
                    !(validation.errors.status == null)
                  }>
                  <option selected>Status</option>
                  {statusList?.map((status: any) => (
                    <option key={status?.id} value={status?.id}>
                      {status.name}
                    </option>
                  ))}
                </Form.Select>
                {Boolean(validation.touched.name) && (
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.status}
                  </Form.Control.Feedback>
                )}
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <div className="d-flex">
                  Select Type
                  <TooltipWithInfoIcon text={tooltipMessage.DiscountType} />
                </div>
                <Form.Select
                  className="form-select"
                  name="priceType"
                  id="statusSelect"
                  value={validation.values.priceType ?? ''}
                  onChange={e =>
                    validation.setFieldValue(
                      'priceType',
                      Number(e.target.value),
                    )
                  }
                  onBlur={validation.handleBlur}
                  isInvalid={
                    Boolean(validation.touched.priceType) &&
                    !(validation.errors.priceType == null)
                  }>
                  <option selected>--Select--</option>
                  {priceList?.map((status: any) => (
                    <option key={status?.id} value={status?.id}>
                      {status.name}
                    </option>
                  ))}
                </Form.Select>
                {Boolean(validation.touched.priceType) && (
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.priceType}
                  </Form.Control.Feedback>
                )}
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <div className="d-flex">
                  Price up & Down Value
                  <TooltipWithInfoIcon
                    text={tooltipMessage.DiscountPriceType}
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
                    id="code-field"
                    placeholder="Enter Price up & Down Value"
                    name="discount"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation?.values?.discount ?? ''}
                    isInvalid={
                      !!(
                        Boolean(validation.touched.discount) &&
                        Boolean(validation.errors.discount)
                      )
                    }
                  />
                </div>
                {Boolean(validation.touched.discount) &&
                Boolean(validation.errors.discount) ? (
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.discount}
                  </Form.Control.Feedback>
                ) : null}
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <div className="d-flex">
                  Category{' '}
                  <TooltipWithInfoIcon text={tooltipMessage.DiscountCategory} />
                </div>
                <Form.Select
                  name="category_id"
                  id="category_id"
                  onChange={e => {
                    void validation.setFieldValue(
                      'category_id',
                      e.target.value,
                    );
                    fetchProductList(String(e.target.value));
                  }}
                  value={
                    validation.values.category_id !== ''
                      ? validation.values.category_id
                      : ''
                  }
                  onBlur={validation.handleBlur}
                  aria-label="Default select example"
                  isInvalid={
                    Boolean(validation.touched.category_id) &&
                    !(validation.errors.category_id == null)
                  }>
                  <option value="" selected>
                    Select Category{' '}
                  </option>
                  {categories?.map(
                    (category: {value: number; label: string}) => (
                      <option value={category.value} key={category.value}>
                        {category.label}
                      </option>
                    ),
                  )}
                </Form.Select>
                {Boolean(validation.touched.category_id) && (
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.category_id as string}
                  </Form.Control.Feedback>
                )}
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <div className="d-flex">
                  Product
                  <TooltipWithInfoIcon text={tooltipMessage.DiscountProduct} />
                </div>
                <Form.Select
                  name="product_id"
                  id="product_id"
                  value={validation.values.product_id ?? ''}
                  onChange={e => {
                    void validation.setFieldValue('product_id', e.target.value);
                    fetchOptionsList(String(e.target.value));
                  }}
                  onBlur={validation.handleBlur}
                  isInvalid={
                    Boolean(validation.touched.product_id) &&
                    !(validation.errors.product_id == null)
                  }
                  aria-label="Default select example">
                  <option value="" selected>
                    Select Product{' '}
                  </option>
                  {productListOption?.map(
                    (product: {value: number; label: string}) => (
                      <option value={product.value} key={product.value}>
                        {product.label}
                      </option>
                    ),
                  )}
                </Form.Select>
                {Boolean(validation.touched.product_id) && (
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.product_id as string}
                  </Form.Control.Feedback>
                )}
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <div className="d-flex">
                  Product Option{' '}
                  <TooltipWithInfoIcon
                    text={tooltipMessage.DiscountProductOption}
                  />
                </div>
                <Form.Select
                  name="product_option_id"
                  id="product_option_id"
                  value={validation.values.product_option_id ?? ''}
                  onChange={e => {
                    void validation.setFieldValue(
                      'product_option_id',
                      e.target.value,
                    );
                    fetchOptionValuesList(String(e.target.value));
                  }}
                  onBlur={validation.handleBlur}
                  isInvalid={
                    Boolean(validation.touched.product_option_id) &&
                    !(validation.errors.product_option_id == null)
                  }
                  aria-label="Default select example">
                  <option value="" selected>
                    Select Product Option{' '}
                  </option>
                  {options?.map((option: {value: number; label: string}) => (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
                {Boolean(validation.touched.product_option_id) && (
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.product_option_id as string}
                  </Form.Control.Feedback>
                )}
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <div className="d-flex">
                  Product Option Value{' '}
                  <TooltipWithInfoIcon
                    text={tooltipMessage.DiscountProductOptionValue}
                  />
                </div>
                <Form.Select
                  name="product_option_value_id"
                  id="product_option_value_id"
                  value={validation.values.product_option_value_id ?? ''}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  isInvalid={
                    Boolean(validation.touched.product_option_value_id) &&
                    !(validation.errors.product_option_value_id == null)
                  }
                  aria-label="Default select example">
                  <option value="" selected>
                    Select Product Option Value{' '}
                  </option>
                  {optionValues?.map(
                    (option: {value: number; label: string}) => (
                      <option value={option.value} key={option.value}>
                        {option.label}
                      </option>
                    ),
                  )}
                </Form.Select>
                {Boolean(validation.touched.product_option_value_id) && (
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.product_option_value_id as string}
                  </Form.Control.Feedback>
                )}
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <div className="d-flex">
                  Start Date
                  <TooltipWithInfoIcon
                    text={tooltipMessage.DiscountStartDate}
                  />
                </div>
                <Form.Control
                  type="date"
                  id="start_date"
                  name="start_date"
                  min={
                    !editDiscount?.id ||
                    editDiscount?.id === undefined ||
                    editDiscount?.id === null
                      ? new Date().toISOString().split('T')[0]
                      : undefined
                  }
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.start_date}
                  isInvalid={
                    Boolean(validation.touched.start_date) &&
                    !(validation.errors.start_date == null)
                  }
                />
                {Boolean(validation.touched.start_date) && (
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.start_date as string}
                  </Form.Control.Feedback>
                )}
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <div className="d-flex">
                  End Date
                  <TooltipWithInfoIcon text={tooltipMessage.DiscountEndDate} />
                </div>
                <Form.Control
                  type="date"
                  id="end_date"
                  name="end_date"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.end_date}
                  min={validation.values.start_date}
                  isInvalid={
                    Boolean(validation.touched.end_date) &&
                    !(validation.errors.end_date == null)
                  }
                />
                {Boolean(validation.touched.end_date) && (
                  <Form.Control.Feedback type="invalid">
                    {validation.errors.end_date as string}
                  </Form.Control.Feedback>
                )}
              </div>
            </Col>

            <Col lg={12} className="modal-footer">
              <div className="hstack gap-2 justify-content-end">
                <Button type="submit" variant="primary" id="add-btn">
                  {title}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DiscountModal;
