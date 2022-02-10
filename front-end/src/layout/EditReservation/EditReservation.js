import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ReservationForm from "../newReservationPage/ReservationForm";
import { reservationGrab, editReservationUpdate } from "../../utils/api";
import ErrorAlert from "../CommonFiles/ErrorAlert";
import { formatAsDate } from "../../utils/date-time";

export default function EditReservation() {
  const history = useHistory();
  const [errors, setErrors] = useState(null);
  const { reservation_id } = useParams();
  const [reservation, setReservation] = useState(null);
  useEffect(loadReservation, [reservation_id]);

  async function loadReservation() {
    let ac = new AbortController();
    try {
      let singleReservation = await reservationGrab(reservation_id);
      setReservation(singleReservation);
    } catch (error) {
      setErrors(error);
    }
    return () => ac.abort();
  }

  async function submitHandler(formData) {
    const ac = new AbortController();
    try {
      await editReservationUpdate(formData);
      history.push(
        `/dashboard?date=${formatAsDate(reservation.reservation_date)}`
      );
    } catch (error) {
      setErrors(error);
    }
    return () => ac.abort();
  }
  console.log(reservation, "Reptile");
  return (
    <div>
      {reservation && (
        <ReservationForm
          submitHandler={submitHandler}
          initialReservationFields={{
            ...reservation,
            reservation_date: formatAsDate(reservation.reservation_date),
          }}
        />
      )}
      <ErrorAlert error={errors} />
    </div>
  );
}
