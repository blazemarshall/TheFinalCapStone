import React, { useEffect, useState } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import {
  deleteHandlerForResStatus,
  deleteHandlerForTableResId,
  listReservations,
  listTables,
  updateSeatedStatusForRes,
} from "../utils/api";
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
function Dashboard({ dateParam, tables, setTables, refresh, setRefresh }) {
  let mounted = false;
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const history = useHistory();
  const query = useQuery();
  const [reservations, setReservations] = useState([]);
  const [date, setDate] = useState(query.get("date") || dateParam);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [error, setError] = useState(null);
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
  }, [date, refresh]);
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
  const reserveMap = reservations
    // ?.filter((item) => {
    //   return item.status != "finished";
    // })

    .map((item, index) => {
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
          <td className="td" data-reservation-id-status={reservation_id}>
            {status}
          </td>
          <td className="td">
            {status === "booked" ? (
              <button
                onClick={() => seatHandler(reservation_id)}
                href={`/reservations/${reservation_id}/seat`}
                className="btn-success btn"
              >
                Seat
              </button>
            ) : (
              <div></div>
            )}
          </td>
        </tr>
      );
    });

  // maps tables--------------------------------------------
  console.log(tables, "TABLES DASH");
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
        <td>
          {table.reservation_id ? (
            <button
              className="btn btn-danger"
              onClick={() =>
                finishHandler(table.table_id, table.reservation_id)
              }
              data-table-id-finish={table.table_id}
            >
              Finish
            </button>
          ) : (
            <div></div>
          )}
        </td>
      </tr>
    );
  });
  //------------------------------------------------------------------
  // us-05 seat handler
  async function seatHandler(resId, table) {
    let acc = new AbortController();
    console.log("Seat was clicked");
    let status = "seated";
    console.log(resId, "RES ID");
    //   //when clicked set status to seated
    await updateSeatedStatusForRes(resId, acc.signal).then(
      history.push(`/reservations/${resId}/seat`)
    );
  }

  //finishHandler
  async function finishHandler(tableId, reservation_id) {
    console.log(tableId, reservation_id, "finishHandler");
    mounted = true;
    if (mounted) {
      try {
        let abortedCommand = new AbortController();
        let ac = new AbortController();
        if (
          window.confirm(
            "Is this table ready to seat new guests? This cannot be undone."
          )
        ) {
          await deleteHandlerForTableResId(
            tableId,
            reservation_id,
            abortedCommand.signal
          ).catch(console.log);
          console.log("does it make it past tableResID?????");
          // await deleteHandlerForResStatus(reservation_id, ac.signal).then(
          // setRefresh(!refresh);
          // );
          // .then(history.go(0));
        } else {
        }
      } catch (error) {
        setError(error);
      }
      mounted = false;
    }
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
