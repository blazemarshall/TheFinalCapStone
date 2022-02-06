import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../../utils/api";
import NewReservationForm from "./NewReservationForm";
//-------------------------------------------------------------------
export default function NewReservation({ reservationsError }) {
  const history = useHistory();
  const initialReservationFields = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };
  const [apiErrors, setApiErrors] = useState(null);
  const [formData, setFormData] = useState(initialReservationFields);
  //----------------------------------------------------------------------
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function changeHandlerNum({ target: { name, value } }) {
    setFormData((prevState) => ({
      ...prevState,
      [name]: Number(value),
    }));
  }
  // -----------------------------------------------------------------
  async function submitHandler(e) {
    e.preventDefault();
    const controller = new AbortController();
    try {
      formData.people = Number(formData.people);
      await createReservation(formData, controller.signal);
      const date = formData.reservation_date;
      history.push(`/dashboard?date=${date}`);
      await setFormData({ ...initialReservationFields });
    } catch (error) {
      setApiErrors(error);
      console.log(error.status, "status");

      throw error;
    }
    return () => controller.abort();
  }
  // ------------------------------------------------------------------
  return (
    <div>
      <NewReservationForm
        changeHandlerNum={changeHandlerNum}
        submitHandler={submitHandler}
        changeHandler={changeHandler}
        apiErrors={apiErrors}
        history={history}
        formData={formData}
      />
    </div>
  );
}
