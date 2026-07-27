import React, {useMemo, useEffect, useState} from 'react';
import {Card, Col, Container, Dropdown, Row} from 'react-bootstrap';
import TableContainer from 'Common/TableContainer';
import {useNavigate} from 'react-router-dom';
import ApiUtils from 'api/ApiUtils';
import {DOCUMENT_TITLE} from 'Common/constants/layout';
import Swal from 'sweetalert2';
import {ToasterMessage} from 'helpers/ToastHelper';
import {variables} from 'utils/constant';

import {toast} from 'react-toastify';

interface Status {
  id: number;
  name: string;
  model: string;
}
const OptionsList = (): JSX.Element => {
  document.title = DOCUMENT_TITLE.OPTION_LISTING;
  const [optionsData, setOptionsData] = useState([]);
  const navigate = useNavigate();
  const defaultPage = 1;
  const [pageSize, setPageSize] = useState(10);
  const [pageValue, setPageValue] = useState(defaultPage);
  const [totalRecords, setTotalRecords] = useState(defaultPage);
  const [sortColumn, setSortColumn] = useState('id');
  const [shouldFetch, setShouldFetch] = useState(false);

  const [search, setSearch] = useState<string>('');
  const [statusList, setStatusList] = useState<Status[]>([]);
  const [resetSearchFlag, setResetSearchFlag] = useState(false);
  const [sortDirection, setSortDirection] = useState('asc');
  const currentData = Math.ceil(totalRecords / pageSize);
  const navigatate = useNavigate();

  const columns = useMemo(
    () => [
      // {
      //   Header: 'Type',
      //   accessor: 'type',
      //   disableFilters: true,
      //   filterable: true,
      //   Cell: (cell: any) => {
      //     return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
      //   },
      // },
      {
        Header: 'Name',
        accessor: 'name',
        disableFilters: true,
        filterable: true,
        Cell: (cell: any) => {
          return <div>{(cell.value as boolean) ? cell.value : '-'}</div>;
        },
      },
      {
        Header: 'Status',
        disableFilters: true,
        filterable: true,
        accessor: 'status_id', // Assuming 'status_id' is the property in your data for the status ID

        Cell: ({cell}: {cell: {value: number}}) => {
          const status = statusList.find(
            (status: any): any => cell.value === status?.id,
          );

          return (
            <span
              className={`badge text-uppercase ${
                status?.id === variables.OPTION_ACTIVE_STATUS_ID ||
                status?.id === variables.OPTION_APPROVE_STATUS_ID
                  ? 'bg-success-subtle text-success'
                  : 'bg-danger-subtle text-danger'
              }`}>
              {status?.name}
            </span>
          );
        },
      },
      {
        Header: 'Action',
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: {id: string}) => {
          return (
            <Dropdown className="text-start">
              <Dropdown.Toggle className="btn btn-ghost-primary btn-icon btn-sm arrow-none">
                <i className="mdi mdi-dots-horizontal" />
              </Dropdown.Toggle>
              <Dropdown.Menu as="ul" className="dropdown-menu-end">
                <li>
                  <Dropdown.Item
                    onClick={() => {
                      navigatate(`/options-form?optionId=${cellProps?.id}`);
                    }}>
                    <i className="ri-pencil-fill align-bottom me-2 text-muted" />{' '}
                    Edit
                  </Dropdown.Item>
                </li>
                <li>
                  <Dropdown.Item
                    onClick={async () => {
                      await handleDeleteOption(cellProps?.id);
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
    ],
    [statusList],
  );
  // Add a new function to handle normal search
  const handleSearch = (value: string): void => {
    setSearch(value);
    setPageValue(defaultPage);
  };
  useEffect(() => {
    setPageValue(defaultPage);
    setShouldFetch(!shouldFetch);
  }, [pageSize]);
  useEffect(() => {
    void fetchOptionsList();
    void fetchStatus();
  }, [pageValue, shouldFetch, search]);

  async function fetchOptionsList(): Promise<void> {
    try {
      const response: any = await ApiUtils.getOptionsList(
        `?page=${pageValue}&page_size=${pageSize}&sort_column=${sortColumn}&sort_direction=${sortDirection}&search=${search}`,
      );
      setOptionsData(response.data.data);
      setTotalRecords(response?.data?.total);
    } catch (_err) {}
  }

  const fetchStatus = async (): Promise<void> => {
    try {
      const response: any = await ApiUtils.getStatus(`type=option`);
      setStatusList(response.data);
    } catch (err: any) {
      ToasterMessage('error', err.message);
    }
  };
  const handleDeleteOption = async (id: string): Promise<void> => {
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
      try {
        const queryParams = `id=${id}`;
        await ApiUtils.deleteOption(queryParams);
        void fetchOptionsList();
        await Swal.fire({
          title: 'Deleted!',
          text: 'Your option has been deleted successfully.',
          icon: 'success',
        });
        setResetSearchFlag(true);
        setSearch('');
      } catch (error: any) {
        void Swal.fire({
          title: 'Error!',
          text: error?.response?.data?.message,
          icon: 'error',
        });
      }
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

  const handleSortByColumn = async (column: string): Promise<void> => {
    try {
      let newSortDirection = 'asc';

      if (column === sortColumn) {
        newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        newSortDirection = 'desc';
      }

      const response: any = await ApiUtils.getOptionsList(
        `?page=${pageValue}&page_size=${pageSize}&sort_column=${column}&sort_direction=${newSortDirection}&search=${search}`,
      );

      setSortDirection(newSortDirection);
      setSortColumn(column);

      setOptionsData(response.data.data);
      setTotalRecords(response?.data?.total);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div className="page-content">
      <Container fluid={true}>
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-sm-0">Options</h4>
        </div>
        <div data-testid="options" id="couponsList">
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Body>
                  {/* <div className="table-responsive table-card"> */}
                  <TableContainer
                    columns={columns ?? []}
                    data={optionsData ?? []}
                    handleNextPagination={handleNextPagination}
                    handlePrevPagination={handlePrevPagination}
                    pageValue={pageValue}
                    isBordered={true}
                    customPageSize={pageSize}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    iscustomPageSize={true}
                    currentData={currentData}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    className="custom-header-css"
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
                    SearchPlaceholder="Search Options..."
                    buttonText="Add Options"
                    onClick={() => {
                      navigate('/options-form');
                    }}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    handleSortByColumn={handleSortByColumn}
                    onSearch={handleSearch}
                    resetSearchFlag={resetSearchFlag}
                    setResetSearchFlag={setResetSearchFlag}
                    isDownload={true}
                    isDownloadAPI={ApiUtils.ExportOption}
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
      </Container>
    </div>
  );
};

export default OptionsList;
