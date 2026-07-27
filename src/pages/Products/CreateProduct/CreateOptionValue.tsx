import React, {useEffect, useState} from 'react';
import {
  ErrorMessage,
  Field,
  FieldArray,
  FormikProvider,
  type FormikValues,
  useFormik,
} from 'formik';
import * as Yup from 'yup';
import {Button, Form} from 'react-bootstrap';
import ApiUtils from 'api/ApiUtils';
import {ToasterMessage} from 'helpers/ToastHelper';
// import categoryImagePlaceholder from 'assets/images/default-placeholder.jpg';

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
  label: string;
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
interface CreateOptionValueprops {
  optionValueId: number | null;
  handleClose: () => void;
}
function CreateOptionValue({
  optionValueId,
  handleClose,
}: Readonly<CreateOptionValueprops>): React.JSX.Element {
  const [optionValueStatusList, setOptionValueStatusList] = useState<Status[]>(
    [],
  );
  const fetchStatus = async (): Promise<void> => {
    try {
      const optionValueStatus: any =
        await ApiUtils.getStatus(`type=option_value`);
      setOptionValueStatusList(optionValueStatus.data);
    } catch (err: any) {
      ToasterMessage('error', err.message);
    }
  };
  useEffect(() => {
    void fetchStatus();
  }, []);
  const validation: any = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: {
      name: '',
      type: '',
      status_id: '',
      options: [
        {
          option_id: 0,
          name: '',
          status_id: '',
          label: '',
          // image: '',
        },
      ],
    },
    validationSchema: Yup.object({
      options: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required('Name is required'),
          option_id: Yup.number(),
          status_id: Yup.number().required('Select status'),
          label: Yup.string().required('Label is required'),
          // image: Yup.mixed().required('Image is required'),
        }),
      ),
    }),
    onSubmit: async values => {
      const {options} = values;
      try {
        if (options != null && options.length > 0) {
          const optionValuesFormData = new FormData();
          options?.forEach((option: any, index) => {
            optionValuesFormData.append(
              `option_value[${index}][option_id]`,
              String(optionValueId),
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
            optionValuesFormData.append(
              `option_value[${index}][label]`,
              option.label,
            );
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
          const optionValueResponse: any =
            await ApiUtils.createOptionValue(optionValuesFormData);
          handleClose();
          ToasterMessage('success', optionValueResponse.message);
        }
      } catch (error: any) {
        ToasterMessage('error', error?.response?.data?.message);
      }
    },
  });
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

  return (
    <FormikProvider value={validation}>
      <Form
        onSubmit={e => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}>
        <div className="mb-4">
          <FieldArray name="options">
            {() => (
              <table className="table">
                <thead>
                  <tr>
                    {/* <th>Option Value</th> */}
                    <th>Name</th>
                    <th>Label</th>
                    <th>Status</th>
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
                                        ? URL.createObjectURL(option.image)
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
                          <td>
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
                          </td>
                          <td>
                            <Field
                              name={`options.${index}.status_id`}
                              placeholder="Option Label"
                              className="form-control"
                              as="select">
                              <option value={0}>--SELECT--</option>
                              {optionValueStatusList?.map((status: any) => (
                                <option key={status?.id} value={status?.id}>
                                  {status.name}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage
                              name={`options.${index}.status_id`}
                              component="div"
                              className="field-error required-mark invalid-feedback"
                            />
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
  );
}

export default CreateOptionValue;
