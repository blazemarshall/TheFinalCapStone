const { where } = require("../db/connection");
const knex = require("../db/connection");

function list(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time");
}

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation, "*")
    .then((newR) => newR[0]);
}

module.exports = {
  create,
  list,
};
