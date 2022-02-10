import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { v4 as uuid } from "uuidv4";
import {
  listTables,
  reservationGrab,
  updateIdsForTableAndRes,
} from "../../utils/api";
import ErrorAlert from "../CommonFiles/ErrorAlert";
import SeatingForm from "../CommonFiles/SeatingForm";

//--------------------------------------------------------

export default function ReadReservation({ reservations }) {
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

  async function selectSubmitHandler(e) {
    e.preventDefault();
    mounted = true;
    ready = true;
    if (mounted) {
      let abortC = new AbortController();
      let abc = new AbortController();

      try {
        await updateIdsForTableAndRes(form, abortC.signal)
          .then(() => setForm(initialform))
          .then(() => history.push("/dashboard"));
      } catch (error) {
        setTableListErrors(error);
        console.log(error.status, "status");
        throw error;
      }
      return () => abortC.abort();
    }
  }

  //-------------------------------------------------------

  async function selectChangeHandler({ target }) {
    mounted = true;
    if (mounted) {
      await setForm({ ...initialform, [target.id]: target.value });
    }
    mounted = false;
  }

  //-------------------------------------------------------

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
      <SeatingForm
        tableOptions={tableOptions}
        selectChangeHandler={selectChangeHandler}
        selectSubmitHandler={selectSubmitHandler}
        history={history}
      />
      <div>
        <ErrorAlert error={tableListErrors} />
      </div>
    </div>
  );
}
