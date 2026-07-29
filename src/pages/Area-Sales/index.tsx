/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import TableContainer from 'Common/TableContainer';
import ApiUtils from 'api/ApiUtils';
import React, {useEffect, useState} from 'react';
import {Card, Col, Container} from 'react-bootstrap';
import {toast} from 'react-toastify';

const AreaSpecificSales = (): any => {
  document.title = 'Area Specification Sales | Admin';

  const defaultPage = 1;
  const [pageValue, setPageValue] = useState(defaultPage);
  const [totalRecords, setTotalRecords] = useState(defaultPage);
  const currentData = Math.ceil(totalRecords / 10);
  const [sortColumn, setSortColumn] = useState('product_id');

  const [search, setSearch] = useState<string>('');
  const [areaList, setAreaList] = useState([]);
  const [sortDirection, setSortDirection] = useState('asc');
  const [pageSize, setPageSize] = useState(10);
  const [shouldFetch, setShouldFetch] = useState(false);
  useEffect(() => {
    setPageValue(defaultPage);
    setShouldFetch(!shouldFetch);
  }, [pageSize]);
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

  const areaSalesList = async (): Promise<void> => {
    try {
      const resp: any = await ApiUtils.getAreaSpecificSalesList(
        `?page=${pageValue}&page_size=${pageSize}&search=${search}&sort_column=${sortColumn}&sort_direction=${sortDirection}`,
      );
      setAreaList(resp?.data?.data);
      setTotalRecords(resp?.data.total);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleClick = (product: any): void => {
    window.open(
      `${process.env.REACT_APP_FRONTEND_URL}/product/${product?.product_id}?option=${product?.product_option_value_id}`,
    );
  };

  const handleSortByColumn = async (column: string): Promise<void> => {
    try {
      let newSortDirection = 'asc';

      if (column === sortColumn) {
        newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        newSortDirection = 'desc';
      }

      const resp: any = await ApiUtils.getAreaSpecificSalesList(
        `?page=${pageValue}&page_size=${pageSize}&search=${search}&sort_column=${column}&sort_direction=${newSortDirection}`,
      );
      setAreaList(resp?.data?.data ?? []);
      setTotalRecords(resp?.data.total);
      setSortDirection(newSortDirection);
      setSortColumn(column);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSearch = (value: string): void => {
    setSearch(value);
    setPageValue(defaultPage);
  };

  useEffect(() => {
    void areaSalesList();
  }, [pageValue, shouldFetch, search]);

  const columns = [
    {
      Header: 'Product Name',
      disableFilters: true,
      filterable: true,
      accessor: 'product_name',
      Cell: (cell: any) => {
        return (
          <div
            className="d-flex align-items-center"
            onClick={() => {
              handleClick(cell.row.original);
            }}>
            <div className="clickable-text">
              {cell.value ? cell.value : '-'}
            </div>
          </div>
        );
      },
    },
    {
      Header: 'Price Per Product',
      disableFilters: true,
      filterable: true,
      accessor: 'price_per_product',
      Cell: (cell: any) => {
        return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
      },
    },
    {
      Header: 'Pin Code',
      disableFilters: true,
      filterable: true,
      accessor: 'area_name',
      Cell: (cell: any) => {
        return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
      },
    },
    {
      Header: 'Total Product Sales',
      disableFilters: true,
      filterable: true,
      accessor: 'total_product_sale',
      Cell: (cell: any) => {
        const totalSales = cell.row.original.total_sales;
        return <div>{(totalSales as boolean) ? totalSales : '-'}</div>;
      },
    },
    {
      Header: 'Total Sales Amount',
      disableFilters: true,
      filterable: true,
      accessor: 'total_amount',
      Cell: (cell: any) => {
        return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
      },
    },
  ];

  const salesList = areaList?.map((data: any) => {
    return {
      product_name: data.product_name,
      area_name: data.postcode,
      total_sales: data.total_product_sale,
      total_amount: data.total_amount,
      price_per_product: data.price,
      product_id: data.product_id,
      product_option_value_id: data.product_option_value_id,
    };
  });

  return (
    <div className="page-content">
      <Container fluid>
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-sm-0">Area Specific Sales</h4>
        </div>
        <Col xxl={12}>
          <Card>
            <Card.Body>
              <TableContainer
                columns={columns}
                data={salesList ?? []}
                isBordered={true}
                isGlobalFilter={true}
                iscustomPageSize={true}
                handleNextPagination={handleNextPagination}
                handlePrevPagination={handlePrevPagination}
                pageValue={pageValue}
                customPageSize={pageSize}
                currentData={currentData}
                setPageSize={setPageSize}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSearch={handleSearch}
                handleSortByColumn={handleSortByColumn}
                className="custom-header-css"
                tableClass="table-centered align-middle table-nowrap mb-0"
                theadClass="text-muted table-light"
                SearchPlaceholder="Search Area..."
              />
            </Card.Body>
          </Card>
        </Col>
      </Container>
    </div>
  );
};

export default AreaSpecificSales;
