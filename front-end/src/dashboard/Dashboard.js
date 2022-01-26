import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import formatReservationTime from "../utils/format-reservation-time";
import { previous, next, today } from "../utils/date-time";
// import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ dateParam }) {
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const history = useHistory();
  const query = useQuery();
  console.log(query.get("date"), "query");

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [date, setDate] = useState(query.get("date") || dateParam);
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  formatReservationTime(reservations);

  // twelveHourTime();

  //maps reservations
  const reserveMap = reservations.map((item, index) => {
    return (
      <li className="col " key={index}>
        {" "}
        <div>{item.reservation_time}</div>
        <div>
          Name : {item.first_name} {item.last_name}
        </div>
        <div>Mobile Number : {item.mobile_number}</div>
      </li>
    );
  });

  //increments date to tomorrow
  function forwardHandler() {
    setDate((date) => next(date));
    history.push(`/dashboard?date=${next(date)}`);
  }

  //decrements date to tomorrow
  function previousHandler() {
    setDate((date) => previous(date));
    history.push(`/dashboard?date=${previous(date)}`);
  }

  //loads reservations for today
  function todayHandler() {
    setDate(today());
    history.push(`/dashboard?date=${today()}`);
  }

  return (
    <main>
      <div className="">
        <h1>Dashboard</h1>
      </div>

      <div className=" d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <div className="col">
        <button className="btn btn-secondary" onClick={previousHandler}>
          {" "}
          Previous Day{" "}
        </button>
        <button className="btn btn-success" onClick={todayHandler}>
          {" "}
          Today{" "}
        </button>
        <button className="btn btn-secondary" onClick={forwardHandler}>
          Next Day
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
      <div>
        <ul>{reserveMap}</ul>
      </div>
    </main>
  );
}

export default Dashboard;
