const knex = require("../../db/connection");
const { updateStatus } = require("./reservations.controller");
const reservationsController = require("./reservations.controller");

//-------------list--------------------------
function list(date) {
  return knex("reservations")
    .select("*")
    .whereNot({ status: "finished" })
    .andWhere({ reservation_date: date })
    .orderBy("reservations.reservation_time");
}

function phoneNumberList(number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

// -----------create-------------------------
function create(newReservation) {
  return knex("reservations")
    .insert(newReservation, "*")
    .then((newR) => newR[0]);
}

//----------- read----------------------------
function read(reservation_id) {
  return knex("reservations as r")
    .select("*")
    .where({ reservation_id })
    .then((result) => result[0]);
}
// -----------update---------------------------
//updates table assignment to reservation
function update(reservation) {
  return knex("reservations")
    .where({ reservation_id: reservation.reservation_id })
    .update(reservation, "*");
}
function updateStatusInService(reservation) {
  return knex("reservations")
    .where({ reservation_id: reservation.reservation_id })
    .update(reservation);
}

// function updateStatusToFinished() {}

//-------------exports-------------------------
module.exports = {
  read,
  create,
  list,
  phoneNumberList,
  update,
  updateStatusInService,
};
