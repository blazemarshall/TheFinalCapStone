import React from "react";
import ErrorAlert from "../CommonFiles/ErrorAlert";
export default function TableForm({
  cancelHandler,
  changeHandler,
  tableSubmitHandler,
  apiTableErrors,
  numChangeHandler,
}) {
  //--------------------------------------------------
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
            maxLength="20"
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
              max="500"
              placeholder="Minimum of 1 seat."
              onChange={numChangeHandler}
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
      <ErrorAlert error={apiTableErrors} />
    </div>
  );
}
