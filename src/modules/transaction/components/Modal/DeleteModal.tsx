import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { CloseModal, OpenModal } from '../Table/TableContent';
import { IDeletePayroll, IPayroll } from '../../../../models/payroll';
import { AppState } from '../../../../redux/reducer';
import { useDispatch, useSelector } from 'react-redux';
import { setPayrolls } from '../../redux/transactionsReducer';

interface ModalProps extends IDeletePayroll {
  setOpenModal: React.Dispatch<React.SetStateAction<OpenModal | CloseModal>>;
}

const DeleteModal = ({ id, setOpenModal }: ModalProps) => {
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

  const onDeletePayroll = () => {
    const newPayrollsList = payrolls.filter((payroll) => payroll.payroll_id !== id);

    dispatch(setPayrolls([...newPayrollsList]));
    setOpenModal({ isOpen: false });
  };

  return ReactDOM.createPortal(
    <div className="payroll__modal-container">
      <div className="payroll__modal" ref={modalRef}>
        <h4 className="modal__heading">Delete ? </h4>
        <div className="buttons">
          <button className="transaction__button positive" onClick={onDeletePayroll}>
            Delete
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

export default DeleteModal;
