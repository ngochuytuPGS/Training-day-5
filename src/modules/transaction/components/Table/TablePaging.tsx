import React from 'react';
import { IPagination } from '.';
import { IPayroll } from '../../../../models/payroll';

interface Props {
  localPayrolls: IPayroll[];
  pagination: IPagination;
  setPagination: React.Dispatch<React.SetStateAction<IPagination>>;
}

const TablePaging = ({ pagination, setPagination, localPayrolls }: Props) => {
  const totalPages = Math.ceil(localPayrolls.length / pagination.rowsPerPage);
  const pageNumberShown = totalPages < 5 ? totalPages : 5;

  const setNextPagination = (nextPage: number) => {
    setPagination({
      ...pagination,
      currentPage: nextPage,
    });
  };

  const renderPageNumbers = (): JSX.Element[] => {
    const lastPaginationPage = totalPages - pageNumberShown + 1;
    if (pagination.currentPage >= lastPaginationPage) {
      return new Array(pageNumberShown).fill(lastPaginationPage).map((lastPaginationPageNumber, index) => {
        if (lastPaginationPageNumber + index === pagination.currentPage) {
          return <button className="paging__button active">{pagination.currentPage}</button>;
        } else {
          return (
            <button className="paging__button" onClick={() => setNextPagination(lastPaginationPageNumber + index)}>
              {lastPaginationPageNumber + index}
            </button>
          );
        }
      });
    } else {
      return new Array(pageNumberShown).fill(pagination.currentPage).map((currentPage, index) => {
        if (index === 0) {
          return <button className="paging__button active">{currentPage}</button>;
        } else if (index !== pageNumberShown - 1) {
          return (
            <button className="paging__button" onClick={() => setNextPagination(currentPage + index)}>
              {currentPage + index}
            </button>
          );
        } else {
          return (
            <button className="paging__button" onClick={() => setNextPagination(totalPages)}>
              {totalPages}
            </button>
          );
        }
      });
    }
  };

  return (
    <div className="table__paging">
      <p>
        Showing {pagination.rowsPerPage} from {localPayrolls.length} data
      </p>
      <div className="paging__buttons">
        <button className="paging__button" onClick={() => setNextPagination(1)}>
          &lt;&lt;
        </button>
        {renderPageNumbers()}

        <button className="paging__button" onClick={() => setNextPagination(totalPages)}>
          &gt;&gt;
        </button>
      </div>
    </div>
  );
};

export default TablePaging;
