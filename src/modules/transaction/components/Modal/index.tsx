import React from 'react';
import { IDeletePayroll, IUpdatePayroll } from '../../../../models/payroll';
import { CloseModal, OpenModal } from '../Table/TableContent';
import DeleteModal from './DeleteModal';
import UpdateModal from './UpdateModal';

interface ModalPropsBase {
  type: 'delete' | 'update';
  setOpenModal: React.Dispatch<React.SetStateAction<OpenModal | CloseModal>>;
}

type UpdateModalProps = {
  type: 'update';
} & IUpdatePayroll &
  ModalPropsBase;

type DeleteModalProps = {
  type: 'delete';
} & IDeletePayroll &
  ModalPropsBase;

const index = ({ type, id, setOpenModal, ...props }: UpdateModalProps | DeleteModalProps) => {
  const { date, currency, total } = props as UpdateModalProps;

  return (
    <>
      {type === 'delete' ? (
        <DeleteModal id={id} setOpenModal={setOpenModal} />
      ) : (
        <UpdateModal id={id} date={date} currency={currency} total={total} setOpenModal={setOpenModal} />
      )}
    </>
  );
};

export default index;
