import React from 'react';
import {Button, Card, Col, Container, Form, Row} from 'react-bootstrap';

// Import Images
import img1 from 'assets/images/auth/img-1.png';
import {Link} from 'react-router-dom';

// Formik Validation
import * as Yup from 'yup';
import {useFormik} from 'formik';

const PasswordReset = (): React.JSX.Element => {
  document.title = 'Reset Password | Warehouse';

  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required('Please Enter Your Email')
        .email('Please add @ in the email address'),
    }),
    onSubmit: values => {
      // console.log('email', values);
    },
  });

  return (
    <section className="auth-page-wrapper position-relative bg-light min-vh-100 d-flex align-items-center justify-content-between">
      <div className="auth-header position-fixed top-0 start-0 end-0 bg-body">
        <Container fluid={true}>
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
                          Forgot Password?
                        </h1>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-muted fs-15">
                      Reset password with WareHouse.
                    </p>

                    <div
                      className="alert alert-borderless alert-warning text-center mb-2 mx-2"
                      role="alert">
                      {/* Enter your email and instructions will be sent to you! */}
                      Enter your registered email to receive further
                      instructions
                    </div>
                    <div className="p-2">
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
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email}
                            isInvalid={
                              !!(
                                Boolean(validation.touched.email) &&
                                Boolean(validation.errors.email)
                              )
                            }
                          />
                          {Boolean(validation.touched.email) &&
                          Boolean(validation.errors.email) ? (
                            <Form.Control.Feedback type="invalid">
                              <div>{validation.errors.email}</div>
                            </Form.Control.Feedback>
                          ) : null}
                        </div>

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
                          to="/auth-signin-basic"
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

export default PasswordReset;
