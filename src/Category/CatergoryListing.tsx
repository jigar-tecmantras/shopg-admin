/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import React, {useState, useEffect} from 'react';
import {Card, Col, Container, Dropdown, Row, Form} from 'react-bootstrap';
import TableContainer from 'Common/TableContainer';
import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';
import CategoryForm from './CategoryForm';
import ModalContainer from 'Common/ModalContainer';
import {DOCUMENT_TITLE} from 'Common/constants/layout';
import Swal from 'sweetalert2';
import {ToasterMessage} from 'helpers/ToastHelper';
import {variables} from 'utils/constant';
import {useDispatch, useSelector} from 'react-redux';
import {setProductIds} from 'slices/statusChange/reducer';
import {changeStatus} from 'slices/thunk';
import {useNavigate} from 'react-router-dom';
import ImagePreviewModal from 'Common/imagePreviewModal';

interface Status {
  id: number;
  name: string;
  model: string;
}
interface CategoryItemType {
  data: {
    data: [];
    total: number;
  };
  display_header_count: number;
  display_home_count: number;

  message: string;
}

const Categories = (): JSX.Element => {
  document.title = DOCUMENT_TITLE.CATEGORIES;
  const [modalFlag, setModalFlag] = useState<boolean>(false);
  const [editCategory, setEditCategory] = useState<any>({});
  const [isEditCatergory, setIsEditCategory] = useState(false);
  const [iseAddCategory, setIsAddCategory] = useState(false);
  const [sortColumn, setSortColumn] = useState('id');

  const [search, setSearch] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [statusList, setStatusList] = useState<Status[]>([]);
  // console.log('🚀 ~ Categories ~ statusList:', statusList);

  const [sortDirection, setSortDirection] = useState('asc');
  const [categoryList, setCategoryList] = useState<CategoryItemType>();
  const defaultPage = 1;
  const [pageSize, setPageSize] = useState(10);
  const [pageValue, setPageValue] = useState(defaultPage);
  const [totalRecords, setTotalRecords] = useState(defaultPage);

  const currentData = Math.ceil(totalRecords / pageSize);
  const [allChecked, setAllChecked] = useState(false);
  // const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [isCheckboxChanged, setIsCheckboxChanged] = useState(false);
  const dispatch = useDispatch<any>();
  const [isStatusChange, setisStatusChange] = useState(false);

  const [Checked, seChecked] = useState(false);
  const [resetSearchFlag, setResetSearchFlag] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);

  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const nav = useNavigate();
  const handleProductClick = (cat: any): void => {
    // window.open(
    //   `${
    //     process.env.REACT_APP_FRONTEND_URL
    //   }/collections?layout=collection_left_sidebar&category=${encodeURIComponent(
    //     cat?.name,
    //   )}&category_id=${cat?.id}`,
    // );

    // window.open(`/products?category_id=${cat?.id}`);
    nav(`/products?category_id=${cat?.id}`);
  };

  useEffect(() => {
    setPageValue(defaultPage);
    setShouldFetch(!shouldFetch);
  }, [pageSize]);
  useEffect(() => {
    ApiUtils.getCategoryList(
      `?page=${pageValue}&page_size=${pageSize}&sort_column=${sortColumn}&sort_direction=${sortDirection}&search=${search}`,
    )
      .then(async (data: any): Promise<void> => {
        setCategoryList(data as CategoryItemType);
        setTotalRecords((data as CategoryItemType)?.data?.total);
      })
      .catch((error: any) => {
        toast.error(error.message);
      });
    void fetchStatus();
    setisStatusChange(false);
    setAllChecked(false);
  }, [
    pageValue,
    isEditCatergory,
    iseAddCategory,
    // pageSize,
    shouldFetch,
    search,
    isStatusChange,
  ]);

  // Add a new function to handle normal search
  const handleSearch = (value: string): void => {
    setSearch(value);
    setPageValue(defaultPage);
  };
  const handleDeleteCategory = async (id: any): Promise<void> => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `
      You won't be able to revert this!<br><br>
      Deleting this category will permanently remove all related products, options, and associated data.<br>
      This action cannot be undone.<br><br>
      Please proceed with caution.
    `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (result.isConfirmed) {
      ApiUtils.deleteCategory(id)

        // eslint-disable-next-line unused-imports/no-unused-vars
        .then(async data => {
          await Swal.fire({
            title: 'Deleted',
            text: (data as any).message,
            icon: 'success',
          });
          ApiUtils.getCategoryList(`?page=${pageValue}&page_size=${pageSize}`)
            .then(data => {
              setCategoryList(data as CategoryItemType);
            })
            .catch((error: any) => {
              toast.error(error.message);
            });
        })
        .catch((error: any) => {
          void Swal.fire({
            title: 'Error!',
            text: error?.response?.data?.message,
            icon: 'error',
          });
        });
      setResetSearchFlag(true);
    }
  };

  const handleHeaderCategory = async (v: any): Promise<void> => {
    const result = await Swal.fire({
      title:
        v.display_to_header > 0
          ? 'This Category already exist'
          : 'Are you sure?',
      text:
        v.display_to_header > 0
          ? 'You want to Remove this!'
          : 'You want to update this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText:
        v.display_to_header > 0 ? 'Yes, Remove it!' : 'Yes, update it!',
    });

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (result.isConfirmed) {
      const body = {
        id: v.id,
        display_to_header: !(v.display_to_header > 0),
      };
      ApiUtils.updateHeaderStatus(body)

        // eslint-disable-next-line unused-imports/no-unused-vars
        .then(async data => {
          await Swal.fire({
            title: 'Update!',
            text: (data as any).message,
            icon: 'success',
          });
          ApiUtils.getCategoryList(
            `?page=${pageValue}&page_size=${pageSize}&sort_column=${sortColumn}&sort_direction=${sortDirection}&search=${search}`,
          )
            .then(async (data: any): Promise<void> => {
              setCategoryList(data as CategoryItemType);

              setTotalRecords((data as CategoryItemType)?.data?.total);
            })
            .catch((error: any) => {
              toast.error(error.message);
            });
        })
        .catch((error: any) => {
          toast.error(error.response.data.message);
        });
    }
  };
  const handleHomeCategory = async (v: any): Promise<void> => {
    const result = await Swal.fire({
      title:
        v.display_to_home > 0 ? 'This Category already exist' : 'Are you sure?',
      text:
        v.display_to_home > 0
          ? 'You want to Remove this!'
          : 'You want to update this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText:
        v.display_to_home > 0 ? 'Yes, Remove it!' : 'Yes, update it!',
    });

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (result.isConfirmed) {
      const body = {
        id: v.id,
        display_to_home: !(v.display_to_home > 0),
      };
      ApiUtils.updateHeaderStatus(body)

        // eslint-disable-next-line unused-imports/no-unused-vars
        .then(async data => {
          await Swal.fire({
            title: 'Update',
            text: (data as any).message,
            icon: 'success',
          });
          ApiUtils.getCategoryList(
            `?page=${pageValue}&page_size=${pageSize}&sort_column=${sortColumn}&sort_direction=${sortDirection}&search=${search}`,
          )
            .then(async (data: any): Promise<void> => {
              setCategoryList(data as CategoryItemType);
              setTotalRecords((data as CategoryItemType)?.data?.total);
            })
            .catch((error: any) => {
              toast.error(error.message);
            });
        })
        .catch((error: any) => {
          toast.error(error.response.data.message);
        });
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

  const handleSortByColumn = (column: string): void => {
    let newSortDirection = 'asc';

    if (column === sortColumn) {
      newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      newSortDirection = 'desc';
    }
    ApiUtils.getCategoryList(
      `?page=${pageValue}&page_size=${pageSize}&sort_column=${column}&sort_direction=${newSortDirection}`,
    )
      .then(async (data: any): Promise<void> => {
        setCategoryList(data as CategoryItemType);
        setSortDirection(newSortDirection);
        setSortColumn(column);

        setTotalRecords((data as CategoryItemType)?.data?.total);
      })
      .catch((error: any) => {
        toast.error(error.message);
      });
  };
  const toggleCategoryStatus = async (
    id: number,
    statusId: number,
  ): Promise<void> => {
    // Function to toggle category status

    try {
      // Implement logic to toggle category status
      await ApiUtils.updateCategory({id, status_id: statusId});

      ApiUtils.getCategoryList(
        `?page=${pageValue}&page_size=${pageSize}&sort_column=${sortColumn}&sort_direction=${sortDirection}&search=${search}`,
      )
        .then(async (data: any): Promise<void> => {
          setCategoryList(data as CategoryItemType);
          setTotalRecords((data as CategoryItemType)?.data?.total);
        })
        .catch((error: any) => {
          toast.error(error.message);
        });
    } catch (error) {
      console.error('Error toggling category status:', error);
    }
  };

  const handleSelectAll = (): void => {
    if (allChecked) {
      setAllChecked(false);
    } else {
      setAllChecked(true);
    }
  };
  useEffect(() => {
    if (allChecked) {
      const allIds: any = categoryList?.data?.data?.map(
        (item: {id: any}) => item.id,
      ); // Select all by their IDs
      setSelectedProductIds(allIds);
    } else {
      if (!Checked) {
        setSelectedProductIds([]);
      }
    }
  }, [allChecked, categoryList]);

  const handleCheckboxChange = (productId: number): void => {
    let updatedSelectedProductIds: number[] = [];

    if (selectedProductIds.includes(productId)) {
      // Uncheck child, remove it from the array
      updatedSelectedProductIds = selectedProductIds.filter(
        id => id !== productId,
      );
    } else {
      // Check child, add it to the array
      updatedSelectedProductIds = [...selectedProductIds, productId];
    }

    setSelectedProductIds(updatedSelectedProductIds);
  };

  // useEffect(() => {
  //   dispatch(setProductIds(selectedProductIds));
  //   if (selectedProductIds.length > 0) {
  //     setIsCheckboxChanged(true);
  //   } else {
  //     setIsCheckboxChanged(false);
  //   }
  // }, [selectedProductIds]);
  useEffect(() => {
    dispatch(setProductIds(selectedProductIds));
    if (selectedProductIds.length > 0) {
      setIsCheckboxChanged(true);
    } else {
      setIsCheckboxChanged(false);
    }
    const categorylength: any = categoryList?.data?.data?.length;

    if (selectedProductIds.length === categorylength) {
      setAllChecked(true);
      seChecked(false);
    }
    if (selectedProductIds.length < categorylength) {
      setAllChecked(false);
      seChecked(true);
    }
  }, [selectedProductIds]);

  const productIds = useSelector(
    (state: any) => state.statusChange.setProductids,
  );
  const setproductstatus = async (e: any): Promise<void> => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Want to change status for selected Categories',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    });
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (result.isConfirmed) {
      dispatch(changeStatus(e.target.value, productIds, 'category'));
      setisStatusChange(true);
    }
  };
  useEffect(() => {
    setAllChecked(false);
    setSelectedProductIds([]);
  }, [isStatusChange]);
  const columns = [
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
                selectedProductIds.includes(cell.row.original.id)
                  ? 'checked-class'
                  : 'unchecked-class'
              }
              value={cell.row.original.id}
              type="checkbox"
              checked={selectedProductIds.includes(cell.row.original.id)}
              onChange={() => {
                handleCheckboxChange(cell.row.original.id);
              }}
            />
          </div>
        );
      },
    },
    {
      Header: 'Name',
      disableFilters: true,
      filterable: true,
      accessor: 'name',
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
      Header: 'Image',
      disableFilters: true,
      filterable: true,
      accessor: 'image', // Assuming 'image' is the property in your data for the image URL
      Cell: ({cell}: any) => {
        return (
          <React.Fragment>
            {(cell.row.original.image as boolean) ? (
              <img src={cell.value} width={60} height={60} alt="Player" 
              style={{
              cursor: 'pointer',
            }}
            onClick={() => {
              setPreviewImage(cell.value);
              setShowImagePreview(true);
            }}/>
            ) : (
              '-'
            )}
          </React.Fragment>
        );
      },
    },
    // {
    //   Header: 'Status',
    //   disableFilters: true,
    //   filterable: true,
    //   accessor: 'status_id',
    //   Cell: ({cell}: {cell: {value: number}}) => {
    //     const status = statusList.find(
    //       (status: any): any => cell.value === status?.id,
    //     );

    //     return (
    //       <span
    //         className={`badge text-uppercase ${
    //           status?.id === variables.CATEGORY_ACTIVE_STATUS_ID
    //             ? 'bg-success-subtle text-success'
    //             : 'bg-danger-subtle text-danger'
    //         }`}>
    //         {status?.id === variables.CATEGORY_ACTIVE_STATUS_ID
    //           ? variables.CATEGORY_ACTIVE_STATUS
    //           : variables.CATEGORY_INACTIVE_STATUS}
    //       </span>
    //     );
    //   },
    // },

    {
      Header: 'Status',
      disableFilters: true,
      filterable: true,
      accessor: 'status_id',
      Cell: (cellProps: any) => {
        const isActive =
          cellProps.value === variables.CATEGORY_ACTIVE_STATUS_ID;
        const newStatusId =
          cellProps.value === variables.CATEGORY_ACTIVE_STATUS_ID
            ? variables.CATEGORY_INACTIVE_STATUS_ID
            : variables.CATEGORY_ACTIVE_STATUS_ID;
        const toggleStatus = async (): Promise<void> => {
          await toggleCategoryStatus(
            cellProps?.cell?.row?.original?.id,
            newStatusId,
          );
        };

        return (
          <div className="form-check form-switch d-flex gap-1">
            <Form.Check
              type="checkbox"
              role="switch"
              id="flexSwitchCheckChecked"
              onChange={toggleStatus}
              checked={isActive}
              className="form-switch-md"
            />
            <div>
              <Form.Label htmlFor="flexSwitchCheckChecked">
                {isActive
                  ? variables.CATEGORY_ACTIVE_STATUS
                  : variables.CATEGORY_INACTIVE_STATUS}
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
      accessor: (cellProps: any) => {
        return (
          <Dropdown className="text-start">
            <Dropdown.Toggle className="btn btn-ghost-primary btn-icon btn-sm arrow-none">
              <i className="mdi mdi-dots-horizontal" />
            </Dropdown.Toggle>
            <Dropdown.Menu as="ul" className="dropdown-menu-end">
              {cellProps.display_to_home === 0 ? (
                <li>
                  <Dropdown.Item
                    onClick={async () => {
                      await handleHomeCategory(cellProps);
                    }}>
                    <i className="ri-home-2-line align-bottom me-2 text-muted" />
                    Add to Home
                  </Dropdown.Item>
                </li>
              ) : null}
              {cellProps.display_to_home === 1 ? (
                <li>
                  <Dropdown.Item
                    onClick={async () => {
                      await handleHomeCategory(cellProps);
                    }}>
                    <i className="ri-delete-bin-fill align-bottom me-2 text-muted" />
                    Remove from Home
                  </Dropdown.Item>
                </li>
              ) : null}
              {cellProps.display_to_header === 0 ? (
                <li>
                  <Dropdown.Item
                    onClick={async () => {
                      await handleHeaderCategory(cellProps);
                    }}>
                    <i className="ri-t-box-line align-bottom me-2 text-muted"></i>
                    Add to Header
                  </Dropdown.Item>
                </li>
              ) : null}
              {cellProps.display_to_header === 1 ? (
                <li>
                  <Dropdown.Item
                    onClick={async () => {
                      await handleHeaderCategory(cellProps);
                    }}>
                    <i className="ri-delete-bin-fill align-bottom me-2 text-muted" />
                    Remove from Header
                  </Dropdown.Item>
                </li>
              ) : null}
              <li>
                <Dropdown.Item
                  onClick={() => {
                    setEditCategory(cellProps);
                    modalToggle();
                  }}>
                  <i className="ri-pencil-fill align-bottom me-2 text-muted" />{' '}
                  Edit
                </Dropdown.Item>
              </li>
              <li>
                <Dropdown.Item
                  onClick={async () => {
                    await handleDeleteCategory(cellProps?.id);
                  }}
                  className="remove-list">
                  <i className="ri-delete-bin-fill align-bottom me-2 text-muted" />
                  Delete
                </Dropdown.Item>
              </li>
            </Dropdown.Menu>
          </Dropdown>
        );
      },
    },
  ];

  function modalToggle(): void {
    setModalFlag(!modalFlag);
  }

  const fetchStatus = async (): Promise<void> => {
    try {
      const response: any = await ApiUtils.getStatus(`type=category`);
      setStatusList(response.data);
    } catch (err: any) {
      ToasterMessage('error', err.message);
    }
  };

  return (
    <div className="page-content">
      <Container fluid={true}>
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-sm-0">CATEGORY</h4>
        </div>
        <div id="couponsList">
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <TableContainer
                    columns={columns ?? []}
                    data={categoryList?.data?.data ?? []}
                    iscustomPageSize={false}
                    handleNextPagination={handleNextPagination}
                    handlePrevPagination={handlePrevPagination}
                    pageValue={pageValue}
                    isBordered={true}
                    customPageSize={pageSize}
                    isGlobalFilter={true}
                    pageSize={pageSize}
                    currentData={currentData}
                    setPageSize={setPageSize}
                    isAddOptions={true}
                    className="custom-header-css"
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder="Search Category..."
                    buttonText="Add Category"
                    onClick={() => {
                      setEditCategory({});
                      modalToggle();
                    }}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    handleSortByColumn={handleSortByColumn}
                    onSearch={handleSearch}
                    isChangeStatus={isCheckboxChanged}
                    isCategory={true}
                    statusClickevent={setproductstatus}
                    resetSearchFlag={resetSearchFlag}
                    setResetSearchFlag={setResetSearchFlag}
                    isDownload={true}
                    isDownloadAPI={ApiUtils.ExportCategory}
                  />
                  <div className="noresult" style={{display: 'none'}}>
                    <div className="text-center">
                      <h5 className="mt-2">Sorry! No Result Found</h5>
                      <p className="text-muted mb-0">
                        We've searched more than 150+ Orders We did not find any
                        orders for you search.
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        <ModalContainer
          showModal={modalFlag}
          handleClose={modalToggle}
          modalTitle={
            editCategory.id !== undefined ? 'Edit Category' : 'Add Category'
          }
          modalBody={
            <>
              <CategoryForm
                handleClose={modalToggle}
                editCategory={editCategory}
                setIsEditCategory={setIsEditCategory}
                setIsAddCategory={setIsAddCategory}
              />
            </>
          }
        />
      </Container>
      <ImagePreviewModal
        show={showImagePreview}
        handleClose={() => {
          setShowImagePreview(false);
          setPreviewImage('');
        }}
        image={previewImage}
      />
    </div>
  );
};

export default Categories;
