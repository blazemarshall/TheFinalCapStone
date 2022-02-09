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
function update(table) {
  console.log(table, "UPDATE TABLES SERVICE");
  // table.reservation_id = resId;

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
function destroy(table) {
  console.log(table, "destroyTablesService1010101010101");
  let pnter = table.reservation_id;
  table.reservation_id = "null";
  // return knex("tables").update(table).where({ table_id: table.table_id });
  return knex.raw(
    `update tables set reservation_id=null where table_id=${table.table_id}
    `
  );
  //  and reservation_id=${pnter}
}

// ----------------------exports---------------------------------

module.exports = {
  create,
  update,
  list,
  read,
  destroy,
};
