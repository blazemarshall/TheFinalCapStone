import React, { useState } from "react";
import { useHistory } from "react-router";
import TableForm from "./TableForm";
import { createTable } from "../../utils/api";
//-----------------------------------------------
export default function NewTable() {
  const initialTableForm = {
    table_name: "",
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
    const controller = new AbortController();
    try {
      await createTable(tableFormData, controller.signal);

      // setTableFormData(initialTableForm);
      history.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
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
