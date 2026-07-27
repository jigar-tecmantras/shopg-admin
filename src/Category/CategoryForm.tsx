/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import ApiUtils from 'api/ApiUtils';
import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';
import categoryImagePlaceholder from 'assets/images/default-placeholder.jpg';
import {
  type CategoryFormProps,
  type CategoryDetailsTypes,
  type CategoryStatusList,
} from 'utils/TypeConfig';
import {useFormik} from 'formik';

import * as Yup from 'yup';
import {renderCategoryOptions} from 'helpers/CategoryOption';
import {toast} from 'react-toastify';
import Select from 'react-select';
import {useSelector} from 'react-redux';
import TooltipWithInfoIcon from 'Common/InfoTool';
import {tooltipMessage} from 'utils/Tooltips';
const CategoryForm: React.FC<CategoryFormProps> = ({
  handleClose,
  setIsEditCategory,
  setIsAddCategory,
  editCategory,
}) => {
  // console.log('🚀 ~ editCategory:', editCategory);
  const [status, setStatus] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [imageDisplay, setImageDisplay] = useState<string>();

  const [brandListOption, setBrandListOption] = useState([]);
  const [selectedBrandOption, setSelectedBranOption] = useState([]);

  const [brandPayload, setBrandPayload] = useState([]);
  const [removeBrand, setRemoveBrand] = useState<any[]>([]);
  const {Layout}: any = useSelector(state => state);

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (Layout.layoutModeType === 'dark') {
      setIsDark(true);
    } else if (Layout.layoutModeType === 'light') {
      setIsDark(false);
    } else {
      setIsDark(false);
    }
  }, [Layout.layoutModeType]);
  const colourStyles = {
    control: (base: any) => ({
      ...base,
      background: '#0c192c',
      borderColor: '#132846',
      borderRadius: '0px',
      '&:hover': {
        borderColor: '#132846',
      },
    }),
    option: (provided: any, state: {isFocused: boolean}) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#6cb5f9' : '#0E203A', // Set background color to white when focused
      color: state.isFocused ? 'white' : '#bbc2cd', // Set text color to black when focused
      '&:hover': {
        backgroundColor: '#6cb5f9', // Set background color to white on hover
        color: 'white', // Set text color to black on hover
      },
    }),
  };

  useEffect(() => {
    const fetchStatus = async (): Promise<void> => {
      try {
        const queryParams = 'type=category';
        const response: any = await ApiUtils.getStatus(queryParams);
        setStatus(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchCategoryList = async (): Promise<void> => {
      try {
        const response: any = await ApiUtils.getCategory();
        setCategoryList(response?.data);
      } catch (err) {
        console.error(err);
      }
    };

    void fetchStatus();
    void fetchCategoryList();
  }, []);

  useEffect(() => {
    if (editCategory?.category_brand) {
      const initialSelectedBrands = editCategory.category_brand.map(
        (brand: any) => ({
          value: brand.brand_id,
          label: brand.brand_name,
        }),
      );
      setSelectedBranOption(initialSelectedBrands);
    }
  }, [editCategory]);

  // const handleSelectBrandChange = (selected: any): void => {
  //   setSelectedBranOption(selected);

  //   const addedBrands = selected.filter(
  //     (brand: any) =>
  //       !selectedBrandOption.some((b: any) => b.value === brand.value),
  //   );
  //   const removedBrands: any = selectedBrandOption.filter(
  //     (b: any) => !selected.some((brand: any) => b.value === brand.value),
  //   );

  //   setRemoveBrand(removedBrands);

  //   const newBrandPayload: any = [
  //     ...brandPayload,
  //     ...addedBrands.map((brand: any) => ({
  //       brand_id: brand.value,
  //       type: 'create',
  //     })),
  //     ...removedBrands
  //       .filter((brand: any) => {
  //         // Check if the brand is in editCategory.category_brand
  //         return editCategory.category_brand?.some(
  //           (cb: any) => cb.brand_id === brand.value,
  //         );
  //       })
  //       .map((brand: any) => {
  //         const correspondingBrand = editCategory.category_brand.find(
  //           (cb: any) => cb.brand_id === brand.value,
  //         );
  //         return {
  //           brand_id: brand.value,
  //           category_brand_id: correspondingBrand?.id,
  //           type: 'delete',
  //         };
  //       }),
  //   ].filter(
  //     entry => entry.type !== 'delete' || entry.category_brand_id !== undefined,
  //   );

  //   setBrandPayload(newBrandPayload);
  // };

  const handleSelectBrandChange = (selected: any): void => {
    setSelectedBranOption(selected);

    const addedBrands = selected.filter(
      (brand: any) =>
        !selectedBrandOption.some((b: any) => b.value === brand.value),
    );
    const removedBrands: any = selectedBrandOption.filter(
      (b: any) => !selected.some((brand: any) => b.value === brand.value),
    );
    // test comment
    setRemoveBrand(removedBrands);

    const isExistingCategory = !!editCategory?.category_brand;

    const newBrandPayload = isExistingCategory
      ? [
          ...brandPayload,
          ...addedBrands.map((brand: any) => ({
            brand_id: brand.value,
            type: 'create',
          })),
          ...removedBrands
            .filter(
              (brand: any) =>
                editCategory.category_brand?.some(
                  (cb: any) => cb.brand_id === brand.value,
                ),
            )
            .map((brand: any) => {
              const correspondingBrand = editCategory.category_brand.find(
                (cb: any) => cb.brand_id === brand.value,
              );
              return {
                brand_id: brand.value,
                category_brand_id: correspondingBrand?.id,
                type: 'delete',
              };
            }),
        ].filter(
          entry =>
            entry.type !== 'delete' || entry.category_brand_id !== undefined,
        )
      : selected.map((brand: any) => ({
          id: brand.value,
        }));

    setBrandPayload(newBrandPayload);
  };

  useEffect(() => {
    if (removeBrand.length > 0) {
      const afterDeleteBrand = [...brandPayload];
      const result: any = afterDeleteBrand.filter(
        (brand: any) =>
          !(brand.brand_id === removeBrand[0].value && brand.type === 'create'),
      );
      // console.log(
      //   'branded payload after click remove:',
      //   brandPayload,
      //   removeBrand,
      // );
      // setBrandPayload(updateBrandPayload);
      // const afterDelete = [...brandPayload];

      setBrandPayload(result);
    }
  }, [removeBrand]);
  const getCategoryList = async (): Promise<void> => {
    try {
      const response: any = await ApiUtils.getCategory();
      setCategoryList(response?.data);
    } catch (err) {
      console.error(err);
    }
  };

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editCategory?.name !== '' ? editCategory?.name : '',
      image: editCategory?.image !== '' ? editCategory?.image : undefined,
      parent_id:
        editCategory?.parent_id !== '' ? editCategory?.parent_id : null,
      status_id: editCategory?.status_id !== '' ? editCategory?.status_id : '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Category name is required'),
      parent_id: Yup.string().notRequired(),
      image: Yup.mixed().required('Image is required'),
      status_id: Yup.number().required('Status is required'),
    }),
    onSubmit: async (values: any): Promise<void> => {
      // console.log('🚀 ~ onSubmit: ~ values:', values);

      try {
        const formData = {
          name: values.name,
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          status_id: values.status_id,
          parent_id: values.parent_id,
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          ...(editCategory?.id ? {id: editCategory?.id} : {}),
          // brand: selectedBrandOption.map((brand: any, index: number) => ({
          //   id: brand.value,
          // })),
          brand: brandPayload,
        };

        if (typeof values?.image !== 'string') {
          (formData as any).image = values?.image;
        }
        // console.log('🚀 ~ onSubmit: ~ formData:', formData);
        try {
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          const response: any = editCategory?.id
            ? await ApiUtils.updateCategory(formData)
            : await ApiUtils.addCategory(formData);
          // eslint-disable-next-line @typescript-eslint/no-floating-promises, @typescript-eslint/strict-boolean-expressions
          if (setIsEditCategory) {
            setIsEditCategory((prev: boolean) => !prev);
          }
          if (setIsAddCategory) {
            setIsAddCategory((prev: boolean) => !prev);
          }
          handleClose();
          toast.success(response?.message);
          void getCategoryList();
        } catch (error: any) {
          toast.error(error?.response?.data?.message);
        }
      } catch (err: any) {
        toast.error(err);
      }
    },
  });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file != null) {
      const objectUrl: string = URL.createObjectURL(file);
      setImageDisplay(objectUrl);
      validation.setFieldValue('image', file);
    }
  };

  useEffect(() => {
    const fetchBrandList = async (): Promise<void> => {
      try {
        const response: any = await ApiUtils.getBrand();
        const mappedData = response?.data?.map((data: CategoryDetailsTypes) => {
          const categoryName = renderCategoryOptions(data, response?.data);
          return {value: data.id, label: categoryName};
        });

        setBrandListOption(mappedData);
      } catch (err) {
        toast.error('Something went wrong');
      }
    };

    void fetchBrandList();
  }, []);

  useEffect(() => {
    const fetchBrandList = async (): Promise<void> => {
      // console.log(
      //   'Parent',
      //   editCategory?.parent_id,
      //   validation.values.parent_id,
      // );
      try {
        const parentId: any =
          validation.values.parent_id ?? editCategory?.parent_id;
        const response: any = await ApiUtils.getBrandByCategory(parentId);
        // console.log('🚀 ~ fetchBrandList ~ response:', response);

        if (response?.data.length > 0) {
          const mappedData: any = response?.data?.map((data: any) => {
            return {value: data.brand_id, label: data.brand_name};
          });
          setBrandListOption(mappedData);
        } else {
          const response: any = await ApiUtils.getBrand();
          const mappedData = response?.data?.map(
            (data: CategoryDetailsTypes) => {
              const categoryName = renderCategoryOptions(data, response?.data);
              return {value: data.id, label: categoryName};
            },
          );

          setBrandListOption(mappedData);
        }
      } catch (err) {
        toast.error('Something went wrong');
      }
    };

    void fetchBrandList();
  }, [editCategory?.parent_id, validation.values.parent_id]);

  // console.log(editCategory?.id, 'categoryList');
  return (
    <div>
      <Form
        className="tablelist-form"
        onSubmit={e => {
          e.preventDefault();
          validation.handleSubmit();
        }}>
        <Row>
          <div
            id="alert-error-msg"
            className="d-none alert alert-danger py-2"></div>
          <input type="hidden" id="id-field" />
          <Col
            lg={12}
            className="d-flex justify-content-center align-items-center">
            <div className="mb-3 category-img">
              <label
                htmlFor="category-image-input"
                className="form-label d-block text-center">
                Image <span className="text-danger">*</span>
              </label>

              <div className="avatar-upload">
                <div className="avatar-edit">
                  <input
                    type="file"
                    id="imageUpload"
                    onChange={handleImage}
                    accept=".png, .jpg, .jpeg"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="image-upload-cam d-flex justify-content-center align-items-center">
                    <i className="ri-image-fill"></i>
                  </label>
                </div>
                <div className="avatar-preview">
                  <img
                    className="preview-select-img img-responsive img-circle"
                    id="imagePreview"
                    alt="User profile picture"
                    src={
                      imageDisplay ??
                      (editCategory?.id && editCategory?.image !== ''
                        ? editCategory?.image
                        : categoryImagePlaceholder)
                    }
                    style={{height: '110px'}}
                  />
                </div>
              </div>
              {Boolean(validation.touched.image) &&
              Boolean(validation.errors.image) ? (
                <Form.Control.Feedback className="required-mark" type="invalid">
                  {validation.errors.image}
                </Form.Control.Feedback>
              ) : null}
            </div>
          </Col>
          <Col lg={12}>
            <div className="mb-3">
              <div className="d-flex">
                <Form.Label htmlFor="category-name">
                  Category Name
                  <span className="text-danger required-mark">*</span>
                </Form.Label>

                <TooltipWithInfoIcon text={tooltipMessage.CategoryName} />
              </div>
              <Form.Control
                type="text"
                id="category-name"
                placeholder="Enter Category Name"
                name="name"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                defaultValue={
                  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                  validation?.values?.name || editCategory?.name
                    ? editCategory?.name
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
                <Form.Control.Feedback className="required-mark" type="invalid">
                  {validation.errors.name}
                </Form.Control.Feedback>
              ) : null}
            </div>
          </Col>
          <Col lg={12}>
            <div className="mb-3">
              <div className="d-flex">
                <Form.Label htmlFor="productType-field">Parent</Form.Label>

                <TooltipWithInfoIcon
                  text={tooltipMessage.SelectPerentCatgory}
                />
              </div>
              <Form.Select
                className="form-select"
                name="parent_id"
                id="productType-field"
                onChange={e =>
                  validation.setFieldValue('parent_id', e.target.value)
                }
                value={
                  validation.values.parent_id ||
                  (editCategory?.parent_id !== ''
                    ? editCategory?.parent_id
                    : '')
                }
                isInvalid={
                  !!(
                    Boolean(validation.touched.parent_id) &&
                    Boolean(validation.errors.parent_id)
                  )
                }>
                {/* <option value="">Select Parent</option>
                {categoryList?.map((data: CategoryDetailsTypes, i) => {
                  const categoryName = renderCategoryOptions(
                    data,
                    categoryList,
                  );
                  return (
                    <React.Fragment key={i}>
                      {editCategory?.name != data.name && (
                        <>
                          <option value={data.id} key={i}>
                            {categoryName}
                          </option>
                        </>
                      )}
                    </React.Fragment>
                  );
                })}{' '} */}
                <option value="">Select Parent</option>
                {categoryList?.map((data: CategoryDetailsTypes, i) => {
                  // Ensure the category name does not match the editCategory's name
                  if (editCategory?.name !== data.name) {
                    const categoryName = renderCategoryOptions(
                      data,
                      categoryList,
                      [],
                      editCategory?.name,
                    );

                    return (
                      <option value={data.id} key={i}>
                        {categoryName}
                      </option>
                    );
                  }
                  return null; // Avoid rendering anything if the condition is not met
                })}
              </Form.Select>
              {Boolean(validation.touched.parent_id) &&
              Boolean(validation.errors.parent_id) ? (
                <Form.Control.Feedback className="required-mark" type="invalid">
                  {validation.errors.parent_id}
                </Form.Control.Feedback>
              ) : null}
            </div>
          </Col>
          <Col lg={12}>
            <div className="mb-3">
              <div className="d-flex">
                <Form.Label htmlFor="category-name">Brand</Form.Label>

                <TooltipWithInfoIcon text={tooltipMessage.SelectBrand} />
              </div>

              <Select
                isMulti
                name="category-name"
                value={selectedBrandOption}
                onChange={handleSelectBrandChange}
                styles={isDark ? colourStyles : {}}
                options={brandListOption}></Select>
            </div>
          </Col>
          <Col lg={12}>
            <div className="mb-3">
              <div className="d-flex">
                <Form.Label htmlFor="status-Field">Status</Form.Label>

                <TooltipWithInfoIcon text={tooltipMessage.CategoryStatus} />
              </div>
              <Form.Select
                className="form-select"
                name="status_id"
                id="status-Field"
                onChange={e =>
                  validation.setFieldValue('status_id', e.target.value)
                }
                value={
                  validation.values.status_id ||
                  (editCategory?.status_id !== ''
                    ? editCategory?.status_id
                    : '')
                }
                isInvalid={
                  !!(
                    validation.touched.status_id && validation.errors.status_id
                  )
                }>
                <option value=" ">Status</option>
                {status?.map((data: CategoryStatusList, i) => (
                  <option key={i} value={data.id}>
                    {data.name}
                  </option>
                ))}
              </Form.Select>

              {Boolean(validation.touched.status_id) &&
              Boolean(validation.errors.status_id) ? (
                <Form.Control.Feedback className="required-mark" type="invalid">
                  {validation.errors.status_id}
                </Form.Control.Feedback>
              ) : null}
            </div>
          </Col>

          <Col lg={12} className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <Button
                role="submitCategory"
                variant="primary"
                id="add-btn"
                type="submit">
                {editCategory?.id !== undefined
                  ? 'Edit Category'
                  : 'Add Category'}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CategoryForm;
