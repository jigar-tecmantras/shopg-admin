/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {useFormik} from 'formik';
import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Form} from 'react-bootstrap';
import * as Yup from 'yup';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';
import {useNavigate, useParams} from 'react-router-dom';
import BreadCrumb from 'Common/BreadCrumb';

const PolicyAdd = (): JSX.Element => {
  const [editData, setEditData]: any = useState();
  const searchParams: any = useParams();
  const id: any = searchParams.id;

  const navigate = useNavigate();

  useEffect(() => {
    if (id as boolean) {
      ApiUtils.getSinglePolicy(id)
        .then((res: any): any => {
          setEditData(res?.data);
        })
        .catch(err => {
          toast.error(err?.message);
        });
    }
  }, [id]);

  const formik: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editData?.name ?? '',
      description: editData?.description ?? '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Policy name is required'),
      description: Yup.string().required('Policy description is required'),
    }),
    onSubmit: values => {
      const addData = {
        name: values.name,
        description: values.description,
      };
      const updateData = {
        id: editData?.id,
        name: values.name,
        description: values.description,
      };
      performOperation(id as boolean, (id as boolean) ? updateData : addData)
        .then((res: any) => {
          toast.success(res.message);
          navigate('/policy-list');
        })
        .catch((err: any): any => {
          toast.error(err.message);
        });
      formik.resetForm();
    },
  });

  const performOperation = (checkMode: boolean, params: any): any => {
    if (!checkMode) {
      return ApiUtils.addPolicy(params);
    } else {
      return ApiUtils.updatePolicy(params);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb
          title={id !== undefined ? 'Edit Policy' : 'Add Policy'}
          pageTitle="Policy Management"
          pageLink="/policy-list"
        />
        <Col md={12}>
          <Form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <Form.Label htmlFor="name">Policy Name</Form.Label>
              <Form.Control
                type="texy"
                name="name"
                id="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name ?? ''}
                isInvalid={
                  !!(
                    Boolean(formik.touched.name) && Boolean(formik.errors.name)
                  )
                }
              />
              {Boolean(formik.touched.name) && Boolean(formik.errors.name) ? (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.name}
                </Form.Control.Feedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Form.Label htmlFor="description-input">
                Policy description
              </Form.Label>
              <CKEditor
                name="description"
                htmlFor="description-input"
                data-testid="policy-description-editor"
                editor={ClassicEditor}
                onChange={(_event: any, editor: any) => {
                  editor.getData();
                  formik.setFieldValue('description', editor.getData());
                }}
                data={formik.values.description}
                style={{
                  maxWidth: '400px',
                  wordWrap: 'break-word',
                }}
              />
              {Boolean(formik.touched.description) &&
              Boolean(formik.errors.description) ? (
                <div className="text-danger">{formik.errors.description}</div>
              ) : null}
            </div>
            <div>
              <Button type="submit" role="addpolicy">
                {(id as boolean) ? 'Update Policy' : 'Add Policy'}
              </Button>
            </div>
          </Form>
        </Col>
      </Container>
    </div>
  );
};

export default PolicyAdd;
