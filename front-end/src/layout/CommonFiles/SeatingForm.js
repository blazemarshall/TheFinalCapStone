import React from "react";

export default function SeatingForm({
  selectChangeHandler,
  selectSubmitHandler,
  history,
  tableOptions,
}) {
  return (
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
  );
}
