/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ModalContainer from 'Common/ModalContainer';
import {useFormik} from 'formik';
import {object, string} from 'yup';
import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Row} from 'react-bootstrap';
import ApiUtils from 'api/ApiUtils';
import DeleteIconSvg from 'Common/SVG/DeleteIconSvg';
import {toast} from 'react-toastify';
import {debounce} from 'lodash';
import {editorConfiguration} from 'utils/constant';

interface ModalProps {
  toogleStatus: any;
  showModal: boolean;
  setTemplateDescription: any;
}

const TamplateModal = ({
  toogleStatus,
  showModal,
  setTemplateDescription,
}: ModalProps): React.JSX.Element => {
  function modalData(): any {
    const [templates, setTemplates] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<any>('');
    const [isTemplateSelected, setIsTemplateSelected] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<
      | {
          title: string;
          description: string;
        }
      | any
    >(null);

    const getTeplatesListData = (): any => {
      void ApiUtils.getTeplates(`type=Dropdown&search=${searchTerm}`).then(
        (res: any) => {
          setTemplates(res?.data);
        },
      );
    };

    const handleSearchChange = debounce((event: any) => {
      const value = event.target.value;
      setSearchTerm(value);
    }, 500);

    useEffect(() => {
      getTeplatesListData();
      if (!showModal) {
        formik.resetForm();
        setIsTemplateSelected(false);
        setSelectedTemplate(null); // Reset selection when modal is closed
      }
    }, [searchTerm, showModal]);

    const handleDelete = (data: any): any => {
      void ApiUtils.deleteTeplate(`id=${data?.id}`)
        .then((res: any) => {
          toast.success(res?.message);
          formik.resetForm();
          getTeplatesListData();
        })
        .catch((err: any) => {
          toast.error(err?.message);
        });
    };

    const formik = useFormik<any>({
      initialValues: {
        title: '',
        description: '',
      },
      validationSchema: object().shape({
        title: string().required('Title is required'),
        description: string().required('Description is required'),
      }),
      onSubmit: (values: any) => {
        const createData = {
          name: values.title,
          description: values.description,
        };
        const templateParams = selectedTemplate
          ? {
              id: selectedTemplate.id,
              ...createData,
            }
          : createData;

        performOperation(selectedTemplate, templateParams)
          .then((res: any) => {
            toast.success(res?.message);
            getTeplatesListData();
          })
          .catch((err: any) => {
            toast.error(err?.message);
          });
        formik.resetForm();
      },
    });

    const performOperation = async (
      checkMode: any,
      params: any,
    ): Promise<any> =>
      checkMode
        ? await ApiUtils.updateTamplate(params)
        : await ApiUtils.createTeplate(params);

    const handleTemplateClick = (template: {
      name: any;
      description: string;
    }): void => {
      setSelectedTemplate(template);
      void formik.setValues({
        title: template.name,
        description: template.description,
      });
      setIsTemplateSelected(true);
    };

    const handleAddTemplate = (): void => {
      formik.handleSubmit();
    };

    const handleUseTeplate = (): any => {
      if (selectedTemplate) {
        setTemplateDescription(selectedTemplate.description);
        toogleStatus();
      }
    };

    return (
      <Row>
        <div className="hstack gap-2 mb-2 justify-content-end">
          <Button
            variant="primary"
            onClick={() => {
              setSelectedTemplate(null);
              formik.resetForm();
              setIsTemplateSelected(false);
            }}>
            Add New Template
          </Button>
        </div>
        <Col lg={3}>
          <Card className="p-2">
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search..."
                onChange={handleSearchChange}
                defaultValue={searchTerm}
              />
              <hr />
            </Form.Group>
            <ul
              className="list-group"
              style={{maxHeight: '309px', overflowY: 'auto'}}>
              {templates.map((template: any, index: any) => (
                <li
                  key={index}
                  className={`list-group-item list-group-item-action cursor-pointer mb-1 d-flex justify-content-between ${
                    selectedTemplate === template ? 'bg-light' : ''
                  }`}
                  onClick={() => {
                    handleTemplateClick(template);
                  }}>
                  {template.name}
                  <DeleteIconSvg onClick={() => handleDelete(template)} />
                </li>
              ))}
            </ul>
          </Card>
        </Col>
        <Col lg={9}>
          <Form.Group>
            <div className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Title..."
                {...formik.getFieldProps('title')}
                isInvalid={
                  !!(
                    Boolean(formik.touched.title) &&
                    Boolean(formik.errors.title)
                  )
                }
              />
              {Boolean(formik.touched.title) && Boolean(formik.errors.title) ? (
                <Form.Control.Feedback className="required-mark" type="invalid">
                  {formik.errors.title as string}
                </Form.Control.Feedback>
              ) : null}
            </div>
            <Form.Label>Description</Form.Label>
            <div id="uniqueEditorContainer">
              <CKEditor
                name="description"
                htmlFor="description-input"
                editor={ClassicEditor}
                config={editorConfiguration}
                data={formik.values.description}
                onChange={(_event: any, editor: any) => {
                  const data = editor.getData();
                  void formik.setFieldValue('description', data);
                }}
              />
            </div>
            {(formik.touched.description ?? false) &&
            formik.errors.description != null ? (
              <div className="text-danger">
                {formik.errors.description as React.ReactNode}
              </div>
            ) : null}
          </Form.Group>
          <div className="hstack gap-2 justify-content-end mt-1">
            <Button
              variant={isTemplateSelected ? 'success' : 'primary'}
              onClick={handleAddTemplate}>
              {isTemplateSelected ? 'Update' : 'Save'}
            </Button>
            {isTemplateSelected ? (
              <Button variant="info" onClick={handleUseTeplate}>
                {' '}
                Use This Template
              </Button>
            ) : null}
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <ModalContainer
      showModal={showModal}
      handleClose={toogleStatus}
      modalTitle="Add Template"
      modalBody={modalData()}
      isTemplate={true}
      size={'xl'}
    />
  );
};

export default TamplateModal;
