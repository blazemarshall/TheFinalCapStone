const knex = require("../../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function create(newTable) {
  return knex("tables")
    .insert(newTable, "*")
    .then((newT) => newT[0]);
}

//update  check me
function update(updatedReservation) {
  return knex("reservations")
    .update(updatedReservation, "*")
    .where({ reservation_id: updatedReservation.reservation_id });
}

module.exports = {
  create,
  update,
  list,
};
