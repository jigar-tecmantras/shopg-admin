import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Col, Row} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {setisFormUpdate} from 'slices/location/reducer';

interface BreadCrumbProps {
  title: string;
  pageTitle: string;
  pageLink?: string;
}
const BreadCrumb = ({
  title,
  pageTitle,
  pageLink,
}: BreadCrumbProps): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isFormUpdate: boolean = useSelector(
    (state: any) => state.currentLocation.isFormUpdate,
  );
  const handlePageNavigation: any = (e: any, path: string) => {
    e.preventDefault();
    if (isFormUpdate) {
      const userConfirmed = window.confirm(
        'You have unsaved changes. Do you really want to leave?',
      );
      if (!userConfirmed) {
        return; // Stay on the current page
      }
      dispatch(setisFormUpdate(false));
    }

    dispatch(setisFormUpdate(false));
    navigate(path); // Proceed with navigation
  };
  return (
    <Row>
      <Col xs={12}>
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 role="title" className="mb-sm-0">
            {title}
          </h4>

          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              <li className="breadcrumb-item">
                <Link
                  to={pageLink ?? '#'}
                  onClick={e => {
                    e.preventDefault(); // Prevent default navigation
                    handlePageNavigation(e, pageLink ?? '#'); // Call your custom navigation handler
                  }}>
                  {pageTitle}
                </Link>
              </li>
              <li className="breadcrumb-item active">{title}</li>
            </ol>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default BreadCrumb;
