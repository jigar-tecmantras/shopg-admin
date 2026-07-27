import TableContainer from 'Common/TableContainer';
import React, {useEffect, useMemo, useState} from 'react';
import {Button, Card, Col, Row} from 'react-bootstrap';
// import AddCoupons from './AddCoupons';
import ModalContainer from 'Common/ModalContainer';
import {DOCUMENT_TITLE} from 'Common/constants/layout';
import ApiUtils from 'api/ApiUtils';
import {toast} from 'react-toastify';
import {ToasterMessage} from 'helpers/ToastHelper';
import AddBanners from './AddBanners';

interface Status {
  id: number;
  name: string;
  model: string;
}

const BannersList = (): JSX.Element => {
  document.title = DOCUMENT_TITLE.BANNERS;
  const [modalFlag, setModalFlag] = useState(false);
  const [editData, setEditData] = useState(undefined);
  const defaultPage = 1;

  const [pageValue, setPageValue] = useState(defaultPage);
  const [sortColumn, setSortColumn] = useState('id');

  const [pageSize, setPageSize] = useState(10);

  const [sortDirection, setSortDirection] = useState('asc');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalRecords, setTotalRecords] = useState(defaultPage);
  const [search, setSearch] = useState<string>('');

  const [statusList, setStatusList] = useState<Status[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [resetSearchFlag, setResetSearchFlag] = useState(false);
  const currentData = Math.ceil(totalRecords / pageSize);
  const [shouldFetch, setShouldFetch] = useState(false);

  const [bannersList, setBannersList] = useState<any>();

  useEffect(() => {
    setPageValue(defaultPage);
    setShouldFetch(!shouldFetch);
  }, [pageSize]);

  async function getListPolicy(): Promise<void> {
    try {
      const response: any = await ApiUtils.bannersList(
        `page_size=${pageSize}&page=${pageValue}&sort_column=${sortColumn}&sort_direction=${sortDirection}&search=${search}`,
      );
      // console.log(response, 'response');
      setBannersList(response.data?.data ?? []);
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
    } else {
      setPageValue(pageSize);
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
      const response: any = await ApiUtils.bannersList(
        `page_size=${pageSize}&page=${pageValue}&sort_column=${sortColumn}&sort_direction=${sortDirection}&search=${search}`,
      );
      setBannersList(response.data?.data ?? []);
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
        Header: 'Brand Name',
        disableFilters: false,
        filterable: false,
        accessor: 'name',
      },

      {
        Header: 'URL',
        disableFilters: false,
        filterable: false,
        accessor: 'URL',
      },
      {
        Header: 'Action',

        disableFilters: true,
        filterable: false,
        Cell: (cellProps: any) => {
          return (
            <Button
              role="add-Btn"
              variant="success"
              className="edit mx-2 text-light"
              onClick={() => handleEdit(cellProps.row.original)}>
              <i className="ri-pencil-fill align-bottom me-2  text-light" />
              Edit
            </Button>
          );
        },
      },
    ],
    [statusList],
  );

  const fetchStatus = async (): Promise<void> => {
    try {
      const response: any = await ApiUtils.getStatus(`type=brand_code`);
      setStatusList(response.data);
    } catch (err: any) {
      ToasterMessage('error', err.message);
    }
  };

  return (
    <Col xxl={12} data-testid="brands">
      <Row>
        <Col xxl={12} className="mt-4">
          <Card>
            <Card.Body>
              <TableContainer
                columns={columns}
                data={bannersList ?? []}
                handleNextPagination={handleNextPagination}
                handlePrevPagination={handlePrevPagination}
                pageValue={pageValue}
                iscustomPageSize={false}
                isBordered={true}
                customPageSize={pageSize}
                isGlobalFilter={true}
                pageSize={pageSize}
                currentData={currentData}
                setPageSize={setPageSize}
                className="custom-header-css"
                tableClass="table-centered align-middle table-nowrap mb-0"
                theadClass="text-muted table-light"
                SearchPlaceholder="Search Banners..."
                // buttonText="Add Brand"
                // onClick={() => {
                //   modalToggle();
                // }}
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
        modalTitle={editData !== undefined ? 'Edit Banner' : 'Add Banner'}
        modalBody={
          <AddBanners
            editData={editData}
            handleClose={handleClose}
            getListPolicy={getListPolicy}
          />
        }
      />
    </Col>
  );
};

export default BannersList;
