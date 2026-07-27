import React, {useEffect, useMemo, useState} from 'react';
import {Button, Card, Col, Row, Modal, Table, Form} from 'react-bootstrap';
import TableContainer from 'Common/TableContainer';

import Select from 'react-select';

import {toast} from 'react-toastify';
import {DOCUMENT_TITLE} from 'Common/constants/layout';
import ApiUtils from 'api/ApiUtils';
import {renderCategoryOptions} from 'utils/CategoryOption';
import {type CategoryDetailsTypes} from 'utils/TypeConfig';
import {useSelector} from 'react-redux';

const StockManagementList = (): JSX.Element => {
  document.title = DOCUMENT_TITLE.STOCK_MANAGEMENT;
  const defaultPage = 1;

  const [data, setData] = useState<any[]>([]);
  // const [error, setError] = useState<string | null>(null);
  // const [showDataButton, setShowDataButton] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [categoryListOption, setCategoryListOption] = useState([]);
  const [selectedCategoryOption, setSelectedCategoryOption] = useState([]);

  const [productListOption, setProductListOption] = useState([]);
  const [selectedProductOption, setSelectedProductOption] = useState([]);
  const [optionList, setOptionList] = useState<
    Array<{label: string; value: string[]}>
  >([]);
  const [selectedOptionItem, setSelectedOptionItem] = useState([]);
  const [pageValue, setPageValue] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState('id');

  const [sortDirection, setSortDirection] = useState('asc');
  const [inputValue, setInputValue] = useState('');
  const [totalRecords, setTotalRecords] = useState<number>(defaultPage);
  const currentData = Math.ceil(totalRecords / pageSize);
  const [optionValue, setOptionValue] = useState<
    Array<{label: string; value: string[]}>
  >([]);
  const [selectedOptionValue, setSelectedOptionValue] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(false);
  // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   const file = e.target.files?.[0];

  //   if (file != null) {
  //     const reader = new FileReader();

  //     // Check file extension
  //     const allowedExtensions = ['.csv', '.tsv', '.xlsx'];
  //     const fileExtension = file.name.split('.').pop()?.toLowerCase();

  //     if (!allowedExtensions.includes(`.${fileExtension}`)) {
  //       setError('Please choose only .csv, .tsv, and .xlsx files.');
  //       return;
  //     }

  //     setError(null);

  //     reader.onload = event => {
  //       const result = event.target?.result;

  //       if (fileExtension === 'csv' || fileExtension === 'tsv') {
  //         // Parse CSV
  //         Papa.parse(result as string, {
  //           header: true,
  //           complete: (csvResults: any) => {
  //             setData(csvResults.data);
  //             setShowDataButton(true);

  //             toast.success('File uploaded successfully!', {
  //               position: 'top-right',
  //               autoClose: 3000,
  //               hideProgressBar: false,
  //               closeOnClick: true,
  //               pauseOnHover: true,
  //               draggable: true,
  //             });
  //           },
  //         });
  //       } else if (fileExtension === 'xlsx') {
  //         // Parse Excel (.xlsx)
  //         const arrayBuffer = event.target?.result as ArrayBuffer;
  //         const data = new Uint8Array(arrayBuffer);
  //         const workbook = XLSX.read(data, {type: 'array'});

  //         // Assuming there is only one sheet in the workbook
  //         const sheetName = workbook.SheetNames[0];
  //         const excelData = XLSX.utils.sheet_to_json(
  //           workbook.Sheets[sheetName],
  //         );

  //         setData(excelData);
  //         setShowDataButton(true);

  //         toast.success('File uploaded successfully!', {
  //           position: 'top-right',
  //           autoClose: 3000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //         });
  //       }
  //     };

  //     // Use readAsArrayBuffer for binary data
  //     if (fileExtension === 'xlsx') {
  //       reader.readAsArrayBuffer(file);
  //     } else {
  //       reader.readAsText(file);
  //     }
  //   }
  // };
  // const handleDownloadTemplate = (): void => {
  //   // Define static headers
  //   const headers = ['ProductName', 'Price', 'Sold'];

  //   // Create a CSV content string with static headers
  //   // const csvContent = `Id,${headers.join(',')}\n`;
  //   const csvContent = `${headers.join(
  //     ',',
  //   )}\nSampleProduct1,10,100\nSampleProduct2,20,200\n`;

  //   // Create a Blob containing the CSV content
  //   const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8'});

  //   // Create a link element and trigger a click to download the file
  //   const link = document.createElement('a');
  //   link.href = window.URL.createObjectURL(blob);
  //   link.setAttribute('download', 'template.csv');
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };
  // const handleShowData = (): void => {
  //   setShowDataModal(true);
  // };
  const [DownloadSearchValue, setDownloadSearchValue] = useState();
  const {Layout}: any = useSelector(state => state);

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setPageValue(defaultPage);
    setShouldFetch(!shouldFetch);
  }, [pageSize]);
  useEffect(() => {
    if (Layout.layoutModeType === 'dark') {
      setIsDark(true);
    } else if (Layout.layoutModeType === 'light') {
      setIsDark(false);
    } else {
      setIsDark(false);
    }
  }, [Layout.layoutModeType]);
  const colourStyles = {
    control: (base: any) => ({
      ...base,
      background: '#0c192c',
      borderColor: '#132846',
      borderRadius: '0px',
      '&:hover': {
        borderColor: '#132846',
      },
    }),
    option: (provided: any, state: {isFocused: boolean}) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#6cb5f9' : '#0E203A', // Set background color to white when focused
      color: state.isFocused ? 'white' : '#bbc2cd', // Set text color to black when focused
      '&:hover': {
        backgroundColor: '#6cb5f9', // Set background color to white on hover
        color: 'white', // Set text color to black on hover
      },
    }),
  };

  const handleCloseModal = (): void => {
    setShowDataModal(false);
  };
  useEffect(() => {
    const fetchCategoryList = async (): Promise<void> => {
      try {
        const response: any = await ApiUtils.getCategory();
        const mappedData = response?.data?.map((data: CategoryDetailsTypes) => {
          const categoryName = renderCategoryOptions(data, response?.data);
          return {value: data.id, label: categoryName};
        });

        setCategoryListOption(mappedData);
      } catch (err) {
        toast.error('Something went wrong');
      }
    };

    void fetchCategoryList();
  }, []);

  useEffect(() => {
    const fetchProductList = async (): Promise<void> => {
      try {
        const body = {
          category_id: selectedCategoryOption?.map((item: any) =>
            String(item.value),
          ),
        };
        const response: any = await ApiUtils.getProductByCategoryId(body);
        const mappedData = response?.data?.map((data: CategoryDetailsTypes) => {
          return {value: data.id, label: data.name};
        });
        setProductListOption(mappedData);
      } catch (err) {
        toast.error('Something went wrong');
      }
    };
    if (selectedCategoryOption.length > 0) {
      void fetchProductList();
    }
  }, [selectedCategoryOption]);
  useEffect(() => {
    const fetchOptionList = async (): Promise<void> => {
      try {
        const body = {
          product_id: selectedProductOption?.map((item: any) =>
            String(item.value),
          ),
        };
        const response: any = await ApiUtils.getOptionByProductById(body);
        const mappedData = response?.data?.map((data: CategoryDetailsTypes) => {
          return {value: data.id, label: data.name};
        });
        // console.log('optionList', mappedData);
        const merged: Record<string, string[]> = {};

        mappedData.forEach((item: {label: string; value: any}) => {
          const label = item.label;
          const value = String(item.value); // convert number to string if needed

          if (merged[label] === undefined) {
            merged[label] = [];
          }
          merged[label].push(value);
        });

        const optionList = Object.entries(merged).map(([label, values]) => ({
          label,
          value: values,
        }));
        // console.log('finalOutput', optionList);

        setOptionList(optionList);
      } catch (err) {
        toast.error('Something went wrong');
      }
    };
    if (selectedProductOption.length > 0) {
      void fetchOptionList();
    }
  }, [selectedProductOption]);
  useEffect(() => {
    const fetchOptionList = async (): Promise<void> => {
      try {
        const body = {
          product_option_id: selectedOptionItem?.flatMap(
            (item: any) => item.value,
          ),
        };
        // console.log('body', body);
        const response: any = await ApiUtils.getOptionValueByOptionId(body);
        const mappedData = response?.data?.map((data: CategoryDetailsTypes) => {
          return {value: data.id, label: data.name};
        });

        const merged: Record<string, string[]> = {};

        mappedData.forEach((item: {label: string; value: any}) => {
          const label = item.label;
          const value = String(item.value); // convert number to string if needed

          if (merged[label] === undefined) {
            merged[label] = [];
          }
          merged[label].push(value);
        });
        const optionList = Object.entries(merged).map(([label, values]) => ({
          label,
          value: values,
        }));
        setOptionValue(optionList);
      } catch (err) {
        toast.error('Something went wrong');
      }
    };
    if (selectedProductOption.length > 0) {
      void fetchOptionList();
    }
  }, [selectedOptionItem]);
  useEffect(() => {
    void fetchProductStockList();
  }, []);
  const fetchProductStockList = async (body?: any): Promise<void> => {
    try {
      // console.log('body', body);
      setDownloadSearchValue(body);
      const response: any = await ApiUtils.getProductStockList(body);
      setData(response?.data?.data);
      setTotalRecords(response?.data?.total ?? defaultPage);
    } catch (err) {
      toast.error('Something went wrong');
    }
  };
  const handleProductClick = (product: any): void => {
    window.open(
      `${process.env.REACT_APP_FRONTEND_URL}/product/${product?.id}?option=${product?.product_option_value_id}`,
    );
  };

  const columns = useMemo(
    () => [
      // {
      //   Header: 'ID',
      //   disableFilters: true,
      //   filterable: true,
      //   accessor: 'id',
      //   Cell: ({cell}: {cell: {value: string}}) => {
      //     return <div>{cell.value}</div>;
      //   },
      // },

      {
        Header: 'Product Name',
        accessor: 'name',
        disableFilters: true,
        filterable: true,
        Cell: (cell: any) => {
          return (
            <div
              onClick={() => {
                handleProductClick(cell.row.original);
              }}
              className="clickable-text ">
              {(cell.value as boolean) ? cell.value : '-'}
            </div>
          );
        },
      },
      {
        Header: 'Category',
        accessor: 'category_name',
        disableFilters: true,
        filterable: true,
      },
      {
        Header: 'Price',
        accessor: 'total_amount',
        disableFilters: true,
        filterable: true,
      },
      {
        Header: 'Stock',
        disableFilters: true,
        filterable: true,
        accessor: 'total_qty',
      },
    ],
    [],
  );
  const handleSelectCategoryChange = (selected: any): void => {
    setSelectedCategoryOption(selected);
    setTotalRecords(defaultPage);
    void fetchProductStockList({
      category_id: selected?.map((item: any) => String(item.value)),
    });
    if (
      selectedOptionItem != null ||
      selectedProductOption != null ||
      selectedOptionValue != null
    ) {
      setSelectedProductOption([]);
      setSelectedOptionItem([]);
      setSelectedOptionValue([]);
    }
  };
  const handleSelectProductChange = (selected: any): void => {
    setSelectedProductOption(selected);
    setTotalRecords(defaultPage);

    if (selected.length > 0) {
      void fetchProductStockList({
        product_id: selected?.flatMap((item: any) => String(item.value)),
      });
    } else {
      void fetchProductStockList({
        category_id: selectedCategoryOption?.flatMap((item: any) =>
          String(item.value),
        ),
      });
    }
    if (selectedOptionItem != null || selectedOptionValue != null) {
      setSelectedOptionItem([]);
      setSelectedOptionValue([]);
    }
  };
  const handleSelectOptionChange = (selected: any): void => {
    setSelectedOptionItem(selected);
    setTotalRecords(defaultPage);

    if (selected.length > 0) {
      void fetchProductStockList({
        product_option_id: selected?.flatMap((item: any) => item.value),
      });
    } else {
      void fetchProductStockList({
        product_id: selectedProductOption?.flatMap((item: any) => item.value),
      });
    }

    if (selectedOptionValue != null) {
      setSelectedOptionValue([]);
    }
  };
  const handleSelectOptionValueChange = (selected: any): void => {
    setSelectedOptionValue(selected);
    setTotalRecords(defaultPage);

    if (selected.length > 0) {
      void fetchProductStockList({
        product_option_value_id: selected?.flatMap((item: any) => item.value),
      });
    } else {
      void fetchProductStockList({
        product_option_id: selectedOptionItem?.flatMap(
          (item: any) => item.value,
        ),
      });
    }
  };

  const getValue = (allData: any): any => {
    return allData?.map((item: any) => item.value);
  };
  const handleNextPagination = (pageValue: any): void => {
    if (currentData > 0 && currentData > pageValue) {
      setPageValue(pageValue + 1);
    }

    const body = {
      product_id: getValue(selectedProductOption),
      category_id: getValue(selectedCategoryOption),
      product_option_id: getValue(selectedOptionItem),
      product_option_value_id: getValue(selectedOptionValue),
      page: pageValue + 1,
      per_page: pageValue,
      page_size: pageSize,
      search: inputValue,
      sort_column: sortColumn,
      sort_direction: sortDirection,
    };
    void fetchProductStockList(body);
  };

  const handlePrevPagination = (pageValue: any): void => {
    if (pageValue > 1 && currentData >= pageValue) {
      setPageValue(pageValue - 1);
    }
    const body = {
      product_id: getValue(selectedProductOption),
      category_id: getValue(selectedCategoryOption),
      product_option_id: getValue(selectedOptionItem),
      product_option_value_id: getValue(selectedOptionValue),
      page: pageValue - 1,
      per_page: pageValue,
      page_size: pageSize,
      search: inputValue,
      sort_column: sortColumn,
      sort_direction: sortDirection,
    };
    void fetchProductStockList(body);
  };
  const handleSortByColumn = (column: string): void => {
    let newSortDirection = 'asc';

    if (column === sortColumn) {
      newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      newSortDirection = 'desc';
    }
    setSortDirection(newSortDirection);
    setSortColumn(column);
    const body = {
      product_id: getValue(selectedProductOption),
      category_id: getValue(selectedCategoryOption),
      product_option_id: getValue(selectedOptionItem),
      product_option_value_id: getValue(selectedOptionValue),
      sort_column: column,
      sort_direction: newSortDirection,
      search: inputValue,
      page_size: pageSize,
      page: pageValue,
    };
    void fetchProductStockList(body);
  };
  const handleSearch = (value: string): void => {
    setTotalRecords(defaultPage);
    setInputValue(value);
    const body = {
      product_id: getValue(selectedProductOption),
      category_id: getValue(selectedCategoryOption),
      product_option_id: getValue(selectedOptionItem),
      product_option_value_id: getValue(selectedOptionValue),
      search: value,
      sort_column: sortColumn,
      sort_direction: sortDirection,
      page_size: pageSize,
      page: pageValue,
    };
    void fetchProductStockList(body);
  };
  const handlePageSize = (value: any): void => {
    setPageSize(value);
    const body = {
      product_id: getValue(selectedProductOption),
      category_id: getValue(selectedCategoryOption),
      product_option_id: getValue(selectedOptionItem),
      product_option_value_id: getValue(selectedOptionValue),
      page_size: value,
      search: inputValue,
      sort_column: sortColumn,
      sort_direction: sortDirection,
      page: 1,
    };
    void fetchProductStockList(body);
  };
  return (
    <Row data-testid="stocklist">
      <Col lg={12}>
        <Card>
          <Card.Body className="bg-soft-light border border-dashed border-start-0 border-end-0">
            <Form>
              <Row className="g-3 justify-content-between align-items-center">
                <Col lg={4}>
                  <div aria-labelledby="category-name-label" className="mb-3">
                    <Form.Label
                      id="category-name-label"
                      htmlFor="category-name">
                      Category
                    </Form.Label>
                    <Select
                      isMulti
                      id="category-name"
                      name="category-name"
                      value={selectedCategoryOption}
                      styles={isDark ? colourStyles : {}}
                      onChange={handleSelectCategoryChange}
                      options={categoryListOption}></Select>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <Form.Label htmlFor="product-name">Product</Form.Label>
                    <Select
                      isMulti
                      name="product-name"
                      isDisabled={!(selectedCategoryOption.length > 0)}
                      value={selectedProductOption}
                      styles={isDark ? colourStyles : {}}
                      onChange={handleSelectProductChange}
                      options={productListOption}></Select>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <Form.Label htmlFor="product-name">Option</Form.Label>
                    {/* <Select
                      isMulti
                      name="option-name"
                      isDisabled={!(selectedProductOption.length > 0)}
                      value={selectedOptionItem}
                      styles={isDark ? colourStyles : {}}
                      onChange={handleSelectOptionChange}
                      options={optionList}></Select> */}
                    <Select
                      isMulti
                      name="option-name"
                      isDisabled={!(selectedProductOption.length > 0)}
                      value={selectedOptionItem}
                      styles={isDark ? colourStyles : {}}
                      options={optionList}
                      getOptionLabel={(e: {label: string; value: any[]}) =>
                        `${e.label} `
                      }
                      getOptionValue={(e: {label: string}) => e.label} // label is unique
                      onChange={handleSelectOptionChange}
                    />
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <Form.Label htmlFor="product-name">Option Value</Form.Label>
                    {/* <Select
                      isMulti
                      name="option-value-name"
                      isDisabled={!(selectedOptionItem.length > 0)}
                      value={selectedOptionValue}
                      styles={isDark ? colourStyles : {}}
                      onChange={handleSelectOptionValueChange}
                      options={optionValue}></Select> */}

                    <Select
                      isMulti
                      name="option-value-name"
                      isDisabled={!(selectedProductOption.length > 0)}
                      value={selectedOptionValue}
                      styles={isDark ? colourStyles : {}}
                      options={optionValue}
                      getOptionLabel={(e: {label: string; value: any[]}) =>
                        `${e.label}`
                      }
                      getOptionValue={(e: {label: string}) => e.label} // label is unique
                      onChange={handleSelectOptionValueChange}
                    />
                  </div>
                </Col>

                {/* <Col xxl={4} sm={4}>
                  <Button
                    variant="link"
                    type="button"
                    className="text-decoration-none btn-sm"
                    onClick={handleDownloadTemplate}>
                    <i className="bi bi-file-arrow-down-fill me-1 align-bottom"></i>{' '}
                    Download Template
                  </Button>
                  <label htmlFor="fileUpload" className="btn btn-primary w-120">
                    <i className="bi bi-file-earmark-arrow-up-fill me-1 align-bottom"></i>{' '}
                    File Upload
                    <input
                      id="fileUpload"
                      type="file"
                      accept=".csv, .tsv, .xlsx"
                      onChange={handleFileUpload}
                      style={{display: 'none'}}
                    />
                  </label>
                  {error != null && <Alert variant="danger">{error}</Alert>}
                  <Button
                    variant="link"
                    type="button"
                    className="text-decoration-none btn-sm"
                    onClick={handleShowData}
                    disabled={!showDataButton}>
                    Show Data
                  </Button>
                </Col> */}
              </Row>
            </Form>
          </Card.Body>
          <Card.Body>
            <div>
              <TableContainer
                columns={columns}
                data={data ?? []}
                isGlobalFilter={true}
                handleNextPagination={handleNextPagination}
                handlePrevPagination={handlePrevPagination}
                pageValue={pageValue}
                iscustomPageSize={false}
                isBordered={true}
                customPageSize={pageSize}
                pageSize={pageSize}
                currentData={currentData}
                setPageSize={handlePageSize}
                className="custom-header-css"
                tableClass="table-centered align-middle table-nowrap mb-0"
                theadClass="text-muted table-light"
                SearchPlaceholder="Search Stocks..."
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSearch={handleSearch}
                handleSortByColumn={handleSortByColumn}
                isDownload={true}
                isDownloadAPI={ApiUtils.ExportStock}
                DownloadSearchValue={DownloadSearchValue}
              />
              <div className="noresult" style={{display: 'none'}}>
                <div className="text-center">
                  <h5 className="mt-2">Sorry! No Result Found</h5>
                  <p className="text-muted mb-0">All Products are in stocks</p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Modal show={showDataModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Data Table</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Display your data table here */}
          <Table striped bordered hover>
            <thead>
              <tr>
                {data?.length > 0 &&
                  Object.keys(data[0])?.map(header => (
                    <th key={header}>{header}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {data?.map((row, index) => (
                <tr key={index}>
                  {Object.values(row)?.map((value, colIndex) => (
                    <td key={colIndex}>{String(value)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
};

export default StockManagementList;
