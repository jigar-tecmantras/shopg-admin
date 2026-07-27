import React, {useState} from 'react';
import {Button, Card, Col, Container, Form, Modal, Row} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import OtpInput from 'react-otp-input';

import * as Yup from 'yup';
import {useFormik} from 'formik';
import ApiUtils from 'api/ApiUtils';
import {useCustomCookies} from 'utils/cookies';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useDispatch} from 'react-redux';
import {setLoginToken} from 'slices/auth/login/reducer';
import {DOCUMENT_TITLE} from 'Common/constants/layout';
import {setLocalStorageItem} from 'utils/localStorageUtil';
import {variables} from 'utils/constant';
import {setUserName} from 'slices/auth/profile/reducer';

const Login = (): React.JSX.Element => {
  document.title = DOCUMENT_TITLE.LOGIN_PAGE;
  const [passwordShow, setPasswordShow] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpId, setOtpId] = useState(null);
  const dispatch = useDispatch();
  const [isEmailPasswordVerified, setIsEmailPasswordVerified] = useState(false);

  const {createCookies} = useCustomCookies();
  const navigate = useNavigate();
  const loginValidation = useFormik<any>({
    initialValues: {
      email: '',
      password: '',
      otp: '',
      id: '',
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required('Please Enter Your Email'),
      password: Yup.string().required('Please Enter Your Password'),
      otp: Yup.lazy(() =>
        showOTPModal
          ? Yup.string().required('Please Enter the OTP')
          : Yup.string().notRequired(),
      ),
    }),
    onSubmit: async (values: any) => {
      try {
        // Make the login API call
        const loginResponse: any = await ApiUtils.authLogin({
          email: values.email,
          password: values.password,
          role_id: 2,
        });
        setOtpId(loginResponse.data.id);

        // If login is successful, set the email/password verification flag
        setIsEmailPasswordVerified(true);

        // Show OTP modal
        setShowOTPModal(true);
      } catch (error: any | unknown) {
        console.error('Login failed:', error);
        if (
          Boolean(error.response) &&
          typeof error.response.data === 'object' &&
          'message' in error.response.data
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An unexpected error occurred.');
        }
      }
    },
  });

  const handleOTPSubmit = async (): Promise<void> => {
    try {
      // Make the verify OTP API call
      const response: any = otpId;
      const otpResponse: any = await ApiUtils.verifyOTP({
        otp: loginValidation.values.otp,
        id: response,
      });
      // Close the OTP modal
      setShowOTPModal(false);

      // Store the token in cookies
      createCookies(otpResponse.data);

      dispatch(setLoginToken({token: otpResponse.data}));
      void handleGetProfile();

      // Log login success to the console (replace with your actual success handling logic)

      toast.success('Login successful!');
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error: any | unknown) {
      if (
        Boolean(error.response) &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data
      ) {
        toast.error(`OTP verification failed:${error.response.data.message}`);
      } else {
        // Handle other types of errors or just rethrow
        toast.error('OTP verification failed. An unexpected error occurred.');
      }
    }
  };
  const handleGetProfile = async (): Promise<any> => {
    try {
      const response: any = await ApiUtils.getProfile();

      const userFirstName =
        response.data.first_name === undefined
          ? 'Admin'
          : response.data.first_name;

      const userLastName =
        response.data.last_name === undefined
          ? 'Founder'
          : response.data.last_name;

      await setLocalStorageItem(variables.WAREHOUSE_USERNAME, {
        first: userFirstName,
        last: userLastName,
      });

      dispatch(
        setUserName({
          userName: {first: userFirstName, last: userLastName},
        }),
      );
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

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
                    <Row className="d-flex align-items-center mx-lg-5">
                      <Col lg={12}>
                        <img
                          src="https://kabirworld.s3.ap-south-1.amazonaws.com/static_banner/logo-dark.webp"
                          alt=""
                          className="img-fluid"
                        />
                      </Col>
                      <Col lg={12} className="text-center">
                        <h1 className="text-white fs-2 lh-base fw-lighter">
                          Welcome to Warehouse
                        </h1>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-muted fs-15">
                      Sign in to continue to Warehouse.
                    </p>
                    <div className="p-2">
                      <Form
                        action="#"
                        onSubmit={e => {
                          e.preventDefault();
                          loginValidation.handleSubmit();
                        }}>
                        <div className="mb-3">
                          <Form.Label htmlFor="email">Email</Form.Label>
                          <Form.Control
                            name="email"
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter email"
                            onChange={loginValidation.handleChange}
                            onBlur={loginValidation.handleBlur}
                            value={loginValidation.values.email ?? ''}
                            isInvalid={
                              !!(
                                Boolean(loginValidation.touched.email) &&
                                Boolean(loginValidation.errors.email)
                              )
                            }
                          />
                          {Boolean(loginValidation.touched.email) &&
                          Boolean(loginValidation.errors.email) ? (
                            <Form.Control.Feedback type="invalid">
                              {loginValidation.errors.email as string}
                            </Form.Control.Feedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <div className="float-end">
                            <Link to="/forgot-password" className="text-muted">
                              Forgot password?
                            </Link>
                          </div>
                          <Form.Label htmlFor="password-input">
                            Password
                          </Form.Label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <Form.Control
                              className="form-control pe-5 password-input"
                              placeholder="Enter password"
                              id="password-input"
                              name="password"
                              value={loginValidation.values.password ?? ''}
                              type={passwordShow ? 'text' : 'password'}
                              onChange={loginValidation.handleChange}
                              onBlur={loginValidation.handleBlur}
                              isInvalid={
                                !!(
                                  Boolean(loginValidation.touched.password) &&
                                  Boolean(loginValidation.errors.password ?? '')
                                )
                              }
                            />
                            {Boolean(loginValidation.touched.password) &&
                            Boolean(loginValidation.errors.password) ? (
                              <Form.Control.Feedback type="invalid">
                                {loginValidation.errors.password as string}
                              </Form.Control.Feedback>
                            ) : null}
                            <Button
                              variant="link"
                              className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                              type="button"
                              id="password-addon"
                              onClick={() => {
                                setPasswordShow(!passwordShow);
                              }}>
                              <i className="ri-eye-fill align-middle"></i>
                            </Button>
                          </div>
                        </div>

                        <div className="form-check">
                          <Form.Check
                            type="checkbox"
                            value=""
                            id="auth-remember-check"
                          />
                          <Form.Label htmlFor="auth-remember-check">
                            Remember me
                          </Form.Label>
                        </div>

                        <div className="mt-4">
                          <Button
                            role="loginuser"
                            variant="primary"
                            className="w-100"
                            type="submit">
                            Sign In
                          </Button>
                        </div>
                      </Form>

                      <Modal
                        show={showOTPModal && isEmailPasswordVerified}
                        onHide={() => {
                          setShowOTPModal(false);
                        }}>
                        <Modal.Header closeButton>
                          <Modal.Title>Enter OTP</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          {/* <Form onSubmit={loginValidation.handleSubmit}> */}
                          <Form
                            onSubmit={e => {
                              e.preventDefault();
                              void handleOTPSubmit();
                            }}>
                            <Form.Group controlId="formOTP">
                              <Form.Label>OTP</Form.Label>

                              <OtpInput
                                value={loginValidation.values.otp}
                                onChange={(otp: any) => {
                                  void loginValidation.setFieldValue(
                                    'otp',
                                    otp,
                                  );
                                }}
                                numInputs={6}
                                renderSeparator={<span>-</span>}
                                renderInput={(props: any) => (
                                  <input
                                    {...props}
                                    style={{
                                      width: '2em',
                                      height: '2em',
                                      margin: '0 0.25em',
                                      textAlign: 'center',
                                      fontSize: '1.5em',
                                    }}
                                    type="number"
                                    className="form-control"
                                    inputMode="numeric"
                                  />
                                )}
                              />
                              {loginValidation.errors.otp != null && (
                                <Form.Control.Feedback type="invalid">
                                  {typeof loginValidation.errors.otp ===
                                  'string'
                                    ? loginValidation.errors.otp
                                    : String(loginValidation.errors.otp)}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>
                            <Button
                              variant="primary"
                              type="submit"
                              className="mt-3"
                              // onClick={handleOTPSubmit}
                              disabled={loginValidation.values.otp.length < 6}>
                              Submit OTP
                            </Button>
                          </Form>
                        </Modal.Body>
                      </Modal>
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

export default Login;
