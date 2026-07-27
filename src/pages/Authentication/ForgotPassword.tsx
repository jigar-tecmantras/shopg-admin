/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, {useRef, useState} from 'react';

import {Alert, Button, Card, Col, Container, Form, Row} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from 'react-google-recaptcha';

// Import Images
import img1 from 'assets/images/auth/img-1.png';

// Formik Validation
import * as Yup from 'yup';
import {useFormik} from 'formik';
import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';
import {DOCUMENT_TITLE} from 'Common/constants/layout';
import {GOOGLE_SITE_KEY} from 'utils/AppConfig';

const ForgotPassword = (): React.JSX.Element => {
  document.title = DOCUMENT_TITLE.FORGOT_PASSWORD;
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccessMsg, setApiSuccessMsg] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const siteKey = GOOGLE_SITE_KEY ?? '';

  // Formik validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
      type: 'warehouse',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required('Please Enter Your Email')
        .email('Invalid email address'),
    }),
    onSubmit: async values => {
      let tokenData: string | null | undefined;

      if (!token) {
        tokenData = await recaptchaRef?.current?.executeAsync();
        if (tokenData) {
          setToken(tokenData);
        } else {
          toast.error('Failed to validate ReCAPTCHA. Please try again.');
          return;
        }
      } else {
        tokenData = token;
      }
      // Clear previous messages
      setApiError(null);
      setApiSuccessMsg(null);

      try {
        // Make the API call for forgot password
        const response: any = await ApiUtils.forgetPassword({
          email: values.email,
          type: 'warehouse',
          'g-recaptcha-response': tokenData,
        });

        // Handle API call success
        setApiSuccessMsg(response.message);
        toast.success(response.message);
      } catch (error: any) {
        // Handle API call failure

        if (
          Boolean(error.response) &&
          typeof error.response.data === 'object' &&
          'message' in error.response.data
        ) {
          // toast.error(`Send Email :${error.response.data.message}`);
          toast.success(`Send Email :${error.response.data.message}`);
        } else {
          // Handle other types of errors or just rethrow
          toast.error('Send Email failed. An unexpected error occurred.');
        }
      }
    },
  });
  return (
    <section className="auth-page-wrapper position-relative bg-light min-vh-100 d-flex align-items-center justify-content-between">
      {/* <div className="auth-header position-fixed top-0 start-0 end-0 bg-body">
        <Container fluid={true}>
          <Row className="justify-content-between align-items-center">
            <Col className="col-2">
              <Link className="navbar-brand mb-2 mb-sm-0" to="/">
                <h3>WAREHOUSE</h3>
              </Link>
            </Col>
          </Row>
        </Container>
      </div> */}
      <div className="w-100">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6}>
              <div className="auth-card mx-lg-3">
                <Card className="border-0 mb-0">
                  <Card.Header className="bg-primary border-0">
                    <Row className="d-flex align-items-center">
                      <Col lg={4} className="col-3">
                        <img src={img1} alt="" className="img-fluid" />
                      </Col>
                      <Col lg={8} className="col-9">
                        <h1 className="text-white lh-base fw-lighter">
                          Forgot Password?
                        </h1>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-muted fs-15">
                      Reset password with Warehouse.
                    </p>

                    <div
                      className="alert alert-borderless alert-warning text-center mb-2 mx-2"
                      role="alert">
                      {/* Enter your email and instructions will be sent to you! */}
                      Enter your registered email to receive further
                      instructions
                    </div>
                    <div className="p-2">
                      {apiError != null ? (
                        <Alert variant="danger" style={{marginTop: '13px'}}>
                          {apiError}
                        </Alert>
                      ) : null}
                      {apiSuccessMsg != null ? (
                        <Alert variant="success" style={{marginTop: '13px'}}>
                          {apiSuccessMsg}
                        </Alert>
                      ) : null}
                      <Form
                        onSubmit={e => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}>
                        <div className="mb-4">
                          <Form.Label htmlFor="email">Email</Form.Label>
                          <Form.Control
                            type="email"
                            id="email"
                            placeholder="Enter your email or username"
                            name="email"
                            className="form-control"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email ?? ''}
                            isInvalid={
                              !!(
                                (validation.touched.email ?? false) &&
                                Boolean(validation.errors.email)
                              )
                            }
                          />
                          {(validation.touched.email ?? false) &&
                          Boolean(validation.errors.email) ? (
                            <Form.Control.Feedback type="invalid">
                              <div>{validation.errors.email}</div>
                            </Form.Control.Feedback>
                          ) : null}
                        </div>

                        <ReCAPTCHA
                          sitekey={siteKey}
                          size="invisible"
                          ref={recaptchaRef}
                        />

                        <div className="text-center mt-4">
                          <Button
                            variant="primary"
                            className="w-100"
                            type="submit">
                            Send Reset Link
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

export default ForgotPassword;
