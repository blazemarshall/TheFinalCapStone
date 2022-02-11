import { deleteHandlerForTableResId, listTables } from "../utils/api";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";

export default function ListOfTables({ setTablesError }) {
  const [tables, setTables] = useState([]);
  let history = useHistory();

  useEffect(() => {
    function loadTables() {
      const ac = new AbortController();
      listTables(ac.signal).then(setTables).catch(setTablesError);
      return () => ac.abort();
    }

    loadTables();
  }, [setTablesError]);

  async function finishHandler(tableId, reservation_id) {
    try {
      let abortedCommand = new AbortController();
      if (
        window.confirm(
          "Is this table ready to seat new guests? This cannot be undone."
        )
      ) {
        //clear res from table
        await deleteHandlerForTableResId(
          tableId,
          reservation_id,
          abortedCommand.signal
        )
          .then(() => history.go(0))
          .catch(console.log);
      } else {
      }
    } catch (error) {
      setTablesError(error);
    }
  }

  let tableMap;
  if (tables.length) {
    tableMap = tables.map((table) => {
      return (
        <tr key={table.table_id}>
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
            ) : null}
          </td>
        </tr>
      );
    });
  }

  return (
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
      <tbody>{tableMap ? tableMap : null}</tbody>
    </table>
  );
}
