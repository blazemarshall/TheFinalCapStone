import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  listTables,
  updateResIdForTable,
  updateTableIdForRes,
} from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

//--------------------------------------------------------

export default function ReadReservation() {
  const { reservation_id } = useParams();
  const [tableList, setTableList] = useState([]);
  const [tableListErrors, setTableListErrors] = useState(null);
  let mounted = false;
  const initialform = {
    table_id: "",
    reservation_id: reservation_id,
  };
  console.log(reservation_id, "resId 2");

  const [form, setForm] = useState(initialform);
  const history = useHistory();

  //-------------------------------------------------------

  useEffect(() => {
    async function grabList() {
      const ac = new AbortController();
      setTableListErrors(null);
      await listTables(ac.signal).then(setTableList).catch(setTableListErrors);
      return () => ac.abort();
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

  //updates table to reservation
  async function selectSubmitHandler(e) {
    mounted = true;
    let abortC = new AbortController();
    e.preventDefault();
    //------------
    try {
      if (!form.table_id) return new Error("Please Fill out");

      await updateResIdForTable(form, abortC.signal).catch(setTableListErrors);
      await updateTableIdForRes(form, abortC.signal).catch(setTableListErrors);
      //refresh dashboard
    } catch (error) {
      setTableListErrors(error);
      console.log(error.status, "status");
      throw error;
    }
    //--------------
    if (mounted) {
      await setForm(initialform);
    }
    mounted = false;
    history.push("/dashboard");
    return () => abortC.about();
  }

  //-------------------------------------------------------

  async function selectChangeHandler({ target }) {
    await setForm({ ...initialform, [target.id]: target.value });
  }

  //-------------------------------------------------------

  return (
    <div>
      <div>
        <h1>Finish MEEE! TODAY~~~</h1>
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
