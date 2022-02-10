import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../../utils/api";
import ErrorAlert from "../CommonFiles/ErrorAlert";
import ReservationForm from "./ReservationForm";
//-------------------------------------------------------------------
export default function NewReservation() {
  const history = useHistory();
  const [apiErrors, setApiErrors] = useState(null);

  // -----------------------------------------------------------------
  async function submitHandler(formData) {
    const controller = new AbortController();
    try {
      formData.people = Number(formData.people);
      await createReservation(formData, controller.signal);
      const date = formData.reservation_date;
      history.push(`/dashboard?date=${date}`);
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
      <ErrorAlert error={apiErrors} />
      <ReservationForm submitHandler={submitHandler} />
    </div>
  );
}
