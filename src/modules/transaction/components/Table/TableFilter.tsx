import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { IPayroll } from '../../../../models/payroll';
import { AppState } from '../../../../redux/reducer';
import { getPayrollDate, getPayrollStatus } from './TableContent';

interface Props {
  setLocalPayrolls: React.Dispatch<React.SetStateAction<IPayroll[]>>;
}

const TableFilter = ({ setLocalPayrolls }: Props) => {
  const payrolls = useSelector((state: AppState) => state.payrolls);
  const [filter, setFilter] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    invoice: '',
  });

  const onFilter = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (filter.status || filter.dateFrom || filter.dateTo || filter.invoice) {
        let filteredPayrolls = [...payrolls];

        if (filter.status) {
          filteredPayrolls = filteredPayrolls.filter(
            (payroll) => getPayrollStatus(payroll).toLowerCase() === filter.status.toLowerCase(),
          );
        }

        if (filter.dateFrom && filter.dateTo) {
          filteredPayrolls = filteredPayrolls.filter(
            (payroll) =>
              moment(getPayrollDate(payroll), 'DD-MM-YYYY').isSameOrAfter(filter.dateFrom) &&
              moment(getPayrollDate(payroll), 'DD-MM-YYYY').isSameOrBefore(filter.dateTo),
          );
        } else if (filter.dateFrom && !filter.dateTo) {
          filteredPayrolls = filteredPayrolls.filter((payroll) =>
            moment(getPayrollDate(payroll), 'DD-MM-YYYY').isSameOrAfter(filter.dateFrom),
          );
        } else if (!filter.dateFrom && filter.dateTo) {
          filteredPayrolls = filteredPayrolls.filter((payroll) =>
            moment(getPayrollDate(payroll), 'DD-MM-YYYY').isSameOrBefore(filter.dateTo),
          );
        }

        if (filter.invoice) {
          filteredPayrolls = filteredPayrolls.filter((payroll) => {
            return payroll.subpayroll_ids.join('') === filter.invoice;
          });
        }

        setLocalPayrolls(filteredPayrolls);
      }
    },
    [filter.dateFrom, filter.dateTo, filter.invoice, filter.status, payrolls, setLocalPayrolls],
  );

  const onResetFilter = () => {
    if (filter.status || filter.dateFrom || filter.dateTo || filter.invoice) {
      setFilter({
        status: '',
        dateFrom: '',
        dateTo: '',
        invoice: '',
      });
      setLocalPayrolls([...payrolls]);
    }
  };

  return (
    <form className="table__filter" onSubmit={onFilter}>
      <div className="filter__options">
        <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
          <option value="">Status</option>
          <option value="pending">Pending</option>
          <option value="received">Received</option>
          <option value="processing">Processing</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          data-placeholder="From"
          value={filter.dateFrom}
          onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })}
        />
        <input
          type="date"
          data-placeholder="To"
          value={filter.dateTo}
          onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })}
        />
        <input
          type="text"
          placeholder="Invoice #"
          value={filter.invoice}
          onChange={(e) => setFilter({ ...filter, invoice: e.target.value })}
        />
      </div>
      <div className="filter__buttons">
        <button className="transaction__button positive" type="submit">
          Apply
        </button>
        <button className="transaction__button negative" type="button" onClick={onResetFilter}>
          Clear
        </button>
      </div>
    </form>
  );
};

export default TableFilter;
