import ApiUtils from 'api/ApiUtils';
import React, {useEffect, useState} from 'react';
import {Accordion, Button} from 'react-bootstrap';
import {toast} from 'react-toastify';

const PolicyList = (): JSX.Element => {
  document.title = 'Policy | Warehouse ';
  const [policyList, setPolicyList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords]: any = useState();

  const fetchPolicyData = async (page: number): Promise<void> => {
    try {
      const resp: any = await ApiUtils.getPolicyList(
        `page_size=10&page=${page}`,
      );
      setPolicyList(resp.data.data);
      setTotalRecords(resp.data.total);
    } catch (err: any) {
      toast.error(err.message);
    }
  };
  const totalPages = Math.ceil(totalRecords / 10);

  useEffect(() => {
    void fetchPolicyData(currentPage);
  }, [currentPage]);

  const handlePrevPagination = (): any => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPagination = (): any => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      {policyList.length === 0 ? (
        <h2>No Data Found</h2>
      ) : (
        <>
          <Accordion data-testid="policyList">
            {policyList?.map((data: any, index: any) => {
              return (
                <Accordion.Item
                  key={data.isHeader}
                  eventKey={index}
                  className="mb-3">
                  <Accordion.Header>{data?.name}</Accordion.Header>
                  <Accordion.Body>
                    <div dangerouslySetInnerHTML={{__html: data.description}} />
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>
          <div className="col-sm-auto justify-content-end d-flex mb-3">
            <ul className="pagination pagination-separated mb-0 justify-content-center justify-content-sm-start">
              <li
                className={
                  currentPage === 1 ? 'page-item disabled' : 'page-item'
                }>
                <Button
                  onClick={handlePrevPagination}
                  variant="link"
                  className="page-link">
                  Previous
                </Button>
              </li>
              <li className="page-item">
                <Button variant="link" className={'page-link active'}>
                  {currentPage}
                </Button>
              </li>
              {/* You may need to determine if there are more pages before enabling the "Next" button */}
              <li
                className={
                  currentPage > totalPages ? 'page-item disabled' : 'page-item'
                }>
                <Button
                  onClick={handleNextPagination}
                  variant="link"
                  className="page-link">
                  Next
                </Button>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default PolicyList;
