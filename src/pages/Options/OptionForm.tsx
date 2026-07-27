/* eslint-disable @typescript-eslint/naming-convention */
import React, {useEffect, useState} from 'react';
import {
  ErrorMessage,
  Field,
  FieldArray,
  FormikProvider,
  type FormikValues,
  useFormik,
} from 'formik';
import {Button, Card, Container, Form} from 'react-bootstrap';
import * as Yup from 'yup';
import ApiUtils from 'api/ApiUtils';
import {ToasterMessage} from 'helpers/ToastHelper';
import {useLocation, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BreadCrumb from 'Common/BreadCrumb';
import TooltipWithInfoIcon from 'Common/InfoTool';
import {tooltipMessage} from 'utils/Tooltips';

interface Status {
  id: number;
  name: string;
  model: string;
}
interface Option {
  id?: number | null;
  option_id: number | null;
  name: string;
  status_id: string;
  // label: string;
  // image: File | string;
  old_name?: string;
}

interface FormValues {
  old_type?: string;
  name: string;
  type: string;
  status_id: number | string;
  id?: string;
  options?: Option[];
  old_name?: string;
}

const OptionForm = (): React.JSX.Element => {
  document.title = 'Option Form';

  const navigate = useNavigate();
  const search = useLocation().search;
  const optionId = new URLSearchParams(search).get('optionId');

  const [oldOptionName, setOldOptionName] = useState();
  const [oldOptionType, setOldOptionType] = useState();
  const [statusList, setStatusList] = useState<Status[]>([]);
  const [optionValueStatusList, setOptionValueStatusList] = useState<Status[]>(
    [],
  );

  const validation: any = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: {
      name: '',
      type: 'radio',
      status_id: '',
      options: [
        {
          option_id: 0,
          name: '',
          status_id: '',
          // label: '',
          // image: '',
        },
      ],
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Please Enter Option Name'),
      // type: Yup.string().required('Please Select Type'),
      status_id: Yup.number().required('Please Option Status'),
      options: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required('Name is required'),
          option_id: Yup.number(),
          status_id: Yup.number().required('Select status'),
          // label: Yup.string().required('Label is required'),
          // image: Yup.mixed().required('Image is required'),
        }),
      ),
    }),
    onSubmit: async values => {
      const {name, type, status_id, options} = values;

      const convertedStatusId = parseInt(status_id as string, 10);
      // Create the option object with the converted status_id
      const option: FormValues = {name, type, status_id: convertedStatusId};

      if (optionId != null) {
        option.id = optionId;
        option.old_name = oldOptionName;
        option.old_type = oldOptionType;
      }
      try {
        // Assuming option contains the data for the option
        const response: any =
          optionId != null
            ? await ApiUtils.updateOption(option)
            : await ApiUtils.createOption(option);
        if (options != null && options.length > 0) {
          // Create FormData for option values
          const optionValuesFormData = new FormData();

          // Assuming options is an array of objects containing option values
          options != null &&
            options.forEach((option: any, index) => {
              optionValuesFormData.append(
                `option_value[${index}][option_id]`,
                response.data.id ?? optionId,
              );
              optionValuesFormData.append(
                `option_value[${index}][name]`,
                option.name,
              );
              if (option.id !== undefined) {
                optionValuesFormData.append(
                  `option_value[${index}][old_name]`,
                  option.old_name,
                );
              }
              // if (option.image !== '' && typeof option.image !== 'string') {
              //   optionValuesFormData.append(
              //     `option_value[${index}][image]`,
              //     option.image,
              //   );
              // }
              optionValuesFormData.append(
                `option_value[${index}][status_id]`,
                option.status_id,
              );
              // optionValuesFormData.append(
              //   `option_value[${index}][label]`,
              //   option.label,
              // );
              if (optionId != null && Boolean(option?.id)) {
                optionValuesFormData.append(
                  `option_value[${index}][id]`,
                  option?.id,
                );
              }
              if (option.id === undefined) {
                optionValuesFormData.append(
                  `option_value[${index}][type]`,
                  'create',
                );
              }
              if (option.id !== undefined) {
                optionValuesFormData.append(
                  `option_value[${index}][type]`,
                  'update',
                );
              }
            });
          // Send the FormData to create option values
          const optionValueResponse: any =
            optionId != null
              ? await ApiUtils.updateOptionValue(optionValuesFormData)
              : await ApiUtils.createOptionValue(optionValuesFormData);
          ToasterMessage('success', optionValueResponse.message);
        }
        navigate('/options');
      } catch (error: any) {
        ToasterMessage('error', error?.response?.data?.message);
      }
    },
  });
  useEffect(() => {
    if (optionId != null) {
      ApiUtils.getOptionsById(optionId)
        .then((res: any) => {
          validation.setFieldValue('name', res.data[0]?.name);
          validation.setFieldValue('status_id', res.data[0]?.status_id);
          validation.setFieldValue('type', res.data[0]?.type);
          setOldOptionName(res.data[0]?.name);
          setOldOptionType(res.data[0]?.type);
        })
        .catch((_err: any) => {});
      ApiUtils.getProductOptionsById(optionId)
        .then((res: any) => {
          const options: Option[] = [];
          res.data.forEach(({id, name, status_id}: any) => {
            options.push({
              id,
              option_id: 0,
              name,
              status_id,

              // image,
              old_name: name,
            });
          });

          // Update form field values
          validation.setFieldValue('options', options);
        })
        .catch((_err: any) => {});
    }
  }, [optionId]);

  useEffect(() => {
    void fetchStatus();
  }, []);

  const optionsType: any[] = [
    // {value: 'checkbox', label: 'Checkbox'},
    // {value: 'select', label: 'Select'},
    {value: 'radio', label: 'Radio'},
  ];

  // const handleImage = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   index: number,
  // ): void => {
  //   const file = e.target.files?.[0];
  //   const data = [...validation.values.options];
  //   if (file != null) {
  //     data[index] = {
  //       ...data[index],
  //       image: file,
  //     };
  //     validation.setFieldValue('options', data);
  //   }
  // };

  const deleteOption = (id: string): void => {
    ApiUtils.deleteOptionValue(id)
      .then((res: any) => {
        toast.success(res.message);
      })
      .catch((_err: any) => {});
  };

  const fetchStatus = async (): Promise<void> => {
    try {
      const response: any = await ApiUtils.getStatus(`type=option`);
      setStatusList(response.data);

      const optionValueStatus: any =
        await ApiUtils.getStatus(`type=option_value`);
      setOptionValueStatusList(optionValueStatus.data);
    } catch (err: any) {
      ToasterMessage('error', err.message);
    }
  };

  const scrollToBottom = (): void => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth', // Smooth scrolling animation
    });
  };

  return (
    <div className="page-content">
      <Container fluid={true}>
        <BreadCrumb
          title={optionId != null ? 'Edit Option' : 'Create Option'}
          pageTitle="Options"
          pageLink="/options"
        />{' '}
        <Card>
          <Card.Body>
            <FormikProvider value={validation}>
              <Form
                onSubmit={e => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}>
                <div className="mb-4">
                  <div className="d-flex">
                    <Form.Label htmlFor="name">Option Name</Form.Label>

                    <TooltipWithInfoIcon text={tooltipMessage.AddOption} />
                  </div>
                  <Form.Control
                    type="text"
                    id="name"
                    placeholder="Enter Option Name"
                    name="name"
                    className="form-control"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.name ?? ''}
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
                      <div className="required-mark">
                        {validation.errors.name}
                      </div>
                    </Form.Control.Feedback>
                  ) : null}
                </div>

                <div className="mb-4 d-none">
                  <div className="d-flex">
                    <Form.Label htmlFor="option_type">Option Type</Form.Label>

                    <TooltipWithInfoIcon text={tooltipMessage.OptionType} />
                  </div>
                  <Form.Select
                    aria-label="Default select example"
                    name="type"
                    id="option_type"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.type ?? 'radio'}
                    isInvalid={
                      !!(
                        Boolean(validation.touched.type) &&
                        Boolean(validation.errors.type)
                      )
                    }>
                    <option value="">--SELECT--</option>
                    {optionsType?.map((option: any) => (
                      <option key={option.value} selected>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>

                  {Boolean(validation.touched.type) &&
                  Boolean(validation.errors.type) ? (
                    <Form.Control.Feedback type="invalid">
                      <div className="required-mark">
                        {validation.errors.type}
                      </div>
                    </Form.Control.Feedback>
                  ) : null}
                </div>
                <div className="mb-4">
                  <div className="d-flex">
                    <Form.Label htmlFor="status_id">Option Status</Form.Label>

                    <TooltipWithInfoIcon text={tooltipMessage.OptionStatus} />
                  </div>
                  <Form.Select
                    aria-label="Default select example"
                    name="status_id"
                    id="status_id"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.status_id ?? ''}
                    isInvalid={
                      !!(
                        Boolean(validation.touched.status_id) &&
                        Boolean(validation.errors.status_id)
                      )
                    }>
                    <option value="">Status</option>
                    {statusList?.map((status: any) => (
                      <option key={status?.id} value={status?.id}>
                        {status.name}
                      </option>
                    ))}
                  </Form.Select>

                  {Boolean(validation.touched.status_id) &&
                  Boolean(validation.errors.status_id) ? (
                    <Form.Control.Feedback type="invalid">
                      <div className="required-mark">
                        {validation.errors.status_id}
                      </div>
                    </Form.Control.Feedback>
                  ) : null}
                </div>
                <div className="float-end mb-3">
                  <Button
                    variant="success"
                    type="button"
                    className="add-btn"
                    onClick={() => {
                      const data = [...validation.values.options];
                      data.push({
                        option_id: 1,
                        status_id: '',
                        name: '',
                        image: '',
                      });
                      validation.setFieldValue('options', data);
                      scrollToBottom();
                    }}>
                    <i className="bi bi-plus-circle me-1 align-middle"></i>
                    Add Option
                  </Button>
                </div>
                <div className="mb-4">
                  <FieldArray name="options">
                    {({remove}) => (
                      <table className="table">
                        <thead>
                          <tr>
                            {/* <th>
                              <div className="d-flex">
                                Option Value{' '}
                                <TooltipWithInfoIcon
                                  text={tooltipMessage.OptionValueImage}
                                />
                              </div>
                            </th> */}
                            <th>
                              {' '}
                              <div className="d-flex">
                                Name{' '}
                                <TooltipWithInfoIcon
                                  text={tooltipMessage.OptionValueName}
                                />
                              </div>
                            </th>
                            {/* <th>
                              <div className="d-flex">
                                Label
                                <TooltipWithInfoIcon
                                  text={tooltipMessage.OptionValueLabel}
                                />
                              </div>
                            </th> */}
                            <th>
                              <div className="d-flex">
                                Status
                                <TooltipWithInfoIcon
                                  text={tooltipMessage.OptionValueStaus}
                                />
                              </div>
                            </th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {validation.values.options.map(
                            (option: FormikValues, index: number) => {
                              return (
                                <tr className="align-middle" key={index}>
                                  {/* <td>
                                    <div className="avatar-upload">
                                      <div className="avatar-edit">
                                        <input
                                          type="file"
                                          id={`imageUpload-${index}`}
                                          onChange={e => {
                                            handleImage(e, index);
                                          }}
                                          accept=".png, .jpg, .jpeg"
                                        />
                                        <label
                                          htmlFor={`imageUpload-${index}`}
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
                                            option.image !== '' &&
                                            typeof option.image === 'string'
                                              ? option.image
                                              : typeof option.image !== 'string'
                                                ? URL.createObjectURL(
                                                    option.image,
                                                  )
                                                : categoryImagePlaceholder
                                          }
                                          style={{height: '110px'}}
                                        />
                                      </div>
                                    </div>
                                    <ErrorMessage
                                      name={`options.${index}.image`}
                                      component="div"
                                      className="field-error required-mark invalid-feedback"
                                    />
                                  </td> */}

                                  <td>
                                    <Field
                                      name={`options.${index}.name`}
                                      placeholder="Option name"
                                      type="text"
                                      className="form-control"
                                    />
                                    <ErrorMessage
                                      name={`options.${index}.name`}
                                      component="div"
                                      className="field-error required-mark invalid-feedback"
                                    />
                                  </td>
                                  {/* <td>
                                    <Field
                                      name={`options.${index}.label`}
                                      placeholder="Option Label"
                                      type="text"
                                      className="form-control"
                                    />
                                    <ErrorMessage
                                      name={`options.${index}.label`}
                                      component="div"
                                      className="field-error required-mark invalid-feedback"
                                    />
                                  </td> */}
                                  <td>
                                    <Field
                                      name={`options.${index}.status_id`}
                                      placeholder="Option Label"
                                      className="form-control"
                                      as="select">
                                      <option value={0}>--SELECT--</option>
                                      {optionValueStatusList?.map(
                                        (status: any) => (
                                          <option
                                            key={status?.id}
                                            value={status?.id}>
                                            {status.name}
                                          </option>
                                        ),
                                      )}
                                    </Field>
                                    <ErrorMessage
                                      name={`options.${index}.status_id`}
                                      component="div"
                                      className="field-error required-mark invalid-feedback"
                                    />
                                  </td>

                                  <td>
                                    <Button
                                      type="button"
                                      onClick={() => {
                                        option?.id !== null &&
                                          option?.id !== undefined &&
                                          deleteOption(String(option?.id));
                                        remove(index);
                                      }}
                                      className="text-danger"
                                      size="sm"
                                      variant="light">
                                      <i className="ri-delete-bin-fill align-bottom me-2 text-danger" />
                                      Delete
                                    </Button>
                                  </td>
                                </tr>
                              );
                            },
                          )}
                        </tbody>
                      </table>
                    )}
                  </FieldArray>
                </div>

                <div className="text-center mt-4">
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </Form>
            </FormikProvider>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default OptionForm;
