import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../../utils/api";
import ReservationForm from "./ReservationForm";
//-------------------------------------------------------------------
export default function NewReservation() {
  const history = useHistory();
  const initialReservationFields = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
    status: "booked",
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
      setFormData({ ...initialReservationFields });
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
      <ReservationForm
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
