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
function read(resId) {
  return knex("reservations as r")
    .select("*")
    .where({ reservation_id: resId })
    .then((result) => result[0]);
}
// -----------update---------------------------
//status identifier decides if seated or finished is saved for res status.
// if (status === "seated") {
//   reservation.status = "seated";
// }
// if (status === "finished") {
//   reservation.status = "finished";
// }
//updates table assignment to reservation
function update(reservation, table) {
  // reservation.table_id = table.table_id;
  return knex("reservations")
    .update(reservation, "*")
    .where({ reservation_id: reservation.reservation_id });
}
function updateStatusInService(reservation) {
  console.log("Madie it to res serviceupdate");
  return knex("reservations")
    .update(reservation)
    .where({ reservation_id: reservation.reservation_id });
}

function updateStatusToFinished() {}

//-------------exports-------------------------
module.exports = {
  read,
  create,
  list,
  phoneNumberList,
  update,
  updateStatusInService,
};
