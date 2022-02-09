import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { v4 as uuid } from "uuidv4";
import {
  listTables,
  reservationGrab,
  updateIdsForTableAndRes,
} from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

//--------------------------------------------------------

export default function ReadReservation({ refresh, setRefresh, reservations }) {
  let ready = true;
  let mounted = false;
  const { reservation_id } = useParams();
  const [tableList, setTableList] = useState([]);
  const [reservation, setReservation] = useState({});
  const [tableListErrors, setTableListErrors] = useState(null);
  const initialform = {
    table_id: "",
    reservation_id: reservation_id,
  };
  const [form, setForm] = useState(initialform);
  const history = useHistory();

  //-------------------------------------------------------

  useEffect(() => {
    async function grabList() {
      const a = new AbortController();
      const ab = new AbortController();
      setTableListErrors(null);
      await listTables(a.signal).then(setTableList).catch(setTableListErrors);
      await reservationGrab(reservation_id, ab.signal).then(setReservation);

      return () => a.abort();
    }
    grabList();
  }, []);
  //-------------------------------------------------------
  //map select options
  const tableOptions = tableList?.map(
    ({ table_name, table_id, capacity }, index) => {
      return (
        <option key={table_id} id={table_id} value={table_id}>
          {table_name} - {capacity}
        </option>
      );
    }
  );

  //-------------------------------------------------------

  // const availableTables = tableList?.filter((item) => {
  //   return item.reservation_id == null;
  // });

  // const occupiedTables = tableList?.filter((item) => {
  //   return item.reservation_id != null;
  // });
  // occupiedTables?.filter((item) => {});
  // const singleTable = tableList?.filter(
  //   (table) => table.table_id == form.table_id
  // );
  async function selectSubmitHandler(e) {
    e.preventDefault();
    mounted = true;
    ready = true;
    if (mounted) {
      let abortC = new AbortController();
      let abc = new AbortController();

      try {
        await updateIdsForTableAndRes(form, abortC.signal)
          .then(setForm(initialform))
          .then(history.push("/dashboard"));
        // .then(setRefresh(!refresh));
      } catch (error) {
        setTableListErrors(error);
        console.log(error.status, "status");
        throw error;
      }
      return () => abortC.abort();
    }
  }
  // }
  // check res capacity vs table capacity
  // if (reservation.capacity > singleTable.capacity) {
  //   // throw new Error("Not enough capacity");
  //   return;
  // }
  //  else if (singleTable.reservation_id != null) {
  //   return;
  //   // throw new Error("occupied");
  // } else
  //  {
  //------------
  //-------------------------------------------------------

  async function selectChangeHandler({ target }) {
    mounted = true;
    if (mounted) {
      await setForm({ ...initialform, [target.id]: target.value });
    }
    mounted = false;
  }

  //-------------------------------------------------------
  //list of tables free
  // const filter = tableList.filter((table) => {
  //   return table.reservation_id !== null;
  // });
  const list = tableList?.map((table, index) => {
    return (
      <tr key={index + index - 1} className="tr">
        <td className="td">{table.table_name}</td>
        <td className="td">{table.table_id}</td>
        <td className="td">{table.capacity}</td>
      </tr>
    );
  });

  return (
    <div>
      <div>
        <h1>Finish MEEE! TODAY~~=~</h1>
        <div>Reservation stats</div>
        <div>{reservations}</div>
        <div>Tables</div>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Capacity</th>
            </tr>
          </thead>
          <tbody>{list}</tbody>
        </table>
      </div>
      <form onSubmit={selectSubmitHandler}>
        <label htmlFor="table_id">Table Number :</label>
        <select
          required
          onChange={selectChangeHandler}
          name="table_id"
          min="1"
          id="table_id"
        >
          <option value="">Please Select</option>
          {tableOptions}
        </select>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={selectSubmitHandler}
        >
          Submit
        </button>
        <button onClick={() => history.goBack()} className="btn btn-secondary">
          Cancel
        </button>
      </form>
      <div>
        <ErrorAlert error={tableListErrors} />
      </div>
    </div>
  );
}
