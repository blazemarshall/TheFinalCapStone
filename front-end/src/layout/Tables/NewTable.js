import React, { useState } from "react";
import { useHistory } from "react-router";
import TableForm from "./TableForm";
import { createTable } from "../../utils/api";
//-----------------------------------------------
export default function NewTable() {
  const initialTableForm = {
    table_name: 0,
    capacity: 0,
  };
  const history = useHistory();
  const [tableFormData, setTableFormData] = useState(initialTableForm);
  const [apiTableErrors, setApiTableErrors] = useState(null);
  let mounted = false;

  //--------------------------------------------
  function cancelHandler() {
    history.go(-1);
  }
  //----------------------------------------------
  async function tableSubmitHandler(e) {
    e.preventDefault();
    mounted = true;
    const controller = new AbortController();
    try {
      await createTable(tableFormData, controller.signal);
      if (mounted) {
        await setTableFormData({ ...initialTableForm }).then(history.go(-1));
      }
    } catch (error) {
      console.log(error);
      await setApiTableErrors(error);
    }
    mounted = false;
    return () => controller.abort();
  }
  //----------------------------------------------
  const changeHandler = (e) => {
    setTableFormData({ ...tableFormData, [e.target.name]: e.target.value });
  };
  const numChangeHandler = (e) => {
    setTableFormData({
      ...tableFormData,
      [e.target.name]: Number(e.target.value),
    });
  };
  //--------------------------------------------
  return (
    <div>
      <TableForm
        numChangeHandler={numChangeHandler}
        cancelHandler={cancelHandler}
        changeHandler={changeHandler}
        tableSubmitHandler={tableSubmitHandler}
        apiTableErrors={apiTableErrors}
      />
    </div>
  );
}
