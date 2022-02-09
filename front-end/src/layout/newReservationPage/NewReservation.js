import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../../utils/api";
import NewReservationForm from "./NewReservationForm";
//-------------------------------------------------------------------
export default function NewReservation({ reservationsError }) {
  let mounted = false;
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
    mounted = true;
    if (mounted) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    mounted = false;
  };

  function changeHandlerNum({ target: { name, value } }) {
    mounted = true;
    if (mounted) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: Number(value),
      }));
    }
    mounted = false;
  }
  // -----------------------------------------------------------------
  async function submitHandler(e) {
    e.preventDefault();
    mounted = true;
    const controller = new AbortController();
    try {
      formData.people = Number(formData.people);
      await createReservation(formData, controller.signal);
      const date = formData.reservation_date;
      history.push(`/dashboard?date=${date}`);
      if (mounted) {
        await setFormData({ ...initialReservationFields });
      }
    } catch (error) {
      setApiErrors(error);
      console.log(error.status, "status");

      throw error;
    }
    mounted = false;
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
