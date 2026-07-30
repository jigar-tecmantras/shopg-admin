import React, {useEffect, useState} from 'react';
import {Nav, Tab, Container} from 'react-bootstrap';
import Breadcrumb from 'Common/BreadCrumb';
import ProductCommon from './ProductCommon';
import ProductOptions from './ProductOptions';
import ApiUtils from 'api/ApiUtils';
import {useLocation} from 'react-router-dom';
import {productTabKeys} from 'utils/constant';
import {DOCUMENT_TITLE} from 'Common/constants/layout';
import {useDispatch} from 'react-redux';
import {setisFormUpdate} from 'slices/location/reducer';

function index(): React.JSX.Element {
  document.title = DOCUMENT_TITLE.CREATE_PRODUCT;
  const {pathname} = useLocation();
  const [editOptionData, setEditOptionData] = useState<any>();
  const [editData, setEditData] = useState<any>();
  const [activeKey, setActiveKey] = useState<any>(productTabKeys.DATA);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const search = useLocation().search;
  const productId = new URLSearchParams(search).get('productId');
  const dispatch = useDispatch<any>();

  useEffect(() => {
    if (productId != null) {
      setIsLoading(true);

      ApiUtils.getProduct(productId)
        .then((res: any) => {
          setEditData({
            id: res?.data?.id,
            // sku: res?.data?.sku,
            name: res?.data?.name,
            category_id: res?.data?.category_id,
            is_gift_packing: res?.data?.is_gift_packing,
            description: res?.data?.description,
            description_json: res?.data?.description_json,
            status_id: res?.data?.status_id,
            gst_tax_id: res?.data?.gst_tax_id,
            category_brand_id: res?.data?.category_brand_id,
            brand_id: res?.data?.brand_id,
          });
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (res.data.product_option) {
            const updateOptionValueData =
              res?.data?.product_option?.product_option_value.map(
                (product: any) => ({
                  id: product.id ?? '',
                  product_id: product.product_id ?? '',
                  option_value_id: product.option_value_id ?? '',
                  quantity: product.quantity ?? '',
                  price: product.price ?? '',
                  special_price: product.special_price_value ?? '',
                  // special_price_value: product.special_price_value ?? '',

                  minimum_quantity: product.minimum_quantity ?? '',
                  weight: product.weight ?? '',
                  weight_id: product.weight_id ?? '',
                  length: product.length ?? '',
                  length_id: product.length_id ?? '',
                  width: product.width ?? '',
                  height: product.height ?? '',
                  product_tag: product.product_tag ?? '',
                  disable_after_out_of_stock:
                    product.disable_after_out_of_stock ?? '',
                  status_id: product?.status_id,
                  cost_to_company: product.cost_to_company ?? '',
                  image: product.product_option_value_image ?? '',
                  sku: product?.sku ?? '',
                  is_new_arrival: product?.is_new_arrival ?? '',
                }),
              );

            const productOption = {
              id: '',
              product_id: '',
              option_id: '',
              product_option_value: '',
            };
            productOption.id = res?.data?.product_option?.id;
            productOption.product_id = res?.data?.product_option?.product_id;
            productOption.option_id = res?.data?.product_option?.option_id;
            productOption.product_option_value = updateOptionValueData;
            setEditOptionData(productOption);
          }
          setIsLoading(false);
        })
        .catch((_err: any) => {
          setIsLoading(false);
        });
    }
    dispatch(setisFormUpdate(false));
  }, [productId]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title={
              pathname === '/products-create'
                ? 'Create Product'
                : 'Edit Product'
            }
            pageTitle="Products"
            pageLink="/products"
          />
          {isLoading && productId != null ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                borderRadius: '8px',
                marginTop: '20px',
                gap: '20px',
              }}>
              <div
                style={{
                  border: '4px solid rgba(0, 0, 0, 0.1)',
                  borderLeftColor: '#ffffff',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <p style={{fontSize: '16px', fontWeight: '500', margin: 0}}>Loading Product...</p>
            </div>
          ) : (
            <Tab.Container
              activeKey={activeKey}
              onSelect={key => {
                setActiveKey(key);
              }}>
              <Nav as="ul" variant="tabs" className="mb-3">
                <Nav.Item as="li">
                  {' '}
                  <Nav.Link eventKey={productTabKeys.DATA}> Data </Nav.Link>{' '}
                </Nav.Item>
                <Nav.Item as="li">
                  {' '}
                  <Nav.Link
                    disabled={productId == null}
                    eventKey={productTabKeys.OPTIONS}>
                    {' '}
                    Options{' '}
                  </Nav.Link>{' '}
                </Nav.Item>
              </Nav>

              <Tab.Content className="text-muted">
                <Tab.Pane eventKey={productTabKeys.DATA} id={productTabKeys.DATA}>
                  <ProductCommon
                    editData={editData}
                    setActiveKey={setActiveKey}
                  />
                </Tab.Pane>
                <Tab.Pane
                  eventKey={productTabKeys.OPTIONS}
                  id={productTabKeys.OPTIONS}>
                  <ProductOptions editOptionData={editOptionData} />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          )}
        </Container>
      </div>

      <style>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </React.Fragment>
  );
}

export default index;
