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
function update(table) {
  return knex("tables").update(table, "*").where({ table_id: table.table_id });
}

function read(table_id) {
  return knex("tables")
    .select("*")
    .where({ "tables.table_id": parseInt(table_id) })
    .first();
}

function destroy(table) {
  return knex("tables")
    .where({ table_id: table.table_id })
    .update({ reservation_id: null });
}

// ----------------------exports---------------------------------

module.exports = {
  create,
  update,
  list,
  read,
  destroy,
};
