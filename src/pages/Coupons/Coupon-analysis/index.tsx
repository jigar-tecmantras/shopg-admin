import ApiUtils from 'api/ApiUtils';
import React, {useEffect, useState} from 'react';
import {Card, Col, Container} from 'react-bootstrap';
import {toast} from 'react-toastify';
import CouponAnalysisTableContainer from './CouponAnalysisTableContainer';

interface CouponAnalysisData {
  data: {
    data:
      | Array<{
          id: number;
          name: string;
          media_type_id: number;
          code: string;
          total_amount: number | null;
          coupon_used: number;
          order_count: number;
        }>
      | undefined;
    page_size?: number;
    current_page?: number;
    total?: number;
  };
  message?: string;
}

interface MediaType {
  id: number;
  name: string;
}

const CouponAnalysis = (): JSX.Element => {
  document.title = 'Coupon Analysis | Warehouse ';
  const [couponAnalysisData, setCouponAnalysisData] = React.useState<any>();
  const defaultPage = 1;
  const [pageValue, setPageValue] = useState(defaultPage);
  const [mediaType, setMediaType] = useState<MediaType[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(defaultPage);
  const [sortColumn, setSortColumn] = useState('id');
  const [shouldFetch, setShouldFetch] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [mediaTypeData, setMediaTypeData] = useState<number | ''>('');
  const currentData = Math.ceil(totalRecords / pageSize);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
  });
  useEffect(() => {
    setPageValue(defaultPage);
    setShouldFetch(!shouldFetch);
  }, [pageSize]);
  async function getCouponAnalysis(): Promise<void> {
    try {
      const data: any = await ApiUtils.getCouponAnalysisList(
        `?page_size=${pageSize}&page=${pageValue}&sort_column=${sortColumn}&sort_direction=${sortDirection}&search=${search}&media_type_id=${mediaTypeData}`,
      );

      setCouponAnalysisData(data as CouponAnalysisData);
      setTotalRecords((data as CouponAnalysisData)?.data?.total ?? defaultPage);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const handleMediaType = (mediaId: any): void => {
    setMediaTypeData(mediaId);
  };
  const handleSearch = (value: string): void => {
    setSearch(value);
    setPageValue(defaultPage);
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

      const data: any = await ApiUtils.getCouponAnalysisList(
        `?page_size=${pageSize}&page=${pageValue}&sort_column=${column}&sort_direction=${newSortDirection}&search=${search}&media_type_id=${mediaTypeData}`,
      );

      setCouponAnalysisData(data as CouponAnalysisData);
      setSortDirection(newSortDirection);
      setSortColumn(column);

      setTotalRecords((data as CouponAnalysisData)?.data?.total ?? defaultPage);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchMediaType = async (): Promise<void> => {
    try {
      const res: any = await ApiUtils.couponMediaType();
      setMediaType(res?.data?.coupon_media_type ?? []);
    } catch (err: any) {
      toast.error(err?.message);
    }
  };
  useEffect(() => {
    void getCouponAnalysis();
    void fetchMediaType();
  }, [pageValue, shouldFetch, search, mediaTypeData, dateFilter]);

  const getMediaTypeName = (mediaTypeId: number): string => {
    const type = mediaType?.find(item => item.id === mediaTypeId);
    return type != null ? type.name : '';
  };
  const columns = [
    {
      Header: 'Coupon Name',
      disableFilters: true,
      filterable: true,
      accessor: 'name',
      Cell: ({cell}: {cell: {value: string}}) => {
        return <div>{cell.value}</div>;
      },
    },
    {
      Header: 'Coupon Code',
      disableFilters: true,
      filterable: true,
      accessor: 'code',
      Cell: ({cell}: {cell: {value: string}}) => {
        return <div>{cell.value}</div>;
      },
    },
    {
      Header: 'Media Type',
      disableFilters: true,
      filterable: true,
      accessor: 'media_type_id',
      Cell: ({cell}: {cell: {value: number}}) => {
        return <div>{getMediaTypeName(cell.value)}</div>;
      },
    },
    {
      Header: 'Total Coupon Used',
      disableFilters: true,
      filterable: true,
      accessor: 'coupon_used',
      Cell: ({cell}: {cell: {value: string}}) => {
        return <div>{cell.value}</div>;
      },
    },
    {
      Header: 'Total Coupon Amount',
      disableFilters: true,
      filterable: true,
      accessor: 'total_amount',
      Cell: ({cell}: {cell: {value: string}}) => {
        return <div>{cell.value}</div>;
      },
    },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-5">
            <h4 className="mb-sm-0">Coupon Analysis</h4>
          </div>
        </div>

        <Col xxl={12}>
          <Card>
            <Card.Body>
              <CouponAnalysisTableContainer
                columns={columns}
                data={
                  couponAnalysisData?.data?.data?.length > 0
                    ? couponAnalysisData?.data?.data
                    : []
                }
                isBordered={false}
                isGlobalFilter={true}
                iscustomPageSize={true}
                handleNextPagination={handleNextPagination}
                handlePrevPagination={handlePrevPagination}
                pageValue={pageValue}
                customPageSize={pageSize}
                currentData={currentData}
                setPageSize={setPageSize}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSearch={handleSearch}
                handleSortByColumn={handleSortByColumn}
                className="custom-header-css table-card"
                tableClass="table-centered align-middle table-nowrap mb-0"
                theadClass="text-muted table-light"
                SearchPlaceholder="Search Coupon..."
                handleMediaType={handleMediaType}
                setDateFilter={setDateFilter}
                mediaType={mediaType}
              />
            </Card.Body>
          </Card>
        </Col>
      </Container>
    </div>
  );
};

export default CouponAnalysis;
