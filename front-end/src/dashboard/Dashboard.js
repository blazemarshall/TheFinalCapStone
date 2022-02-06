import React, { useEffect, useState } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import formatReservationTime from "../utils/format-reservation-time";
import { previous, next, today } from "../utils/date-time";
import "./Dashboard.css";

// import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ dateParam, tables, setTables }) {
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const history = useHistory();
  const query = useQuery();
  const [reservations, setReservations] = useState([]);
  const [date, setDate] = useState(query.get("date") || dateParam);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  //------------------------------------------------------
  useEffect(() => {
    function loadDashboard() {
      const abortController = new AbortController();
      setReservationsError(null);
      listReservations({ date }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsError)
        .then(
          listTables(abortController.signal)
            .then(setTables)
            .catch(setTablesError)
        );

      return () => abortController.abort();
    }
    loadDashboard();
  }, [date]);
  //-----------------------------------------------------
  formatReservationTime(reservations);

  function twelveHourTime(time) {
    let timeArr = time.split(":");
    let amPM = "a";
    if (Number(timeArr[0]) > 12) {
      amPM = "p";
    }
    let hours = timeArr[0] % 12;
    let arr = [];
    arr.push(hours);
    arr.push(timeArr[1]);
    arr.join(":");
    return <div>{`${arr[0]}:${arr[1]}${amPM}`}</div>;
  }

  //maps reservations---------------------------------------
  const reserveMap = reservations?.map((item, index) => {
    const {
      reservation_id,
      reservation_time,
      first_name,
      last_name,
      table_id,
      mobile_number,
      people,
      status,
    } = item;

    return (
      <tr className="col tr" key={uuid()}>
        <td className="td">{reservation_id}</td>
        <td className="td">{twelveHourTime(reservation_time)}</td>
        <td className="td">
          {first_name} {last_name}
        </td>
        <td className="td">{people}</td>
        <td className="td">{mobile_number}</td>
        <td className="td">{table_id}</td>
        <td className="td">{status}</td>
        <td className="td">
          <Link
            // onClick={seatHandler}
            href={`/reservations/${reservation_id}/seat`}
            className="btn-success btn"
            to={`/reservations/${reservation_id}/seat`}
          >
            Seat
          </Link>
        </td>
        <td data-reservation-id-status={reservation_id}>{status}</td>
      </tr>
    );
  });
  {
    /*if occupied, display finish button or seat button
  <button onclick={finishHandler} data-table-id-finish={table.table_id}>
    Finish
  </button>;
     */
  }

  // maps tables--------------------------------------------
  const tableMap = tables?.map((table) => {
    return (
      <tr key={uuid()}>
        <td className="td">{table.table_id}</td>
        <td className="td">{table.table_name}</td>
        <td className="td">{table.reservation_id}</td>
        <td className="td">{table.capacity}</td>
        <td data-table-id-status={table.table_id}>
          {table.reservation_id ? "occupied" : "free"}
        </td>
      </tr>
    );
  });
  //------------------------------------------------------------------
  // us-05 seat handler
  // async function seatHandler() {
  //   let ac = new AbortController();
  //   //when clicked set status to seated
  //   await updateStatusForRes(ac.signal);
  //   //then hide seat button.
  // }

  //finishHandler
  function finishHandler() {
    // us05
    //when clicked will display alert confirmation
    // "Is this table ready to seat new guests? This cannot be undone."
    //     if ok system will
    //           send delete request to /tables/:table_id/seat
    //           send get request to refresh list of tables
    //     cancel makes no changes
    //us 06 when clicked removes reservation from dashboard
  }

  //increments date
  function forwardHandler() {
    setDate((date) => next(date));
    history.push(`/dashboard?date=${next(date)}`);
  }

  //decrements date
  function previousHandler() {
    setDate((date) => previous(date));
    history.push(`/dashboard?date=${previous(date)}`);
  }

  //loads reservations for today
  function todayHandler() {
    setDate(today());
    history.push(`/dashboard?date=${today()}`);
  }
  //----------------------------------------------------------
  return (
    <main>
      <div className="">
        <h1>Dashboard</h1>
      </div>

      <div className=" d-md-flex mb-3"></div>
      <div className="col">
        <button className="btn btn-secondary" onClick={previousHandler}>
          Previous Day
        </button>
        <button className="btn btn-success" onClick={todayHandler}>
          Today
        </button>
        <button className="btn btn-secondary" onClick={forwardHandler}>
          Next Day
        </button>
      </div>
      <ErrorAlert error={reservationsError || tablesError} />
      <h4 className="mb-0">Reservations for {date}</h4>
      <div>
        <div>
          <table>
            <thead>
              <tr>
                <th className="th">Id</th>
                <th className="th">Time</th>
                <th className="th">Name</th>
                <th className="th">PartySize</th>
                <th className="th">Mobile#</th>
                <th className="th">Table_id</th>
                <th className="th">Status</th>
                <th className="th">Action</th>
              </tr>
            </thead>
            <tbody>{reserveMap}</tbody>
          </table>
        </div>
        <div>
          <h4>List of tables</h4>
          <table>
            <thead>
              <tr>
                <th className="th">table_id</th>
                <th className="th">Table Name</th>
                <th className="th">Reservation</th>
                <th className="th">Capacity</th>
                <th className="th">Status</th>
              </tr>
            </thead>
            <tbody>{tableMap}</tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
