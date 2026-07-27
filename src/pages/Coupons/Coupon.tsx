import TableContainer from 'Common/TableContainer';
import React, {useEffect, useMemo, useState} from 'react';
import {Card, Col, Dropdown, Row} from 'react-bootstrap';
import AddCoupons from './AddCoupons';
import ModalContainer from 'Common/ModalContainer';
import {DOCUMENT_TITLE} from 'Common/constants/layout';
import Swal from 'sweetalert2';
import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';
import {ToasterMessage} from 'helpers/ToastHelper';
import {variables} from 'utils/constant';

interface Status {
  id: number;
  name: string;
  model: string;
}

const Coupon = (): JSX.Element => {
  document.title = DOCUMENT_TITLE.COUPONS;
  const [modalFlag, setModalFlag] = useState(false);
  const [editData, setEditData] = useState(undefined);
  const defaultPage = 1;

  const [pageValue, setPageValue] = useState(defaultPage);
  const [sortColumn, setSortColumn] = useState('id');

  const [pageSize, setPageSize] = useState(10);

  const [sortDirection, setSortDirection] = useState('asc');

  const [totalRecords, setTotalRecords] = useState(defaultPage);
  const [search, setSearch] = useState<string>('');
  const [resetSearchFlag, setResetSearchFlag] = useState(false);
  const [statusList, setStatusList] = useState<Status[]>([]);

  const currentData = Math.ceil(totalRecords / pageSize);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [couponList, setCouponList] = useState<any>();

  useEffect(() => {
    setPageValue(defaultPage);
    setShouldFetch(!shouldFetch);
  }, [pageSize]);
  async function getListPolicy(): Promise<void> {
    try {
      const response: any = await ApiUtils.couponList(
        `page_size=${pageSize}&page=${pageValue}&sort_column=${sortColumn}&sort_direction=${sortDirection}&search=${search}`,
      );
      setCouponList(response.data.data ?? []);
      setTotalRecords(response.data.total);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    void getListPolicy();
    void fetchStatus();
  }, [pageValue, shouldFetch, search]);
  // Add a new function to handle normal search
  const handleSearch = (value: string): void => {
    setSearch(value);
  };
  function modalToggle(): void {
    if (modalFlag) {
      setEditData(undefined);
    }
    setModalFlag(!modalFlag);
  }

  const handleEdit = (data: any): any => {
    setEditData(data);
    modalToggle();
  };

  const handleClose = (): any => {
    setModalFlag(false);
    setEditData(undefined);
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
  const handleDelete = (data: any): any => {
    void Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async result => {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (result.isConfirmed) {
        await ApiUtils.deleteCoupon(`id=${data.id}`)
          .then((res: any) => {
            void getListPolicy();
            void Swal.fire({
              title: 'Deleted',
              text: res?.message,
              icon: 'success',
            });
            setResetSearchFlag(true);
            setSearch('');
          })
          .catch(err => {
            void Swal.fire({
              title: 'Error!',
              text: err?.data?.message,
              icon: 'error',
            });
          });
      }
    });
  };
  const handleSortByColumn = async (column: string): Promise<void> => {
    try {
      let newSortDirection = 'asc';

      if (column === sortColumn) {
        newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        newSortDirection = 'desc';
      }
      const response: any = await ApiUtils.couponList(
        `page_size=${pageSize}&page=${pageValue}&sort_column=${column}&sort_direction=${newSortDirection}&search=${search}`,
      );
      setCouponList(response.data.data ?? []);
      setSortDirection(newSortDirection);
      setSortColumn(column);

      setTotalRecords(response.data.total);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const columns = useMemo(
    () => [
      {
        Header: 'Coupon Code',
        disableFilters: false,
        filterable: false,
        accessor: 'code',
      },
      {
        Header: 'Coupon Value',
        disableFilters: true,
        filterable: false,
        accessor: 'value',
      },
      {
        Header: 'Start Date',
        disableFilters: true,
        filterable: false,
        accessor: 'start_date',
      },
      {
        Header: 'End Date',
        disableFilters: true,
        filterable: false,
        accessor: 'end_date',
      },
      {
        Header: 'Status',
        accessor: 'status',
        disableFilters: true,
        filterable: false,
        Cell: ({cell}: {cell: {value: number}}) => {
          const status = statusList.find(
            (status: any): any => cell.value === status?.id,
          );

          return (
            <span
              className={`badge text-uppercase ${
                status?.id === variables.COUPON_ACTIVE_STATUS_ID
                  ? 'bg-success-subtle text-success'
                  : 'bg-danger-subtle text-danger'
              }`}>
              {status?.id === variables.COUPON_ACTIVE_STATUS_ID
                ? variables.COUPON_ACTIVE_STATUS
                : variables.COUPON_INACTIVE_STATUS}
            </span>
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
                    onClick={() => handleEdit(cellProps.row.original)}
                    className="remove-list">
                    <i className="ri-pencil-fill align-bottom me-2 text-muted" />
                    Edit
                  </Dropdown.Item>
                </li>
                <li>
                  <Dropdown.Item
                    onClick={() => handleDelete(cellProps.row.original)}
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
    ],
    [statusList],
  );

  const fetchStatus = async (): Promise<void> => {
    try {
      const response: any = await ApiUtils.getStatus(`type=coupon_code`);
      setStatusList(response.data);
    } catch (err: any) {
      ToasterMessage('error', err.message);
    }
  };

  return (
    <Col xxl={12} data-testid="coupons">
      <Row>
        <Col xxl={12}>
          <Card>
            <Card.Body>
              <TableContainer
                columns={columns}
                data={couponList ?? []}
                handleNextPagination={handleNextPagination}
                handlePrevPagination={handlePrevPagination}
                pageValue={pageValue}
                iscustomPageSize={false}
                isBordered={true}
                customPageSize={pageSize}
                isGlobalFilter={true}
                isAddOptions={true}
                pageSize={pageSize}
                currentData={currentData}
                setPageSize={setPageSize}
                className="custom-header-css"
                tableClass="table-centered align-middle table-nowrap mb-0"
                theadClass="text-muted table-light"
                SearchPlaceholder="Search Coupons..."
                buttonText="Add Coupon"
                onClick={() => {
                  modalToggle();
                }}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                handleSortByColumn={handleSortByColumn}
                onSearch={handleSearch}
                resetSearchFlag={resetSearchFlag}
                setResetSearchFlag={setResetSearchFlag}
                isDownload={true}
                isDownloadAPI={ApiUtils.ExportCoupon}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ModalContainer
        showModal={modalFlag}
        handleClose={modalToggle}
        modalTitle={editData !== undefined ? 'Edit Coupon' : 'Add Coupon'}
        modalBody={
          <AddCoupons
            editData={editData}
            handleClose={handleClose}
            getListPolicy={getListPolicy}
          />
        }
      />
    </Col>
  );
};

export default Coupon;
