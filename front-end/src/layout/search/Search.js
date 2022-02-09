import React, { useState } from "react";
import { listReservations } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

export default function Search() {
  const initialPhoneForm = {
    mobile_number: "",
  };
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneForm);
  const [reservations, setReservations] = useState([]);
  const [errors, setErrors] = useState(null);

  //---------------------------------------------------------------------------------------
  function changeHandler({ target }) {
    setPhoneNumber(
      { ...phoneNumber, [target.id]: target.value },
      console.log(phoneNumber, "PhoneNUmberIndSetter")
    );
  }
  //---------------------------------------------------------------------------------------

  //-------FIX MEEEEEEE_____does not update state for phonenumber
  // async function findHandler(e) {
  //   e.preventDefault();
  //   console.log("phoneNumber", phoneNumber, "phonenumber");
  //   await listReservations(phoneNumber)
  //     .then(setReservations)
  //     .catch(setErrors)
  //     .then(setPhoneNumber(initialPhoneForm));
  //   console.log(phoneNumber, reservations, "phoneNumber ITS HERE I SWEAR");
  // }
  async function findHandler(e) {
    e.preventDefault();
    console.log("phoneNumber", phoneNumber, "phonenumber");
    await listReservations(phoneNumber)
      .catch(setErrors)
      .then(setReservations)
      .then(setPhoneNumber(initialPhoneForm));
    console.log(phoneNumber, reservations, "phoneNumber ITS HERE I SWEAR");
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
          {reservations ? (
            reservations.map((entry) => {
              return (
                <tr className="tr">
                  <td className="td">{entry.mobile_number}</td>
                  <td className="td">{entry.reservation_date}</td>
                  <td className="td">{entry.reservation_time}</td>
                  <td className="td">{entry.reservation_id}</td>
                  <td className="td">{entry.last_name}</td>
                  <td className="td">{entry.first_name}</td>
                  <td className="td">{entry.people}</td>
                  <td className="td">{entry.status}</td>
                  <td className="td">{entry.table_id}</td>
                </tr>
              );
            })
          ) : (
            <div>
              <div>
                <h1>No reservations found</h1>
              </div>
              <ErrorAlert errors={errors} />
            </div>
          )}
        </tbody>
      </table>
    </div>
  );
}
