import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Table from '../components/Table/index';
import { setPayrolls } from '../redux/transactionsReducer';

interface Props {}

const TransactionPage = (props: Props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      const json = await (await fetch('./fake-data.json')).json();

      dispatch(setPayrolls([...json.payrolls]));
    };
    getData();
  }, [dispatch]);

  return <Table />;
};

export default TransactionPage;
