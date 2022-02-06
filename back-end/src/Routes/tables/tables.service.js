const { table } = require("../../db/connection");
const knex = require("../../db/connection");

// ------------------------list----------------------------------
function list() {
  return knex("tables").select("*").orderBy("table_name");
}

// -----------------------create---------------------------------
function create(newTable) {
  return knex("tables")
    .insert(newTable, "*")
    .then((newT) => newT[0]);
}

// ----------------------update----------------------------------
//update  check me
function update(resId, table) {
  table.reservation_id = resId;

  console.log(resId, table.reservation_id, "made it to update service");
  return knex("tables").update(table, "*").where({ table_id: table.table_id });
}

// ----------------------read-----------------------------------
function read(table_id) {
  return knex("tables")
    .select("*")
    .where({ "tables.table_id": parseInt(table_id) })
    .first();
}

// ----------------------destroy---------------------------------
function destroy(statusNull, table) {
  //update is better. Yeah, I said it.
  return knex("tables").update(statusNull).where({ status: table.status });
}

// ----------------------exports---------------------------------

module.exports = {
  create,
  update,
  list,
  read,
};
