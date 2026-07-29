import React, {useEffect, useState} from 'react';
import {Card, Container, Col, Row, Modal, Button} from 'react-bootstrap';

import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';
import TableContainer from 'Common/TableContainer';
import DefaultImgPlaceholder from 'assets/images/default-placeholder.jpg';
import StarRating from 'Common/StarRating';
import MediaComponent from 'Common/MediaComponent';

const Wishlist = (): JSX.Element => {
  document.title = 'Wishlist Management | Admin';
  const defaultPage = 1;
  const [pageValue, setPageValue] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(defaultPage);
  const currentData = Math.ceil(totalRecords / 10);

  const [list, setList]: any[] = useState();
  const [search, setSearch] = useState<string>('');
  const [sortColumn, setSortColumn] = useState('wishlist.id');

  const [sortDirection, setSortDirection] = useState('asc');

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    setPageValue(defaultPage);
    setShouldFetch(!shouldFetch);
  }, [pageSize]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const res: any = await ApiUtils.getCategory();
        const mappedData = res?.data?.map((data: any) => ({
          value: data?.id,
          label: data?.name,
        }));
        setCategories(mappedData);
      } catch (err: any) {
        toast.error(err?.message);
      }
    };

    void fetchData();
  }, []);

  const getCategoryLabel = (categoryId: number): string => {
    const category: any = categories.find(
      (cat: any) => cat?.value === categoryId,
    );
    return category ? category?.label : 'Unknown Category';
  };
  const handleImageClick = (product: any): void => {
    window.open(
      `${process.env.REACT_APP_FRONTEND_URL}/product/${product?.product_id}?option=${product?.product_option_value_id}`,
    );
  };

  const closeModal = (): void => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };
  async function getWishlist(): Promise<void> {
    try {
      const response: any = await ApiUtils.getWishlistedItem(
        `page_size=${pageSize}&page=${pageValue}&search=${search}&sort_column=${sortColumn}&sort_direction=${sortDirection}`,
      );
      setList(response.data.data ?? []);
      setTotalRecords(response.data.total);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    void getWishlist();
  }, [pageValue, shouldFetch, search]);

  const handleNextPagination = (pageSize: any): void => {
    if (currentData > 0 && currentData > pageSize) {
      setPageValue(pageSize + 1);
    }
  };
  const handlePrevPagination = (pageSize: any): void => {
    if (pageSize > 1 && currentData >= pageSize) {
      setPageValue(pageSize - 1);
    }
  };
  const handleSortByColumn = async (column: string): Promise<void> => {
    try {
      let newSortDirection = 'asc';

      if (column === sortColumn) {
        newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        newSortDirection = 'desc';
      }

      const response: any = await ApiUtils.getWishlistedItem(
        `page_size=${pageSize}&page=${pageValue}&search=${search}&sort_column=${column}&sort_direction=${newSortDirection}`,
      );
      setList(response.data.data ?? []);
      setSortDirection(newSortDirection);
      setTotalRecords(response.data.total);
      setSortColumn(column);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const columns = [
    {
      Header: 'Customer ID',
      disableFilters: true,
      filterable: true,
      accessor: 'customer_id',
      Cell: (cell: any) => {
        return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
      },
    },
    {
      Header: 'Product Name',
      accessor: 'product_name',
      Cell: ({cell}: {cell: any}) => (
        <div
          className="d-flex align-items-center"
          onClick={() => {
            handleImageClick(cell.row.original);
          }}>
          <div className="flex-shrink-0 me-3">
            <div className="avatar-title bg-light rounded">
              <MediaComponent
                src={cell.row.original.image}
                alt=""
                className="avatar-xs"
              />
            </div>
          </div>
          <div className="clickable-text">{cell.row.original.product_name}</div>
        </div>
      ),
    },
    {
      Header: 'Customer Name',
      disableFilters: true,
      filterable: true,
      accessor: 'customer_first_name',
      Cell: (cell: any) => {
        const fullName = cell.row.original.name; // Access the 'name' property from the original data
        return <div>{(fullName as boolean) ? fullName : '-'}</div>;
      },
    },
    {
      Header: 'Customer Email',
      disableFilters: true,
      filterable: true,
      accessor: 'customer_email',
      Cell: (cell: any) => {
        return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
      },
    },
    {
      Header: 'Customer Phone Number',
      disableFilters: true,
      filterable: true,
      accessor: 'customer_phone',
      Cell: (cell: any) => {
        return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
      },
    },
    {
      Header: 'Amount',
      disableFilters: true,
      filterable: true,
      accessor: 'price',
      Cell: (cell: any) => {
        return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
      },
    },
  ];

  const wishlistItems = list?.map((data: any) => {
    return {
      customer_id: data?.customer_id,
      name: data?.customer_first_name + ' ' + data?.customer_last_name,
      price: data?.special_price,
      product_name: data?.product_name,
      product_sku: data?.product_sku,
      color: data?.option_value_name,
      rating: data?.rating,
      product_id: data?.product_id,
      product_option_value_id: data?.product_option_value_id,
      rating_count: data?.rating_count,
      category_name: data?.category_name,
      image:
        data?.product_option_value_image != null
          ? data?.product_option_value_image[0]?.image
          : DefaultImgPlaceholder,
      customer_email: data?.customer_email,
      customer_phone: data?.customer_phone,
    };
  });
  const handleSearch = (value: string): void => {
    setSearch(value);
    setPageValue(defaultPage);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-sm-0">Wishlist Management</h4>
        </div>
        <Row>
          <Col xxl={12}>
            <Card>
              <Card.Body>
                <TableContainer
                  columns={columns ?? []}
                  data={wishlistItems ?? []}
                  isGlobalFilter={true}
                  handleNextPagination={handleNextPagination}
                  handlePrevPagination={handlePrevPagination}
                  pageValue={pageValue}
                  iscustomPageSize={false}
                  isBordered={true}
                  customPageSize={pageSize}
                  pageSize={pageSize}
                  currentData={currentData}
                  setPageSize={setPageSize}
                  // isAddOptions={true}
                  className="custom-header-css"
                  tableClass="table-centered align-middle table-nowrap mb-0"
                  theadClass="text-muted table-light"
                  SearchPlaceholder="Search product name or customer name"
                  onSearch={handleSearch}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  handleSortByColumn={handleSortByColumn}
                />
              </Card.Body>
            </Card>
            {/* Modal for Product Details */}
            <Modal show={isModalOpen} onHide={closeModal}>
              <Modal.Header closeButton>
                <Modal.Title>Product Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* Render product details inside the modal */}
                {Boolean(selectedProduct) && (
                  <div>
                    <img
                      src={selectedProduct?.image}
                      className="avatar-xl"
                      alt="Error"
                      style={{width: '200px', height: '200px'}}
                    />
                    <p>
                      <strong>Product Name: </strong>
                      {selectedProduct?.product_name}
                    </p>
                    <p>
                      <strong>Product SKU: </strong>
                      {selectedProduct?.product_sku}
                    </p>
                    <p>
                      <strong>Product Color: </strong>
                      {selectedProduct?.color}
                    </p>
                    <p>
                      <strong>Product Price: </strong>₹ {selectedProduct?.price}
                    </p>
                    <p>
                      <strong>Product Rating: </strong>
                      <StarRating
                        rating={selectedProduct?.rating}
                        totalStars={5}
                      />
                    </p>
                    <p>
                      <strong>Number of Customer Rated: </strong>
                      {selectedProduct?.rating_count}
                    </p>
                    <p>
                      <strong>Product Category: </strong>
                      {getCategoryLabel(selectedProduct?.category_name)}
                    </p>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>{' '}
      </Container>
    </div>
  );
};

export default Wishlist;
