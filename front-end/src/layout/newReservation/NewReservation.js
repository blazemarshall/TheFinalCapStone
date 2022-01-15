import React, { useState } from "react";

export default function NewReservation() {
  const initialReservationFields = {
    firstName: "",
    lastName: "",
    mobileNumber: "",
    reservationDate: "",
    reservationTime: "",
    numberOfPeople: "",
  };
  const [formData, setFormData] = useState(initialReservationFields);

  const changeHandler = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };
  const submitHandler = (e) => {
    e.preventDefault();

    // let destination = "";
    // create need functionalitity
  };

  return (
    <div>
      <h1>Create Reservation</h1>
      <form>
        <div>
          <div className="row">
            <input
              name="first_name"
              required
              type="text"
              className="form-control"
              placeholder="First name"
              aria-label="First Name"
              onChange={changeHandler}
            />
          </div>
          <div>
            <input
              name="last_name"
              required
              type="text"
              className="form-control"
              placeholder="Last Name"
              aria-label="Last name"
              onChange={changeHandler}
            />
          </div>
          <div>
            <input
              name="mobile_number"
              required
              type="tel"
              className="form-control"
              placeholder="Mobile Number"
              aria-label="Mobile Number"
              onChange={changeHandler}
            />
          </div>
          <div>
            <input
              name="reservation_date"
              required
              type="date"
              className="form-control"
              placeholder="Date of reservation"
              aria-label="reservation_date"
              onChange={changeHandler}
            />
            <div>
              <input
                name="reservation_time"
                required
                type="time"
                className="form-control"
                placeholder="Time of reservation"
                aria-label="reservation_time"
                onChange={changeHandler}
              />
            </div>
            <div>
              <input
                name="people"
                required
                type="number"
                className="form-control"
                placeholder="Number of People"
                aria-label="people"
                min="1"
                onChange={changeHandler}
              />
            </div>

            <button type="submit" class="btn btn-primary">
              Submit
            </button>
            <button type="button" class="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
