import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../redux/reducer';
import TableContent from './TableContent';
import TableFilter from './TableFilter';
import TableHeader from './TableHeader';
import TablePaging from './TablePaging';

interface Props {}

export interface IPagination {
  currentPage: number;
  rowsPerPage: number;
}

const Table = (props: Props) => {
  const payrolls = useSelector((state: AppState) => state.payrolls);
  const [localPayrolls, setLocalPayrolls] = useState([...payrolls]);

  const [pagination, setPagination] = useState<IPagination>({
    rowsPerPage: 10,
    currentPage: 1,
  });

  useEffect(() => {
    setLocalPayrolls([...payrolls]);
  }, [payrolls]);

  useEffect(() => {}, [localPayrolls]);

  return (
    <div className="transaction__table">
      <TableHeader />
      <TableFilter setLocalPayrolls={setLocalPayrolls} />
      <TableContent localPayrolls={localPayrolls} setLocalPayrolls={setLocalPayrolls} pagination={pagination} />
      <TablePaging localPayrolls={localPayrolls} pagination={pagination} setPagination={setPagination} />
    </div>
  );
};

export default Table;
