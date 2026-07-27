import React from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';

interface RouterProps {
  location: any; // Update the type based on your requirement
  navigate: any; // Update the type based on your requirement
  params: any; // Update the type based on your requirement
}

function withRouter(Component: React.ComponentType<any>): React.FC {
  function ComponentWithRouterProp(props: any): React.ReactElement {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const routerProps: RouterProps = {location, navigate, params};

    return <Component {...props} router={routerProps} />;
  }

  return ComponentWithRouterProp;
}

export default withRouter;
