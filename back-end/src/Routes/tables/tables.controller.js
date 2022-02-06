const service = require("./tables.service");
const asyncEB = require("../../errors/asyncErrorBoundary");
const hasProperties = require("../../errors/hasProperties");
const {
  tableName,
  capacity,
  tableExists,
  verifyTableDataExists,
  checkCapacityOfTable,
  resExists,
  validateResId,
  tableOccupied,
} = require("./tables.middleWareValidation");
const {
  reservationExists,
} = require("../reservations/reservations.middleWareValidation");

// ----------------------list---------------------------------------
async function list(req, res, next) {
  try {
    const data = await service.list();
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

//---------------------create---------------------------------------
async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

//---------------------update---------------------------------------
async function update(req, res, next) {
  console.log(res.locals, "updatedCont");
  const { reservation, table } = res.locals;
  // table[reservation.reservation_id] = reservation.reservation_id;
  console.log(table, reservation.reservation_id, "LOOOK");
  const data = await service.update(reservation.reservation_id, table);
  res.json({ data });
}

//-----------------hasProperties------------------------------------
let params = ["capacity", "table_name"];
let properties = hasProperties(...params);

//------us-05--------------delete----------------------------------------
// async function destroy(req, res, next) {
//   const { reservation_id } = res.locals.reservation;
//   await service.destroy(reservation_id);
//   res.sendStatus(204);
// }

//--------------------exports---------------------------------------
module.exports = {
  list: asyncEB(list),
  create: [properties, tableName, capacity, asyncEB(create)],
  update: [
    //4
    verifyTableDataExists,
    validateResId,
    asyncEB(resExists),
    //5
    asyncEB(tableExists),
    tableOccupied,
    //6
    //7
    checkCapacityOfTable,
    //8
    asyncEB(update),
  ],

  // delete: [asyncEB(tableExists), tableOccupied, asyncEB(destroy)],
};
