import React from 'react';
import { ReactComponent as Trash } from '../../../../trash.svg';
import { CloseModal, OpenModal } from './TableContent';

interface Props {
  id: string;
  status: string;
  date: string;
  currency: string;
  total: number;
  invoice: string[];
  setOpenModal: React.Dispatch<React.SetStateAction<OpenModal | CloseModal>>;
}

const TableRow = ({ id, status, date, currency, total, invoice, setOpenModal }: Props) => {
  return (
    <div className="table__row">
      <p className={`status ${status.toLowerCase()}`}>{status}</p>
      <p>{date}</p>
      <p>{currency}</p>
      <p>{total}</p>
      <p>{invoice}</p>
      <button
        onClick={() =>
          setOpenModal({
            isOpen: true,
            type: 'update',
            id,
            currency,
            date,
            total,
          })
        }
      >
        View Details
      </button>
      <Trash
        onClick={() =>
          setOpenModal({
            isOpen: true,
            type: 'delete',
            id,
          })
        }
      />
    </div>
  );
};

export default React.memo(TableRow);
