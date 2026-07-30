import TableContainer from 'Common/TableContainer';
import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {Card, Col, Dropdown, Row} from 'react-bootstrap';
import AddData from './AddData';
import ModalContainer from 'Common/ModalContainer';
import {DOCUMENT_TITLE} from 'Common/constants/layout';
import Swal from 'sweetalert2';
import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';
import {debounce} from 'lodash';

interface WhatsAppAccount {
  id: string;
  title: string;
  message: string;
  number: number;
  status: number;
  url: string;
}

const Whatsapp = (): JSX.Element => {
  document.title = DOCUMENT_TITLE.WHATSAPP;
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

  const currentData = Math.ceil(totalRecords / pageSize);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [whatsappList, setWhatsappList] = useState<WhatsAppAccount[]>([]);

  useEffect(() => {
    setPageValue(defaultPage);
    setShouldFetch(!shouldFetch);
  }, [pageSize]);
  async function getWhatsappList(): Promise<void> {
    try {
      const response: any = await ApiUtils.whatsappList(
        `page_size=${pageSize}&page=${pageValue}&sort_column=${sortColumn}&sort_direction=${sortDirection}&search=${search}`,
      );
      setWhatsappList(response.data.data ?? []);
      setTotalRecords(response.data.total);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    void getWhatsappList();
  }, [pageValue, shouldFetch, search]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 500),
    [],
  );

  const handleSearch = (value: string): void => {
    debouncedSearch(value);
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
      if (result.isConfirmed) {
        await ApiUtils.deleteWhatsapp(`id=${data.id}`)
          .then((res: any) => {
            void getWhatsappList();
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
      const response: any = await ApiUtils.whatsappList(
        `page_size=${pageSize}&page=${pageValue}&sort_column=${column}&sort_direction=${newSortDirection}&search=${search}`,
      );
      setWhatsappList(response.data.data ?? []);
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
        Header: 'Title',
        disableFilters: false,
        filterable: false,
        accessor: 'title',
      },
      
      {
        Header: 'Number',
        disableFilters: true,
        filterable: false,
        accessor: 'number',
      },
      {
        Header: 'Message',
        disableFilters: true,
        filterable: false,
        accessor: 'message',
        Cell: ({cell}: {cell: {value: string}}) => {
          return (
            <div
              style={{
                maxHeight: '80px',
                overflowY: 'auto',
                wordBreak: 'break-word',
              }}>
              {cell.value}
            </div>
          );
        },
      },
      {
        Header: 'URL',
        disableFilters: true,
        filterable: false,
        accessor: 'url',
        Cell: ({cell}: {cell: {value: string}}) => {
          return (
            <a href={cell.value} target="_blank" rel="noopener noreferrer">
              <i className="ri-external-link-line" /> Open
            </a>
          );
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
        disableFilters: true,
        filterable: false,
        Cell: ({cell}: {cell: {value: number}}) => {
          return (
            <span
              className={`badge text-uppercase ${
                cell.value === 1
                  ? 'bg-success-subtle text-success'
                  : 'bg-danger-subtle text-danger'
              }`}>
              {cell.value === 1 ? 'Active' : 'Inactive'}
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
    [],
  );

  return (
    <Col xxl={12} data-testid="coupons">
      <Row>
        <Col xxl={12}>
          <Card>
            <Card.Body>
              <TableContainer
                columns={columns}
                data={whatsappList ?? []}
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
                SearchPlaceholder="Search WhatsApp Accounts..."
                buttonText="Add WhatsApp Account"
                onClick={() => {
                  modalToggle();
                }}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                handleSortByColumn={handleSortByColumn}
                onSearch={handleSearch}
                resetSearchFlag={resetSearchFlag}
                setResetSearchFlag={setResetSearchFlag}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ModalContainer
        showModal={modalFlag}
        handleClose={modalToggle}
        modalTitle={editData !== undefined ? 'Edit WhatsApp Account' : 'Add WhatsApp Account'}
        modalBody={
          <AddData
            editData={editData}
            handleClose={handleClose}
            getListPolicy={getWhatsappList}
          />
        }
      />
    </Col>
  );
};

export default Whatsapp;
