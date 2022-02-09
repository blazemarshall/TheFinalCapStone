const service = require("./tables.service");
const resService = require("../reservations/reservations.service");
const asyncEB = require("../../errors/asyncErrorBoundary");
const hasProperties = require("../../errors/hasProperties");
const {
  tableName,
  capacity,
  tableExists,
  verifyTableDataExists,
  checkCapacityOfTable,
  resExists,
  validateFormResId,
  tableOccupied,
  tableNeedsToBeOccupied,
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
//put goes to /tables/table_id/seat,
//  then this updates resId to table and tableId to res.
async function update(req, res, next) {
  try {
    const { reservation, table } = res.locals;
    table.reservation_id = reservation.reservation_id;
    //--------saves reservationId to table------------------
    await service.update(table);
    //-------saves table assignment to reservation----------
    await resService.update(reservation, table);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
  }
}

//-----------------hasProperties------------------------------------
let params = ["capacity", "table_name"];
let properties = hasProperties(...params);

//------us-05--------------delete-----------------------------------
async function destroy(req, res, next) {
  const { table } = res.locals;
  // const { status } = req.body.data;
  // reservation.status = status;

  // await resService.updateStatusInService(reservation);
  await service.destroy(table);
  res.sendStatus(200);
}

//--------------------exports---------------------------------------
module.exports = {
  list: asyncEB(list),
  create: [properties, tableName, capacity, asyncEB(create)],
  update: [
    verifyTableDataExists,
    asyncEB(tableExists),
    asyncEB(resExists),
    validateFormResId,
    tableOccupied,
    checkCapacityOfTable,
    asyncEB(update),
  ],

  delete: [
    asyncEB(tableExists),
    // asyncEB(resExists),
    tableNeedsToBeOccupied,
    asyncEB(destroy),
  ],
};
