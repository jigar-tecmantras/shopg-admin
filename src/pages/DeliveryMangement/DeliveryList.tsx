/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import ModalContainer from 'Common/ModalContainer';
import TableContainer from 'Common/TableContainer';
import {DELIVERY_PERSON_STATUS, DOCUMENT_TITLE} from 'Common/constants/layout';
import React, {useEffect, useState} from 'react';
import {Card, Col, Container, Dropdown} from 'react-bootstrap';
import AddEditDeliveryModal from './AddEditDelivery';
import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';
import Swal from 'sweetalert2';
interface editData {
  name: string;
  email: string;
  phone: number;
}
const DeliveryList = (): JSX.Element => {
  document.title = DOCUMENT_TITLE.delivery_LIST;
  const defaultPage = 1;
  const [pageValue, setPageValue] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState('id');

  const [sortDirection, setSortDirection] = useState('asc');
  const [deliveryPersonList, setDeliveryPersonList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [resetSearchFlag, setResetSearchFlag] = useState(false);
  const [totalRecords, setTotalRecords] = useState(defaultPage);

  const currentData = Math.ceil(totalRecords / pageSize);

  const [editId, setEditId] = useState<editData>();
  const [showModal, setShowModal] = useState(false);

  const handleSortByColumn = async (column: string): Promise<void> => {
    try {
      let newSortDirection = 'asc';

      if (column === sortColumn) {
        newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        newSortDirection = 'desc';
      }

      const resp: any = await ApiUtils.getDeliveryPerson(
        `page=${pageValue}&page_size=${pageSize}&sort_column=${column}&sort_derection=${newSortDirection}&serarch=${searchValue}`,
      );

      setSortDirection(newSortDirection);
      setDeliveryPersonList(resp?.data?.data);
      setTotalRecords(resp?.data?.total);
      setSortColumn(column);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const modalToggle = (): void => {
    setShowModal(prev => !prev);
  };
  const handleSearch = (value: string): any => {
    setSearchValue(value);
  };

  const fetchCustomerList = async (): Promise<void> => {
    try {
      const resp = await ApiUtils.getDeliveryPerson(
        `page=${pageValue}&page_size=${pageSize}&sort_column=${sortColumn}&sort_derection=${sortDirection}&serarch=${searchValue}`,
      );

      setDeliveryPersonList((resp as any)?.data?.data);
      setTotalRecords((resp as any)?.data?.total);
    } catch (err) {
      toast.error((err as any)?.response?.data?.message);
    }
  };

  useEffect(() => {
    void fetchCustomerList();
  }, [pageSize, searchValue, pageValue]);

  const handleEdit = (id: any): any => {
    setEditId(id);
    setShowModal(true);
  };

  const handleCloseModal = (): any => {
    setShowModal(prev => !prev);
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

  const handleToggleActivation = async (
    userId: number,
    isActive: any,
  ): Promise<void> => {
    const actionVerb = isActive === 1 ? 'deactivate' : 'activate';
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
        formdata.append('id', userId.toString());
        formdata.append(
          'status_id',
          isActive === DELIVERY_PERSON_STATUS.ACTIVE
            ? DELIVERY_PERSON_STATUS.INACTIVE.toString()
            : DELIVERY_PERSON_STATUS.ACTIVE.toString(),
        );

        try {
          await ApiUtils.updateDeliveryPerson(formdata);

          void Swal.fire(
            'Deactivated!',
            'The user has been deactivated.',
            'success',
          );

          void fetchCustomerList();

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

  const handleDelete = (id: string): any => {
    void Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async result => {
      if (result.isConfirmed) {
        // Call your delete API here
        await ApiUtils.deleteDeliveryPerson(`id=${id}`)
          .then((res: any) => {
            void Swal.fire('Deleted!', res?.message, 'success');
            void fetchCustomerList();
            setResetSearchFlag(true);
            setSearchValue('');
          })
          .catch((err: any) => {
            toast.error(err?.response?.data?.message);
          });
      }
    });
  };

  const columns = [
    {
      Header: 'Name',
      disableFilters: true,
      filterable: true,
      accessor: 'first_name',
      Cell: (cellProps: any) => {
        return (
          <div className="d-flex align-items-center">
            <div className="flex-shrink-0 me-2">
              <img
                src={cellProps.row.original.image}
                alt="name"
                className="avatar-xxs rounded-circle"
              />
            </div>
            <div className="flex-grow-1">{cellProps.row.original.name}</div>
          </div>
        );
      },
    },
    {
      Header: ' Email',
      disableFilters: true,
      filterable: true,
      accessor: 'email',
    },
    {
      Header: 'Phone Number',
      disableFilters: true,
      filterable: true,
      accessor: 'phone',
    },

    {
      Header: 'Status',
      disableFilters: true,
      filterable: true,
      accessor: 'status_id',
      Cell: (cell: any) => {
        const isActive =
          cell.row.original.status === DELIVERY_PERSON_STATUS.ACTIVE;
        return (
          <span
            className={`badge text-uppercase ${
              isActive
                ? 'bg-success-subtle text-success'
                : 'bg-danger-subtle text-danger'
            }`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
    },

    {
      Header: 'Action',
      disableFilters: true,
      filterable: false,
      Cell: (cellProps: any) => {
        // console.log('🚀 ~ DeliveryList ~ cellProps:', cellProps);

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
                      cellProps?.row?.original?.status,
                    );
                  }}
                  className="remove-list">
                  {cellProps?.row?.original.status ===
                  DELIVERY_PERSON_STATUS.ACTIVE ? (
                    <i className="ri-toggle-line align-bottom me-2 text-danger" />
                  ) : (
                    <i className="ri-toggle-fill align-bottom me-2 text-success" />
                  )}

                  {cellProps?.row?.original.status ===
                  DELIVERY_PERSON_STATUS.ACTIVE
                    ? 'Inactive'
                    : 'Activate'}
                </Dropdown.Item>
              </li>
              <li>
                <Dropdown.Item
                  onClick={() => {
                    handleDelete(cellProps?.row?.original.id);
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

  const tableData = deliveryPersonList?.map((data: any) => {
    return {
      name: `${data?.first_name} ${data?.last_name}`,
      email: data?.email,
      phone: data?.phone,
      status: data?.status_id,
      image: data?.image,
      id: data?.id,
    };
  });

  return (
    <div className="page-content">
      <Container fluid>
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-sm-0">DELIVERY LIST</h4>
        </div>
        <Col xxl={12}>
          <Card>
            <Card.Body className="position-relative">
              <TableContainer
                columns={columns}
                data={tableData ?? []}
                handleNextPagination={handleNextPagination}
                handlePrevPagination={handlePrevPagination}
                isGlobalFilter={true}
                isAddOptions={true}
                buttonText="Add Delivery"
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
                SearchPlaceholder="Search delivery.."
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                handleSortByColumn={handleSortByColumn}
                onSearch={handleSearch}
                onClick={() => {
                  modalToggle();
                  setEditId(undefined);
                }}
                resetSearchFlag={resetSearchFlag}
                setResetSearchFlag={setResetSearchFlag}
              />
            </Card.Body>
          </Card>
        </Col>
        <ModalContainer
          showModal={showModal}
          handleClose={handleCloseModal}
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          modalTitle={editId ? 'Edit Delivery Details' : 'Add Delivery Details'}
          modalBody={
            <AddEditDeliveryModal
              deliveryData={editId}
              handleClose={handleCloseModal}
              fetchData={fetchCustomerList}
            />
          }
        />
      </Container>
    </div>
  );
};

export default DeliveryList;
