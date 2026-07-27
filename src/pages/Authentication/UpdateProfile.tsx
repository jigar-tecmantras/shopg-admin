import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Card, Button, Form} from 'react-bootstrap';

// Formik Validation
import * as Yup from 'yup';
import {useFormik} from 'formik';

// redux
import {useSelector, useDispatch} from 'react-redux';
import {createSelector} from 'reselect';

// Import Breadcrumb
import Breadcrumb from 'Common/BreadCrumb';

// actions
import {resetProfileFlag} from 'slices/thunk';
import {DOCUMENT_TITLE} from 'Common/constants/layout';
import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';
import DefaultProfileImg from '../../assets/images/defaultProfileImg.jpg';
import {setLocalStorageItem} from 'utils/localStorageUtil';
import {variables} from 'utils/constant';
import {setUserName} from 'slices/auth/profile/reducer';

const UpdateProfile = (): React.JSX.Element => {
  document.title = DOCUMENT_TITLE.UPDATE_PROFILE;

  const dispatch = useDispatch<any>();

  const [email, setEmail] = useState('admin@gmail.com');
  const [name, setName] = useState('Admin');
  const [idx, setIdx] = useState('1');

  const selectLayoutState = (state: any): void => state.Profile;

  const selectProperties = createSelector(selectLayoutState, (state: any) => ({
    user: state.user,
    success: state.success,
    error: state.error,
  }));

  const {error, success} = useSelector(selectProperties);

  const profile = async (): Promise<void> => {
    const response: any = await ApiUtils.getProfile();
    const {first_name: firstName, last_name: lastName, email} = response.data;

    setEmail(email);
    const name = firstName + ' ' + lastName;
    setName(name);

    void validation.setValues({
      first_name: firstName,
      last_name: lastName,
    });
  };

  useEffect(() => {
    void profile();
  }, [name, email]);

  useEffect(() => {
    const authUserString = localStorage.getItem('authUser');

    if (authUserString != null) {
      const obj = JSON.parse(authUserString);
      if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
        setName(obj?.displayName ?? '');
        setEmail(obj?.email ?? '');
        setIdx(obj?.uid ?? '');
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === 'fake' ||
        process.env.REACT_APP_DEFAULTAUTH === 'jwt'
      ) {
        setName(obj?.displayName ?? '');
        setEmail(obj?.email ?? '');
        setIdx(obj?.uid ?? '');
      }

      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }
  }, [dispatch, success, error]);

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      first_name: '',
      last_name: '',
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required('First Name is required'),
      last_name: Yup.string().required('Last Name is required'),
    }),
    onSubmit: async values => {
      dispatch(
        setUserName({
          userName: {
            first: values.first_name,
            last: values.last_name,
          },
        }),
      );
      try {
        const updateResponse: any = await ApiUtils.updateProfile({
          ...values,
        });
        await setLocalStorageItem(variables.WAREHOUSE_USERNAME, {
          first: values.first_name,
          last: values.last_name,
        });
        const name = values.first_name + ' ' + values.last_name;
        setName(name);

        toast.success(updateResponse.message);
      } catch (error) {
        if (error instanceof Error) {
          // If the error is an instance of Error (like a network error), show its message
          toast.error(error.message);
        } else {
          // If it's of unknown type, display a generic error message
          toast.error('An unexpected error occurred.');
        }
      }
    },
  });

  const handleInput = (event: React.FormEvent<HTMLInputElement>): void => {
    const {name, value} = event.currentTarget;
    void validation?.setFieldValue(name, value);
  };

  return (
    <div className="page-content">
      <Container fluid>
        {/* Render Breadcrumb */}
        <Breadcrumb title="Warehouse" pageTitle="Accounts" />

        <Row>
          <Col lg="12">
            <Card>
              <Card.Body>
                <div className="d-flex">
                  <div className="mx-3">
                    <img
                      src={DefaultProfileImg}
                      alt=""
                      className="avatar-md rounded-circle img-thumbnail"
                    />
                  </div>
                  <div className="flex-grow-1 align-self-center">
                    <div className="text-muted">
                      <h5>{name}</h5>
                      <p className="mb-1">{email}</p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <h4 className="card-title mb-4">Update Profile:</h4>

        <Card>
          <Card.Body>
            <Form
              className="form-horizontal"
              onSubmit={e => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}>
              {/* First name */}
              <div className="form-group">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  name="first_name"
                  className="form-control"
                  placeholder="Enter First Name"
                  type="text"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  onInput={handleInput}
                  defaultValue={validation.values.first_name}
                />
                {Boolean(validation.touched.first_name ?? false) &&
                Boolean(validation.errors.first_name ?? '') ? (
                  <Form.Control.Feedback type="invalid" className="text-danger">
                    {validation.errors.first_name}
                  </Form.Control.Feedback>
                ) : null}
                <Form.Control name="idx" value={idx} type="hidden" />
              </div>

              {/* lastname */}
              <div className="form-group">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  name="last_name"
                  className="form-control"
                  placeholder="Enter last Name"
                  type="text"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  onInput={handleInput}
                  defaultValue={validation.values.last_name}
                />
                {Boolean(validation.touched.last_name ?? false) &&
                Boolean(validation.errors.last_name ?? '') ? (
                  <Form.Control.Feedback type="invalid" className="text-danger">
                    {validation.errors.last_name}
                  </Form.Control.Feedback>
                ) : null}
                <Form.Control name="idx" value={idx} type="hidden" />
              </div>

              <div className="text-center mt-4">
                <Button type="submit" variant="danger">
                  Update Profile
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default UpdateProfile;
