import React from "react";
import ErrorAlert from "../ErrorAlert";

export default function NewReservationForm({
  changeHandlerNum,
  submitHandler,
  changeHandler,
  formData,
  apiErrors,
  history,
}) {
  return (
    <div>
      <h1>Create Reservation</h1>
      <form onSubmit={submitHandler}>
        <div>
          <div>
            <input
              // id="first_name"
              name="first_name"
              required
              type="text"
              className="form-control"
              placeholder="First name"
              aria-label="First Name"
              onChange={changeHandler}
              value={formData.first_name}
            />
          </div>
          <div>
            <input
              // id="last_name"
              name="last_name"
              required
              type="text"
              className="form-control"
              placeholder="Last Name"
              aria-label="last_name"
              onChange={changeHandler}
              value={formData.last_name}
            />
          </div>
          <div>
            <input
              // id="mobile_number"
              name="mobile_number"
              required
              type="tel"
              className="form-control"
              placeholder="Mobile Number"
              aria-label="Mobile Number"
              onChange={changeHandler}
              value={formData.mobile_number}
            />
          </div>
          <div>
            <input
              // id="reservation_date"
              name="reservation_date"
              required
              type="date"
              className="form-control"
              placeholder="Date of reservation"
              aria-label="reservation_date"
              onChange={changeHandler}
              value={formData.reservation_date}
            />
            <div>
              <input
                // id="reservation_time"
                name="reservation_time"
                required
                type="time"
                className="form-control"
                placeholder="Time of reservation"
                aria-label="reservation_time"
                onChange={changeHandler}
                value={formData.reservation_time}
              />
            </div>
            <div>
              <input
                // id="people"
                name="people"
                required
                type="number"
                className="form-control"
                placeholder="Number of People"
                aria-label="people"
                min="1"
                onChange={changeHandlerNum}
                value={formData.people}
              />
            </div>
            <ErrorAlert error={apiErrors} />
            <div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <button
                onClick={() => history.goBack()}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
