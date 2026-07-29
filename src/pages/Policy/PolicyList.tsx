import TableContainer from 'Common/TableContainer';
import ApiUtils from 'api/ApiUtils';
import React, {useEffect, useState} from 'react';
import {Card, Col, Dropdown, Row} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import Swal from 'sweetalert2';

const PolicyList = (): JSX.Element => {
  document.title = 'Policy Management | Admin';
  const defaultPage = 1;
  const [pageValue, setPageValue] = useState(defaultPage);
  const [sortColumn, setSortColumn] = useState('id');

  const [pageSize, setPageSize] = useState(10);
  const [sortDirection, setSortDirection] = useState('asc');
  const [totalRecords, setTotalRecords] = useState(defaultPage);
  const currentData = Math.ceil(totalRecords / pageSize);
  const [list, setList]: any[] = useState();
  const [search, setSearch] = useState<string>('');
  const [resetSearchFlag, setResetSearchFlag] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setPageValue(defaultPage);
    setShouldFetch(!shouldFetch);
  }, [pageSize]);
  async function getListPolicy(): Promise<void> {
    try {
      const response: any = await ApiUtils.policyList(
        `page_size=${pageSize}&page=${pageValue}&sort_column=${sortColumn}&sort_direction=${sortDirection}&search=${search}`,
      );
      setList(response.data.data ?? []);
      setTotalRecords(response.data.total);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    void getListPolicy();
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

  const handleAddPolicy = (): any => {
    navigate('/policy-add');
  };

  const handleEdit = (data: any): any => {
    navigate(`/policy-update/${data.id}`);
  };

  // Add a new function to handle normal search
  const handleSearch = (value: string): void => {
    setSearch(value);
  };
  const handleDelete = async (data: any): Promise<void> => {
    try {
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
        const response: any = await ApiUtils.deletePolicy(`id=${data.id}`);
        toast.success(response.message);
        setResetSearchFlag(true);
        setSearch('');
        void getListPolicy();
        await Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
        });
      }
    } catch {
      toast.error('Policy Not Deleted');
    }
  };

  const truncateText = (text: string, maxLength: number): any => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };
  const handleSortByColumn = async (column: string): Promise<void> => {
    try {
      let newSortDirection = 'asc';

      if (column === sortColumn) {
        newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        newSortDirection = 'desc';
      }

      const response: any = await ApiUtils.policyList(
        `page_size=${pageSize}&page=${pageValue}&sort_column=${column}&sort_direction=${newSortDirection}&search=${search}`,
      );
      setList(response.data.data ?? []);
      setSortColumn(column);
      setSortDirection(newSortDirection);

      setTotalRecords(response.data.total);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const columns = [
    {
      Header: 'Name',
      disableFilters: true,
      filterable: true,
      accessor: 'name',
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
        <div dangerouslySetInnerHTML={{__html: truncateText(value, 50)}} />
      ),
    },
    {
      Header: 'Action',
      disableFilters: true,
      filterable: true,
      accessor: (cellProps: any) => {
        return (
          <Dropdown className="text-start">
            <Dropdown.Toggle className="btn btn-soft-secondary btn-sm btn-icon dropdown arrow-none">
              <i className="mdi mdi-dots-horizontal" />
            </Dropdown.Toggle>
            <Dropdown.Menu as="ul" className="dropdown-menu-end">
              <li>
                <Dropdown.Item
                  onClick={async () => {
                    await handleEdit(cellProps);
                  }}
                  className="remove-list">
                  <i className="ri-pencil-fill align-bottom me-2 text-muted" />
                  Edit
                </Dropdown.Item>
              </li>
              <li>
                <Dropdown.Item
                  onClick={async () => {
                    await handleDelete(cellProps);
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
  // console.log('list', list);
  return (
    <Row>
      <Col xxl={12}>
        <Card>
          <Card.Body>
            <TableContainer
              columns={columns ?? []}
              data={list ?? []}
              handleNextPagination={handleNextPagination}
              handlePrevPagination={handlePrevPagination}
              customPageSize={pageSize}
              pageValue={pageValue}
              isGlobalFilter={true}
              isAddOptions={true}
              iscustomPageSize={false}
              currentData={currentData}
              setPageSize={setPageSize}
              isBordered={true}
              className="custom-header-css"
              tableClass="table-centered align-middle table-nowrap mb-0"
              theadClass="text-muted table-light"
              SearchPlaceholder="Search Policy..."
              buttonText="Add Policy"
              onClick={handleAddPolicy}
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
  );
};

export default PolicyList;
