import React, { useState } from "react";
import { Link } from "react-router-dom";
import { listReservations } from "../../utils/api";
import ErrorAlert from "../CommonFiles/ErrorAlert";

export default function Search() {
  const initialPhoneForm = {
    mobile_number: "",
  };
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneForm);
  const [reservations, setReservations] = useState([]);
  const [errors, setErrors] = useState(null);

  //---------------------------------------------------------------------------------------
  function changeHandler({ target }) {
    setPhoneNumber({ ...phoneNumber, [target.id]: target.value });
  }
  //---------------------------------------------------------------------------------------

  async function findHandler(e) {
    e.preventDefault();
    try {
      await listReservations(phoneNumber).then(setReservations);
    } catch (error) {
      setErrors(error);
    }
  }
  function cancelHandler() {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
    }
  }
  //---------------------------------------------------------------------------------------
  return (
    <div>
      <h1>Enter a phone number to search.</h1>
      <form onSubmit={findHandler}>
        <button type="submit" className="btn-secondary btn">
          Find:
        </button>
        <input
          id="mobile_number"
          required
          className="form"
          type="tel"
          name="mobile_number"
          aria-label="mobile_number"
          placeholder="Enter a customer's phone number"
          onChange={changeHandler}
          value={phoneNumber.mobile_number}
        />
      </form>
      <div>
        <h3>Reservations</h3>
      </div>
      <table>
        <thead>
          <tr className="tr">
            <th className="th">Mobile #</th>
            <th className="th">Date</th>
            <th className="th">Time</th>
            <th className="th">Reservation Id</th>
            <th className="th">Last Name</th>
            <th className="th">First Name</th>
            <th className="th">Party Size</th>
            <th className="th">Status</th>
            <th className="th">Table</th>
          </tr>
        </thead>
        <tbody>
          {reservations?.map((entry) => {
            return (
              <tr className="tr" key={entry.reservation_id}>
                <td className="td">{entry.mobile_number}</td>
                <td className="td">{entry.reservation_date}</td>
                <td className="td">{entry.reservation_time}</td>
                <td className="td">{entry.reservation_id}</td>
                <td className="td">{entry.last_name}</td>
                <td className="td">{entry.first_name}</td>
                <td className="td">{entry.people}</td>
                <td className="td">{entry.status}</td>
                <td className="td">{entry.table_id}</td>
                <td>
                  <Link
                    className="btn btn_dark"
                    to={"/reservations/:reservation_id/edit"}
                    href={`/reservations/${entry.reservation_id}/edit`}
                  >
                    Edit
                  </Link>
                </td>
                <td>
                  <button
                    onClick={cancelHandler}
                    data-reservation-id-cancel={entry.reservation_id}
                  >
                    Cancel
                  </button>{" "}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {reservations.length === 0 ? (
        <div>No reservations found</div>
      ) : (
        <div></div>
      )}
      <ErrorAlert error={errors} />
    </div>
  );
}
