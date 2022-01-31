import React, { useState } from "react";
import { useHistory } from "react-router";
import TableForm from "./TableForm";
import { updateTableList, createTable } from "../../utils/api";

export default function NewTable() {
  const initialTableForm = {
    table_name: "",
    capacity: "",
  };
  const history = useHistory();
  const [tableFormData, setTableFormData] = useState(initialTableForm);
  const [apiTableErrors, setApiTableErrors] = useState(null);

  //fix me
  function cancelHandler() {
    history.goBack();
  }

  // fix me
  async function tableSubmitHandler(e) {
    e.preventDefault();
    console.log("tableSubmitHandler activated");
    const controller = new AbortController();
    try {
      await createTable(tableFormData, controller.signal);
      await setTableFormData({ ...initialTableForm });
      console.log("submitted");
      history.push("/dashboard");
      console.log("tableSubmitHandler end");
    } catch (error) {
      console.log(error);
      await setApiTableErrors(error);
    }
    return () => controller.abort();
  }

  const changeHandler = (e) => {
    setTableFormData({ ...tableFormData, [e.target.name]: e.target.value });
  };
  console.log("changeHandler");
  return (
    <div>
      <TableForm
        cancelHandler={cancelHandler}
        changeHandler={changeHandler}
        tableSubmitHandler={tableSubmitHandler}
        apiTableErrors={apiTableErrors}
      />
    </div>
  );
}
