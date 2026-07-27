import React from 'react';

// import Components
import {DOCUMENT_TITLE} from 'Common/constants/layout';
import ProductTable from 'ProductListing/ProductTable';

const ProductListing = (): JSX.Element => {
  document.title = DOCUMENT_TITLE.PRODUCT_LIST;

  return <ProductTable />;
};

export default ProductListing;
