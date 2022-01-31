import React from "react";
import ErrorAlert from "../ErrorAlert";
export default function TableForm({
  cancelHandler,
  changeHandler,
  tableSubmitHandler,
  apiTableErrors,
}) {
  console.log("TableForm");
  return (
    <div>
      <h1>Create Table</h1>
      <form onSubmit={tableSubmitHandler}>
        <label htmlFor="table_name">Table</label>
        <div>
          <input
            required
            name="table_name"
            type="text"
            placeholder="Minimum of 2 characters."
            minLength="2"
            onChange={changeHandler}
          />
        </div>
        <div>
          <label htmlFor="capacity">Capacity</label>
          <div>
            <input
              required
              name="capacity"
              type="number"
              min="1"
              placeholder="Minimum of 1 seat."
              onChange={changeHandler}
            />
          </div>
        </div>

        <div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button className="btn btn-secondary" onClick={cancelHandler}>
            Cancel
          </button>
        </div>
      </form>
      {/* <div> */}
      <ErrorAlert error={apiTableErrors} />
      {/* </div> */}
    </div>
  );
}
