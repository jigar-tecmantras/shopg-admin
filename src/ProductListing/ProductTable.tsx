/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, {useEffect, useMemo, useRef, useState} from 'react';
import TableContainer from 'Common/TableContainer';
import {toast} from 'react-toastify';
import {Button, Card, Col, Container, Form, Row} from 'react-bootstrap';
import {useLocation, useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import ApiUtils from 'api/ApiUtils';
import {useDispatch, useSelector} from 'react-redux';
import {setProductIds} from 'slices/statusChange/reducer';
import {changeStatus, SelectedDeletes} from 'slices/thunk';
import {setDeleteProductIds} from 'slices/multipleDelete/reducer';
import {variables} from 'utils/constant';
import {type CategoryDetailsTypes} from 'utils/TypeConfig';
import {renderCategoryOptions} from 'helpers/CategoryOption';

// representing a table of products listing.
interface OptionType {
  value: string;
  label: string;
}
interface ProductItemType {
  data: {
    data: [];
    page_size: number;
    total: number;
  };
  message: string;
}
const ProductTable = (): JSX.Element => {
  const [productItem, setProductItem] = React.useState<
    ProductItemType | undefined
  >();
  const navigate = useNavigate();

  const [pageSize, setPageSize] = useState(10);
  const defaultPage = 1;
  const [pageValue, setPageValue] = useState(defaultPage);

  const [sortColumn, setSortColumn] = useState('id');

  const [search, setSearch] = useState<string>('');

  const [sortDirection, setSortDirection] = useState('asc');

  const [totalRecords, setTotalRecords] = useState(defaultPage);

  // Utility function to detect if a URL is an image or video
  const isImage = (url: string): boolean => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const isVideo = (url: string): boolean => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedMainIds, setSelectedMainIds] = useState<number[]>([]);

  // const {currentLocation}: any = useSelector(state => state);
  // console.log('🚀 ~ index ~ data:', currentLocation.currentLocation);
  const [categoryListOption, setCategoryListOption] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [selectedCategoryOption, setSelectedCategoryOption] = useState([]);
  const [selectedCategoryOption, setSelectedCategoryOption] = useState<
    Array<{value: string; label: string}>
  >([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const category_Id = searchParams.get('category_id');

  const [isCheckboxChanged, setIsCheckboxChanged] = useState(false);
  const currentData = Math.ceil(totalRecords / pageSize);
  const dispatch = useDispatch<any>();
  const [isStatusChange, setisStatusChange] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [Checked, seChecked] = useState(false);
  const [resetSearchFlag, setResetSearchFlag] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);

  const prevCountRef = useRef<number>(selectedCategoryOption.length);

  useEffect(() => {
    const prevCount = prevCountRef.current;
    const currentCount = selectedCategoryOption.length;

    // Only trigger reset if:
    // Categories were > 0 → now 0
    // AND search exists
    if (prevCount > 0 && currentCount === 0 && search) {
      setResetSearchFlag(prev => !prev);
      setSearch('');
    }

    // Update ref for next comparison
    prevCountRef.current = currentCount;
  }, [selectedCategoryOption, search]);

  useEffect(() => {
    setPageValue(defaultPage);
    setShouldFetch(!shouldFetch);
  }, [pageSize]);

  const fetchData = async (
    pageValue: string | number | undefined,
    pageSize: string | number | undefined,
    sortColumn: string | undefined,
    sortDirection: string | undefined,
    search: string | undefined,
    selectedCategoryOption: any,
  ): Promise<void> => {
    try {
      // console.log(selectedCategoryOption, 'selectedCategoryOption');
      let valuesArray;
      if (selectedCategoryOption?.length > 0) {
        valuesArray = selectedCategoryOption?.map(
          (item: OptionType) => item.value,
        );
      }
      // console.log(
      //   valuesArray,
      //   'selectedCategoryOption',
      //   selectedCategoryOption,
      // );
      const response = await ApiUtils.getProductOptionList({
        page: pageValue,
        page_size: pageSize,
        sort_column: sortColumn,
        sort_direction: sortDirection,
        search,
        category_id: valuesArray ?? [],
      });

      setProductItem(response as ProductItemType);
      setTotalRecords((response as ProductItemType)?.data?.total);
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      // setisStatusChange(false);
      setAllChecked(false);
    }
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

        if (category_Id) {
          const selectedOption = mappedData.find(
            (option: {value: string | null}) => option.value === category_Id,
          );

          setSelectedCategoryOption(selectedOption ? [selectedOption] : []);
        } else {
          setSelectedCategoryOption([]);
        }
      } catch (err) {
        toast.error('Something went wrong');
      }
    };

    void fetchCategoryList();
  }, [category_Id]);
  useEffect(() => {
    // ApiUtils.getProductOptionList(
    //   `?page=${pageValue}&page_size=${pageSize}&sort_column=${sortColumn}&sort_direction=${sortDirection}&search=${}&category_id=${
    //     category_Id ?? ''
    //   }`,
    // )

    //   .then((data: any): any => {
    //     setProductItem(data as ProductItemType);
    //     setTotalRecords((data as ProductItemType)?.data?.total);
    //   })
    //   .catch((error: any) => {
    //     toast.error(error.message);search
    //   });
    // setisStatusChange(false);
    // setAllChecked(false);
    // ⛔ do not run until dropdown value is resolved
    // if (category_Id && selectedCategoryOption.length === 0) return;
    console.log(isStatusChange, 'selectedCategoryOption');

    void fetchData(
      pageValue,
      pageSize,
      sortColumn,
      sortDirection,
      search,
      selectedCategoryOption,
    );

    // }, [pageValue, pageSize, sortColumn, sortDirection, search, category_Id]);
  }, [
    pageValue,
    // pageSize,
    shouldFetch,
    search,
    location,
    selectedCategoryOption,
  ]);
  useEffect(() => {
    if (!isStatusChange) return;

    void fetchData(
      pageValue,
      pageSize,
      sortColumn,
      sortDirection,
      search,
      selectedCategoryOption,
    );

    setisStatusChange(false);
  }, [isStatusChange]);

  const handleDeleteProduct = async (Pid: any): Promise<void> => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (result.isConfirmed) {
      const ids = Array.isArray(Pid) ? Pid : [Pid];

      ApiUtils.deleteMultipleProduct({id: ids})
        // eslint-disable-next-line unused-imports/no-unused-vars
        .then(async data => {
          await Swal.fire({
            title: 'Deleted',
            text: (data as any).message,
            icon: 'success',
          });
          // ApiUtils.getProductOptionList(
          //   `?page=${pageValue}&page_size=${pageSize}`,
          // )
          //   .then(async (data: any) => {
          //     setProductItem(data);
          //   })
          //   .catch((error: any) => {
          //     toast.error(error.message);
          //   });
          void fetchData(
            pageValue,
            pageSize,
            sortColumn,
            sortDirection,
            search,
            selectedCategoryOption,
          );
        })
        .catch((error: any) => {
          toast.error(error.message);
        });
      setResetSearchFlag(true);
    }
  };

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

  const handleSelectCategoryChange = (selected: any): void => {
    setSelectedCategoryOption(selected);
    void fetchData(
      pageValue,
      pageSize,
      sortColumn,
      sortDirection,
      search,
      selected,
    );
    // setTotalRecords(defaultPage);
    // void fetchProductStockList({
    //   category_id: selected?.map((item: any) => String(item.value)),
    // });
    // if (
    //   selectedOptionItem != null ||
    //   selectedProductOption != null ||
    //   selectedOptionValue != null
    // ) {
    //   setSelectedProductOption([]);
    //   setSelectedOptionItem([]);
    //   setSelectedOptionValue([]);
    // }
  };
  // const truncateText = (text: string, maxLength: number): any => {
  //   return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  // };
  const handleSortByColumn = (column: string): void => {
    let newSortDirection = 'asc';

    if (column === sortColumn) {
      newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      newSortDirection = 'desc';
    }

    void fetchData(
      pageValue,
      pageSize,
      column,
      newSortDirection,
      search,
      selectedCategoryOption,
    );
    setSortDirection(newSortDirection);
    setSortColumn(column);

    // ApiUtils.getProductOptionList(
    //   `?page=${pageValue}&page_size=${pageSize}&sort_column=${column}&sort_direction=${newSortDirection}&search=${search}&category_id=${category_Id}`,
    // )
    //   .then((data: any): any => {
    //     setProductItem(data as ProductItemType);
    // setSortDirection(newSortDirection);
    //     setSortColumn(column);

    //     setTotalRecords((data as ProductItemType)?.data?.total);
    //   })
    //   .catch((error: any) => {
    //     toast.error(error.message);
    //   });
  };

  // Add a new function to handle normal search
  const handleSearch = (value: string): void => {
    setSearch(value);
    setPageValue(defaultPage);
  };

  // const handleUpdateStatus = async (): Promise<void> => {
  //   if (selectedProductIds.length === 0) {
  //     toast.error('Please select at least one product.');
  //     return;
  //   }

  //   // Check if any of the selected products are currently inactive
  //   const anyInactive = selectedProductIds.some(
  //     id =>
  //       productItem?.data?.data.some(
  //         (product: any) =>
  //           product.id === id &&
  //           product.status_id === variables.PRODUCT_ACTIVE_STATUS_ID,
  //       ),
  //   );

  //   // Determine the status to be sent in the payload
  //   const status = anyInactive
  //     ? variables.PRODUCT_INACTIVE_STATUS_ID
  //     : variables.PRODUCT_ACTIVE_STATUS_ID;

  //   const body = {
  //     product_id: selectedProductIds,
  //     status,
  //   };

  //   try {
  //     const response: any = await ApiUtils.updateProductStatus(body);
  //     if (response) {
  //       toast.success(response.message);
  //       // Reset selected product IDs and checkbox change state
  //       setSelectedProductIds([]);
  //       setIsCheckboxChanged(false);
  //       // Fetch updated product list
  //       ApiUtils.getProductList(
  //         `?page=${pageValue}&page_size=${pageSize}&sort_column=${sortColumn}&sort_direction=${sortDirection}&search=${search}&category_id=${
  //           category_Id ?? ''
  //         }`,
  //       )
  //         .then((data: any): any => {
  //           setProductItem(data as ProductItemType);
  //           setTotalRecords((data as ProductItemType)?.data?.total);
  //         })
  //         .catch((error: any) => {
  //           toast.error(error.message);
  //         });
  //     } else {
  //       toast.error(response.message);
  //     }
  //   } catch (error) {
  //     toast.error('Failed to update product status.');
  //     console.error('Error:', error);
  //   }
  // };

  const handleSelectAll = (): void => {
    if (allChecked) {
      setAllChecked(false);
    } else {
      setAllChecked(true);
    }
  };
  useEffect(() => {
    if (allChecked) {
      const allMainIds: any = productItem?.data?.data?.map(
        (item: {id: any}) => item.id,
      ); // Select all by their IDs

      setSelectedProductIds(allMainIds);
    } else {
      if (!Checked) {
        setSelectedProductIds([]);
      }
    }
  }, [allChecked, productItem]);

  const handleCheckboxChange = (Id: number): void => {
    // const updatedSelectedProductIds: any[] = [];
    let updatedSelectedMainIds: any[] = [];

    if (selectedProductIds.includes(Id)) {
      // Uncheck child, remove it from the array
      updatedSelectedMainIds = selectedProductIds.filter(id => id !== Id);
    } else {
      // Check child, add it to the array
      updatedSelectedMainIds = [...selectedProductIds, Id];
    }

    setSelectedProductIds(updatedSelectedMainIds);
  };

  useEffect(() => {
    dispatch(setProductIds(selectedProductIds));
    dispatch(setDeleteProductIds(selectedProductIds));
    if (selectedProductIds.length > 0) {
      setIsCheckboxChanged(true);
    } else {
      setIsCheckboxChanged(false);
    }
    const productlength: any = productItem?.data?.data?.length;

    if (selectedProductIds.length === productlength) {
      setAllChecked(true);
      seChecked(false);
    }
    if (selectedProductIds.length < productlength) {
      setAllChecked(false);
      seChecked(true);
    }
  }, [selectedProductIds]);

  const productIds = useSelector(
    (state: any) => state.statusChange.setProductids,
  );
  const productDeleteIds = useSelector(
    (state: any) => state.SelectedDeletes?.setDeleteProductids,
  );
  const setproductstatus = async (e: any, isdeleted = false): Promise<void> => {
    if (isdeleted) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Want to delete selected Products',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      });
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (result.isConfirmed) {
        dispatch(SelectedDeletes(e.target.value, productDeleteIds, 'product'));
        setisStatusChange(true);
      }
    } else {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Want to change status for selected Products',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      });
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (result.isConfirmed) {
        dispatch(changeStatus(e.target.value, productIds, 'product'));
        setisStatusChange(true);
      }
    }
  };
  useEffect(() => {
    setAllChecked(false);
    setSelectedProductIds([]);
    setisStatusChange(false);
  }, [isStatusChange]);
  const columns = useMemo(
    () => [
      {
        id: 'parentBox', // Give the column a unique ID
        Header: () => (
          <input
            className="parentCheckbox"
            type="checkbox"
            checked={allChecked} // This binds the checked state to `allChecked`
            value="0"
            onChange={() => {
              handleSelectAll();
            }}
          />
        ),
        disableFilters: true,
        filterable: true,
        accessor: '',
        Cell: (cell: any) => {
          return (
            <div className="d-inline-flex align-items-center gap-3">
              <input
                className={
                  selectedProductIds.includes(cell.row.original?.id)
                    ? 'checked-class'
                    : 'unchecked-class'
                }
                value={cell.row.original.id}
                type="checkbox"
                checked={selectedProductIds.includes(cell.row.original?.id)}
                onChange={() => {
                  handleCheckboxChange(cell.row.original?.id);
                }}
              />
            </div>
          );
        },
      },
      // {
      //   Header: 'Id',
      //   disableFilters: true,
      //   filterable: true,
      //   accessor: 'id',
      //   Cell: (cell: any) => {
      //     const isActive =
      //       cell.row.original.status_id === variables.PRODUCT_ACTIVE_STATUS_ID;
      //     return (
      //       <div className="d-inline-flex align-items-center gap-3">
      //         {category_Id !== null && (
      //           <CheckboxInput
      //             isActive={isActive}
      //             onChange={() => {
      //               handleCheckboxChange(cell.row.original.id);
      //             }}
      //           />
      //         )}

      //         {(cell.value as boolean) ? cell.value : '-'}
      //       </div>
      //     );
      //   },
      // },
      {
        Header: 'Name',
        disableFilters: true,
        filterable: true,
        accessor: 'name',
        Cell: (cell: any) => {
          return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
        },
      },
      // {
      //   Header: 'Category',
      //   disableFilters: true,
      //   filterable: true,
      //   accessor: 'parent_category',
      //   Cell: (cell: any) => {
      //     return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
      //   },
      // },
      {
        Header: 'Category',
        disableFilters: true,
        filterable: true,
        accessor: 'parent_category',
        Cell: (cell: any) => {
          // eslint-disable-next-line @typescript-eslint/naming-convention

          const categories: string[] = cell?.value
            ? cell?.value?.split(',').map((cat: string) => cat.trim())
            : [];
          const limitedCategories = categories?.slice(0, 15); // limit to 15

          return (
            <div>
              {limitedCategories?.map((item, index) => (
                <div key={index} style={{paddingLeft: `${index * 10}px`}}>
                  {index > 0 ? '└─ ' : ''}
                  {item}
                </div>
              ))}
            </div>
          );
        },
      },

      {
        Header: 'SKU',
        accessor: 'sku',
        Filter: false,
        Cell: (cell: any) => {
          return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
        },
      },
      {
        Header: 'Description',
        disableFilters: true,
        filterable: true,
        accessor: 'description',
        Cell: ({cell: {value}}: {cell: {value: string}}) => (
          <div dangerouslySetInnerHTML={{__html: value}} />
        ),
      },
      {
        Header: 'Product Image',
        disableFilters: true,
        filterable: true,
        accessor: '',
        Cell: ({cell}: any) => {
          const mediaUrl =
            cell.row.original?.product_option_value_image?.[0]?.image;

          return (
            <React.Fragment>
              <div className="text-center">
                {mediaUrl ? (
                  isImage(mediaUrl) ? (
                    <img
                      src={mediaUrl}
                      width={100}
                      height={100}
                      alt="Product image"
                      style={{objectFit: 'cover', borderRadius: '4px'}}
                      onError={({currentTarget}) => {
                        currentTarget.onerror = null;
                        currentTarget.style.display = 'none';
                        currentTarget.nextElementSibling?.classList.remove(
                          'd-none',
                        );
                      }}
                    />
                  ) : isVideo(mediaUrl) ? (
                    <div
                      style={{width: 100, height: 100, position: 'relative'}}>
                      <video
                        width={100}
                        height={100}
                        style={{objectFit: 'cover', borderRadius: '4px'}}
                        muted
                        onMouseOver={e => {
                          void (e.target as HTMLVideoElement).play();
                        }}
                        onMouseOut={e => {
                          (e.target as HTMLVideoElement).pause();
                        }}>
                        <source src={mediaUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          background: 'rgba(0,0,0,0.5)',
                          borderRadius: '50%',
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <i
                          className="ri-play-fill text-white"
                          style={{fontSize: '14px'}}></i>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 100,
                        height: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f8f9fa',
                        borderRadius: '4px',
                        border: '1px solid #dee2e6',
                      }}>
                      <i
                        className="ri-file-damage-line text-muted"
                        style={{fontSize: '24px'}}></i>
                    </div>
                  )
                ) : (
                  '-'
                )}
              </div>
            </React.Fragment>
          );
        },
      },

      {
        Header: 'Status',
        disableFilters: true,
        filterable: true,
        accessor: 'pov_status_id',
        Cell: (cellProps: any) => {
          const isActive =
            cellProps.value === variables.PRODUCT_OPTION_ACTIVE_STATUS_ID;

          const newStatusId = isActive
            ? variables.PRODUCT_OPTION_INACTIVE_STATUS_ID
            : variables.PRODUCT_OPTION_ACTIVE_STATUS_ID;

          const rowId = cellProps?.cell?.row?.original?.id;
          const switchId = `productStatusSwitch-${rowId ?? 'unknown'}`;

          return (
            <div className="form-check form-switch d-flex gap-1">
              <Form.Check
                type="checkbox"
                role="switch"
                id={switchId}
                className="form-switch-md"
                checked={isActive}
                onChange={() => {
                  if (rowId == null) return;
                  dispatch(changeStatus(newStatusId, [rowId], 'product'));
                  setisStatusChange(true);
                }}
              />
              <div>
                <Form.Label htmlFor={switchId}>
                  {isActive
                    ? variables.PRODUCT_ACTIVE_STATUS
                    : variables.PRODUCT_INACTIVE_STATUS}
                </Form.Label>
              </div>
            </div>
          );
        },
      },

      {
        Header: 'Action',
        disableFilters: true,
        filterable: true,
        Cell: (cellProps: any) => {
          return (
            <>
              <a
                className="text-dark"
                href={`/products-edit?productId=${cellProps.row.original.product_id}`}>
                <Button
                  role="add-Btn"
                  variant="success"
                  className="edit mx-2 text-light a"
                  style={{}}>
                  <i className="ri-pencil-fill align-bottom me-2  text-light" />
                  Edit
                </Button>
              </a>

              <Button
                role="add-Btn"
                variant="danger"
                className="remove-list mx-2  text-light"
                onClick={async () => {
                  await handleDeleteProduct(cellProps.row.original.id);
                }}>
                <i className="ri-delete-bin-fill align-bottom me-2 text-light" />
                Delete
              </Button>

              {/* <Dropdown className="text-start">
                <Dropdown.Toggle className="btn btn-ghost-primary btn-icon btn-sm arrow-none">
                  <i className="mdi mdi-dots-horizontal" />
                </Dropdown.Toggle>
                <Dropdown.Menu as="ul" className="dropdown-menu-end">
                  <li>
                    <Dropdown.Item
                      href={`/products-edit?productId=${cellProps.row.original.id}`}>
                      <i className="ri-pencil-fill align-bottom me-2 text-muted" />{' '}
                      Edit
                    </Dropdown.Item>
                  </li>
                  <li>
                    <Dropdown.Item
                      onClick={async () => {
                        await handleDeleteProduct(cellProps.row.original.id);
                      }}
                      className="remove-list">
                      <i className="ri-delete-bin-fill align-bottom me-2 text-muted" />
                      Delete
                    </Dropdown.Item>
                  </li>
                </Dropdown.Menu>
              </Dropdown> */}
            </>
          );
        },
      },
    ],
    [category_Id, allChecked, selectedProductIds, dispatch],
  );
  return (
    <div className="page-content">
      <Container fluid={true}>
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-5">
            <h4 className="mb-sm-0">Product Listing</h4>
            {/* {isCheckboxChanged && (
              <Button onClick={handleUpdateStatus} variant="success">
                Update Status
              </Button>
            )} */}
          </div>
        </div>
        <div id="couponsList">
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <TableContainer
                    columns={columns}
                    data={productItem?.data?.data ?? []}
                    iscustomPageSize={true}
                    handleNextPagination={handleNextPagination}
                    handlePrevPagination={handlePrevPagination}
                    pageValue={pageValue}
                    isBordered={true}
                    customPageSize={pageSize}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    currentData={currentData}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    className="custom-header-css"
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder="Search Products..."
                    buttonText="Add Products"
                    onSearch={handleSearch}
                    onClick={() => {
                      navigate('/products-create');
                    }}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    handleSortByColumn={handleSortByColumn}
                    isChangeStatus={isCheckboxChanged}
                    statusClickevent={setproductstatus}
                    resetSearchFlag={resetSearchFlag}
                    isDownload={true}
                    isDownloadAPI={ApiUtils.ExportProduct}
                    categoryFilter={true}
                    categoryListOption={categoryListOption}
                    selectedCategoryOption={selectedCategoryOption}
                    handleSelectCategoryChange={handleSelectCategoryChange}
                    setResetSearchFlag={setResetSearchFlag}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default ProductTable;
