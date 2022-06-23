import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IUpdatePayroll } from '../../../../models/payroll';
import { AppState } from '../../../../redux/reducer';
import { setPayrolls } from '../../redux/transactionsReducer';
import { CloseModal, getPayrollStatus, OpenModal } from '../Table/TableContent';

interface Props extends IUpdatePayroll {
  setOpenModal: React.Dispatch<React.SetStateAction<OpenModal | CloseModal>>;
}

const Modal = ({ id, date, currency, total, setOpenModal }: Props) => {
  const [editPayroll, setEditPayroll] = useState<IUpdatePayroll>({
    id,
    date,
    currency,
    total,
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const payrolls = useSelector((state: AppState) => state.payrolls);
  const dispatch = useDispatch();

  useEffect(() => {
    const closeModal = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpenModal({ isOpen: false });
      }
    };

    window.addEventListener('click', closeModal);

    return () => {
      window.removeEventListener('click', closeModal);
    };
  }, [setOpenModal]);

  const updatePayroll = () => {
    const toISOString = (date: string): string => {
      return moment(date, 'DD-MM-YYYY').toISOString();
    };

    const updatedPayrollList = payrolls.map((payroll) => {
      if (payroll.payroll_id === editPayroll.id) {
        const status = getPayrollStatus(payroll);
        let updatedPayroll = {
          ...payroll,
          volume_input_in_input_currency: editPayroll.total,
          currency: editPayroll.currency,
        };

        if (status === 'Fulfilled')
          updatedPayroll = { ...updatedPayroll, date_fulfilled: toISOString(editPayroll.date) };
        else if (status === 'Cancelled')
          updatedPayroll = { ...updatedPayroll, date_canceled: toISOString(editPayroll.date) };
        else if (status === 'Processing')
          updatedPayroll = { ...updatedPayroll, date_processed: toISOString(editPayroll.date) };
        else if (status === 'Received')
          updatedPayroll = { ...updatedPayroll, date_received: toISOString(editPayroll.date) };
        else updatedPayroll = { ...updatedPayroll, time_created: toISOString(editPayroll.date) };

        return updatedPayroll;
      }
      return payroll;
    });

    dispatch(setPayrolls([...updatedPayrollList]));

    setOpenModal({ isOpen: false });
  };

  return ReactDOM.createPortal(
    <div className="payroll__modal-container">
      <div className="payroll__modal" ref={modalRef}>
        <div className="input__group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            name="date"
            id="date"
            value={moment(editPayroll.date, 'DD-MM-YYYY').format('YYYY-MM-DD')}
            onChange={(e) => setEditPayroll({ ...editPayroll, date: e.target.value })}
          />
        </div>
        <div className="input__group">
          <label htmlFor="currency">Currency</label>
          <input
            name="currency"
            id={currency}
            value={editPayroll.currency}
            onChange={(e) => setEditPayroll({ ...editPayroll, currency: e.target.value })}
          />
        </div>
        <div className="input__group">
          <label htmlFor="total">Total</label>
          <input
            type="number"
            name="total"
            id="total"
            value={editPayroll.total}
            onChange={(e) => setEditPayroll({ ...editPayroll, total: +e.target.value })}
          />
        </div>
        <div className="buttons">
          <button className="transaction__button positive" onClick={updatePayroll}>
            Update
          </button>
          <button className="transaction__button negative" onClick={() => setOpenModal({ isOpen: false })}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal')!,
  );
};

export default Modal;
