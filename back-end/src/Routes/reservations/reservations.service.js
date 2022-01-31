const knex = require("../../db/connection");

function list(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservations.reservation_time");
}

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation, "*")
    .then((newR) => newR[0]);
}

//read
// function read(reservation_id) {
//   return knex("reservations as r")
//     .select("*")
//     .where({ "r.reservation_id": reservation_id })
//     .first();
// }

module.exports = {
  create,
  list,
};
