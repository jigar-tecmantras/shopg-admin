import ModalContainer from 'Common/ModalContainer';
import TableContainer from 'Common/TableContainer';
import {DOCUMENT_TITLE} from 'Common/constants/layout';
import ApiUtils from 'api/ApiUtils';
import React, {useEffect, useState} from 'react';
import {Card, Col, Container, Dropdown} from 'react-bootstrap';
import {toast} from 'react-toastify';
import Swal from 'sweetalert2';
import UserEditModal from './userEditModal';

const UserList = (): JSX.Element => {
  document.title = DOCUMENT_TITLE.USER_LIST;
  const defaultPage = 1;
  const [pageValue, setPageValue] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(10);

  const [sortColumn, setSortColumn] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [totalRecords, setTotalRecords] = useState<number>(defaultPage);
  const [customerList, setCustomerList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [editId, setEditId] = useState();
  const [showModal, setShowModal] = useState(false);
  const currentData = Math.ceil(totalRecords / pageSize);
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

  const handleSortByColumn = async (column: string): Promise<void> => {
    try {
      let newSortDirection = 'asc';

      if (column === sortColumn) {
        newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        newSortDirection = 'desc';
      }

      const resp: any = await ApiUtils.getCustomerList(
        `page=${pageValue}&page_size=${pageSize}&search=${searchValue}&sort_column=${column}&sort_direction=${newSortDirection}`,
      );
      setCustomerList(resp?.data?.data);
      setTotalRecords(resp?.data?.total);
      setSortColumn(column);
      setSortDirection(newSortDirection);
    } catch (resp: any) {
      toast.error(resp?.message);
    }
  };

  const handleToggleActivation = async (
    userId: number,
    isActive: boolean,
  ): Promise<void> => {
    const actionVerb = isActive ? 'deactivate' : 'activate';
    const title = `Are you sure?`;
    const text = `You are about to ${actionVerb} this user.`;
    const confirmButtonText = `Yes, ${actionVerb} it!`;

    try {
      const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText,
      });

      if (result.isConfirmed) {
        const formdata = new FormData();
        formdata.append('id', userId.toString()); // Convert userId to string if it's not already
        formdata.append('status_id', isActive ? '2' : '1');

        try {
          await ApiUtils.updateCustomerDetails(formdata);

          void Swal.fire(
            'Deactivated!',
            'The user has been deactivated.',
            'success',
          );

          void fetchCustomerLis();

          await Swal.fire(
            `${actionVerb.charAt(0).toUpperCase() + actionVerb.slice(1)}d!`,
            `The user has been ${actionVerb}d.`,
            'success',
          );
        } catch (error: any) {
          toast.error(error);
        }
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleSearch = (value: string): any => {
    setSearchValue(value);
  };

  const fetchCustomerLis = async (): Promise<void> => {
    try {
      const resp: any = await ApiUtils.getCustomerList(
        `page=${pageValue}&page_size=${pageSize}&search=${searchValue}&sort_column=${sortColumn}&sort_direction=${sortDirection}`,
      );
      setCustomerList(resp?.data?.data);
      setTotalRecords(resp?.data?.total);
    } catch (resp: any) {
      toast.error(resp?.message);
    }
  };

  useEffect(() => {
    void fetchCustomerLis();
  }, [pageValue, shouldFetch, searchValue]);

  const handleEdit = (id: any): any => {
    setEditId(id);
    setShowModal(true);
  };

  // const handleDeleteUser = (id: any): any => {
  //   void Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!',
  //   }).then(result => {
  //     if (result.isConfirmed) {
  //       void ApiUtils.deleteCustomer({id})
  //         .then((res: any) => {
  //           void Swal.fire({
  //             title: 'Deleted!',
  //             text: res?.message,
  //             icon: 'success',
  //           });
  //           void fetchCustomerLis();
  //         })
  //         .catch((err: any) => {
  //           toast.error(err?.message);
  //         });
  //     }
  //   });
  // };

  const handleCloseModal = (): any => {
    setShowModal(false);
  };

  const columns = [

    {
      Header: ' Name',
      disableFilters: true,
      filterable: true,
      accessor: 'first_name',
      Cell: (cell: any) => {
        return (
          <div>
            {(cell.row.original.user_name as boolean)
              ? cell.row.original.user_name
              : '-'}
          </div>
        );
      },
    },
    {
      Header: ' Email',
      disableFilters: true,
      filterable: true,
      accessor: 'email',
      Cell: (cell: any) => {
        return (
          <div>
            {(cell.row.original.user_email as boolean)
              ? cell.row.original.user_email
              : '-'}
          </div>
        );
      },
    },
    {
      Header: 'Phone Number',
      disableFilters: true,
      filterable: true,
      accessor: 'phone',
      Cell: (cell: any) => {
        return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
      },
    },

    {
      Header: 'Total Orders',
      disableFilters: true,
      filterable: true,
      accessor: 'order_count',
      Cell: (cell: any) => {
        return (
          <div>
            {(cell.row.original.orders as boolean)
              ? cell.row.original.orders
              : '-'}
          </div>
        );
      },
    },

    {
      Header: 'Status',
      disableFilters: true,
      filterable: false,
      accessor: 'status_id',
      Cell: (row: any) => {
        const user = row.row.original;

        return (
          <>
            {user.isActive ? (
              <span className="badge bg-success">Active</span>
            ) : (
              <span className="badge bg-danger">Inactive</span>
            )}
          </>
        );
      },
    },

    {
      Header: 'Action',
      disableFilters: true,
      filterable: false,
      Cell: (cellProps: any) => {
        return (
          <Dropdown className="text-start">
            <Dropdown.Toggle className="btn btn-soft-secondary btn-sm btn-icon dropdown arrow-none">
              <i className="mdi mdi-dots-horizontal" />
            </Dropdown.Toggle>
            <Dropdown.Menu as="ul" className="dropdown-menu-end">
              <li>
                <Dropdown.Item
                  onClick={() => {
                    handleEdit(cellProps?.row?.original);
                  }}
                  className="remove-list">
                  <i className="ri-pencil-fill align-bottom me-2 text-muted" />
                  Edit
                </Dropdown.Item>
              </li>
              <li>
                <Dropdown.Item
                  onClick={async () => {
                    await handleToggleActivation(
                      cellProps?.row?.original?.id,
                      cellProps?.row?.original?.isActive,
                    );
                  }}
                  className="remove-list">
                  {cellProps?.row?.original.isActive ? (
                    <i className="ri-toggle-line align-bottom me-2 text-danger" />
                  ) : (
                    <i className="ri-toggle-fill align-bottom me-2 text-success" />
                  )}

                  {cellProps?.row?.original.isActive
                    ? 'Deactivate'
                    : 'Activate'}
                </Dropdown.Item>
              </li>
            </Dropdown.Menu>
          </Dropdown>
        );
      },
    },
  ];

  const tableDatas = customerList?.map((data: any) => {
    return {
      id: data?.id,
      user_name: `${data?.first_name} ${data?.last_name}`,
      user_email: data.email,
      phone: data?.phone,
      orders: data?.order_count,
      isActive: data?.status_id === 1,
    };
  });

  return (
    <div className="page-content">
      <Container fluid>
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-sm-0">USER LIST</h4>
        </div>
        <Col xxl={12}>
          <Card>
            <Card.Body className="position-relative">
              <TableContainer
                columns={columns ?? []}
                data={tableDatas}
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
                className="custom-header-css"
                tableClass="table-centered align-middle table-nowrap mb-0"
                theadClass="text-muted table-light"
                SearchPlaceholder="Search User..."
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                handleSortByColumn={handleSortByColumn}
                onSearch={handleSearch}
              />
            </Card.Body>
          </Card>
        </Col>
        <ModalContainer
          showModal={showModal}
          handleClose={handleCloseModal}
          modalTitle="Edit User Details"
          modalBody={
            <UserEditModal
              userData={editId}
              handleClose={handleCloseModal}
              getUserList={fetchCustomerLis}
            />
          }
        />
      </Container>
    </div>
  );
};

export default UserList;
