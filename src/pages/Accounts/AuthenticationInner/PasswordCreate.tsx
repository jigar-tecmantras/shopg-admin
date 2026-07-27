import React, {useState} from 'react';
import {Button, Card, Col, Container, Form, Row} from 'react-bootstrap';

// Import Images
import img1 from 'assets/images/auth/img-1.png';
import {Link, useNavigate, useParams} from 'react-router-dom';

// Formik Validation
import * as Yup from 'yup';
import {useFormik} from 'formik';

import ApiUtils from 'api/ApiUtils';
import {regex} from 'utils/constant';

import {toast} from 'react-toastify';
import {DOCUMENT_TITLE} from 'Common/constants/layout';
const PasswordCreate = (): React.JSX.Element => {
  document.title = DOCUMENT_TITLE.CHANGE_PASSWORD;

  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const {token} = useParams<{token: string}>();
  const navigate = useNavigate();

  const [confirmPasswordShow, setConfirmPasswordShow] =
    useState<boolean>(false);

  const passwordValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: '',
      confirm_password: '',
      token: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required('Please Enter Your Password')
        .matches(
          regex.passwordRegex,
          'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
        ),
      confirm_password: Yup.string()
        .required('Please Enter Your Confirm Password')
        .oneOf([Yup.ref('password')], 'Passwords must match'),
    }),
    onSubmit: async (values: any) => {
      try {
        const response: any = await ApiUtils.resetPassword({
          password: values.password,
          confirm_password: values.confirm_password,
          token,
        });

        // Handle API call success
        toast.success(response.message);
        navigate('/login');
      } catch (error) {
        // Handle API call failure
        toast.error('Failed to reset password. Please try again.');
      }
    },
  });

  return (
    <section className="auth-page-wrapper position-relative bg-light min-vh-100 d-flex align-items-center justify-content-between">
      <div className="auth-header position-fixed top-0 start-0 end-0 bg-body">
        <Container fluid={true} className="container-fluid">
          <Row className="justify-content-between align-items-center">
            <Col className="col-2">
              <Link className="navbar-brand mb-2 mb-sm-0" to="/">
                <h3>WAREHOUSE</h3>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="w-100">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6}>
              <div className="auth-card mx-lg-3">
                <Card className="border-0 mb-0">
                  <Card.Header className="bg-primary border-0">
                    <Row>
                      <Col lg={4} className="col-3">
                        <img src={img1} alt="" className="img-fluid" />
                      </Col>
                      <Col lg={8} className="col-9">
                        <h1 className="text-white lh-base fw-lighter">
                          Create New Password
                        </h1>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-muted fs-15">
                      Your new password must be different from previous used
                      password.
                    </p>

                    <div className="p-2">
                      <Form
                        action="#"
                        onSubmit={e => {
                          e.preventDefault();
                          passwordValidation.handleSubmit();
                          return false;
                        }}>
                        <div className="mb-3">
                          <Form.Label htmlFor="password-input">
                            Password
                          </Form.Label>
                          <div className="position-relative auth-pass-inputgroup">
                            <Form.Control
                              type={passwordShow ? 'text' : 'password'}
                              className="pe-5 password-input"
                              placeholder="Enter password"
                              id="password-input"
                              name="password"
                              autoComplete="off"
                              onChange={passwordValidation.handleChange}
                              onBlur={passwordValidation.handleBlur}
                              value={passwordValidation.values.password ?? ''}
                              isInvalid={
                                !!(
                                  Boolean(
                                    passwordValidation.touched.password,
                                  ) &&
                                  Boolean(passwordValidation.errors.password)
                                )
                              }
                            />
                            <Button
                              variant="link"
                              className="btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                              type="button"
                              id="password-addon"
                              onClick={() => {
                                setPasswordShow(!passwordShow);
                              }}>
                              <i className="ri-eye-fill align-middle"></i>
                            </Button>
                            {Boolean(passwordValidation.touched.password) &&
                            Boolean(passwordValidation.errors.password) ? (
                              <Form.Control.Feedback type="invalid">
                                <div>
                                  {passwordValidation.errors.password as string}
                                </div>
                              </Form.Control.Feedback>
                            ) : null}
                          </div>
                          <div id="passwordInput" className="form-text">
                            Your password must be 8-20 characters long.
                          </div>
                        </div>

                        <div className="mb-3">
                          <Form.Label htmlFor="confirm-password-input">
                            Confirm Password
                          </Form.Label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <Form.Control
                              type={confirmPasswordShow ? 'text' : 'password'}
                              className="pe-5 password-input"
                              placeholder="Confirm password"
                              id="confirm-password-input"
                              name="confirm_password"
                              autoComplete="off"
                              onChange={passwordValidation.handleChange}
                              onBlur={passwordValidation.handleBlur}
                              value={
                                passwordValidation.values.confirm_password ?? ''
                              }
                              isInvalid={
                                !!(
                                  Boolean(
                                    passwordValidation.touched.confirm_password,
                                  ) &&
                                  Boolean(
                                    passwordValidation.errors.confirm_password,
                                  )
                                )
                              }
                            />
                            <Button
                              variant="link"
                              className="btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                              type="button"
                              onClick={() => {
                                setConfirmPasswordShow(!confirmPasswordShow);
                              }}>
                              <i className="ri-eye-fill align-middle"></i>
                            </Button>
                            {Boolean(
                              passwordValidation.touched.confirm_password,
                            ) &&
                            Boolean(
                              passwordValidation.errors.confirm_password,
                            ) ? (
                              <Form.Control.Feedback type="invalid">
                                <div>
                                  {
                                    passwordValidation.errors
                                      .confirm_password as string
                                  }
                                </div>
                              </Form.Control.Feedback>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-3">
                          <Button
                            variant="primary"
                            className="w-100"
                            type="submit">
                            Reset Password
                          </Button>
                        </div>
                      </Form>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="mb-0">
                        Wait, I remember my password...{' '}
                        <Link
                          to="/login"
                          className="fw-semibold text-primary text-decoration-underline">
                          {' '}
                          Click here{' '}
                        </Link>{' '}
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>

        <footer className="footer">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center">
                  <p className="mb-0 text-muted">
                    ©{new Date().getFullYear()} Warehouse
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    </section>
  );
};

export default PasswordCreate;
