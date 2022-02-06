const knex = require("../../db/connection");

//-------------list--------------------------
function list(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservations.reservation_time");
}

// -----------create-------------------------
function create(newReservation) {
  return knex("reservations")
    .insert(newReservation, "*")
    .then((newR) => newR[0]);
}

//----------- read----------------------------
function read(resId) {
  return knex("reservations as r")
    .select("*")
    .where({ reservation_id: resId })
    .then((result) => result[0]);
}
// -----------update---------------------------
function update(updatedReservation, resId) {
  console.log("isitWOrking/????");
  return knex("reservations")
    .update(updatedReservation, "*")
    .where({ reservation_id: resId });
}

//-------------exports-------------------------
module.exports = {
  read,
  create,
  list,
  update,
};
