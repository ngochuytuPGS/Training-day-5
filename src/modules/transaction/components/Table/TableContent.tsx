import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { IPagination } from '.';
import { IDeletePayroll, IPayroll, IUpdatePayroll } from '../../../../models/payroll';
import Modal from '../Modal/index';
import TableRow from './TableRow';

interface Props {
  localPayrolls: IPayroll[];
  pagination: IPagination;
}

interface UpdateModalProps extends IUpdatePayroll {
  type: 'update';
}

interface DeleteModalProps extends IDeletePayroll {
  type: 'delete';
}

export type OpenModal = {
  isOpen: true;
} & (UpdateModalProps | DeleteModalProps);

export type CloseModal = {
  isOpen: false;
};

export const getPayrollStatus = ({ received, matched, approved, fulfilled, canceled }: IPayroll) => {
  if (fulfilled) return 'Fulfilled';
  if (canceled) return 'Cancelled';
  if (matched || approved) return 'Processing';
  if (received) return 'Received';

  return 'Pending';
};

const formatDate = (date: string): string => {
  return moment(date).format('DD-MM-YYYY');
};

export const getPayrollDate = (payroll: IPayroll): string => {
  switch (getPayrollStatus(payroll)) {
    case 'Received':
      return formatDate(payroll.date_received);
    case 'Processing':
      return formatDate(payroll.date_processed);
    case 'Fulfilled':
      return formatDate(payroll.date_fulfilled);
    case 'Cancelled':
      return formatDate(payroll.date_canceled);
    default:
      return formatDate(payroll.time_created);
  }
};

const TableContent = ({ localPayrolls, pagination }: Props) => {
  const [openModal, setOpenModal] = useState<OpenModal | CloseModal>({ isOpen: false });
  const { currency, date, total } = openModal as UpdateModalProps;

  const payrollsByPage = localPayrolls.filter(
    (_, index) =>
      index + 1 <= pagination.rowsPerPage * pagination.currentPage &&
      index + 1 > pagination.rowsPerPage * (pagination.currentPage - 1),
  );

  const lastScrollYPositionRef = useRef(0);

  useEffect(() => {
    if (openModal.isOpen) {
      lastScrollYPositionRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.overflowY = 'scroll';
    } else {
      document.body.style.position = 'static';
      document.body.style.overflowY = 'auto';
      window.scrollTo(0, lastScrollYPositionRef.current);
    }
  }, [openModal]);

  return (
    <>
      <div className="table__body">
        <div className="table__header">
          <h5>Status</h5>
          <h5>Date</h5>
          <h5>Currency</h5>
          <h5>Total</h5>
          <h5>Invoice #</h5>
        </div>
        <div className="table__content">
          {payrollsByPage.map((payroll) => (
            <TableRow
              key={payroll.payroll_id}
              id={payroll.payroll_id}
              status={getPayrollStatus(payroll)}
              date={getPayrollDate(payroll)}
              currency={payroll.currency}
              invoice={payroll.subpayroll_ids}
              total={payroll.volume_input_in_input_currency}
              setOpenModal={setOpenModal}
            />
          ))}
        </div>
      </div>
      {openModal.isOpen && (
        <Modal
          type={openModal.type}
          id={openModal.id}
          setOpenModal={setOpenModal}
          date={date}
          currency={currency}
          total={total}
        />
      )}
    </>
  );
};

export default TableContent;
