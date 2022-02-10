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
  resAlreadySeated,
} = require("./tables.middleWareValidation");
const {
  reservationExists,
} = require("../reservations/reservations.middleWareValidation");

async function list(req, res, next) {
  try {
    const data = await service.list();
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function update(req, res, next) {
  try {
    const { reservation, table } = res.locals;
    table.reservation_id = reservation.reservation_id;

    reservation.status = "seated";
    //--------saves reservationId to table------------------
    await service.update(table);
    //-------saves table assignment to reservation----------
    await resService.update(reservation, table);
    res.json({});
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
  await service.destroy(table);
  //res status updates to finished
  //grab res
  await resService.update({
    reservation_id: table.reservation_id,
    status: "finished",
  });

  //save to finished
  //update
  res.json({});
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
    resAlreadySeated,
    tableOccupied,
    checkCapacityOfTable,
    asyncEB(update),
  ],

  delete: [asyncEB(tableExists), tableNeedsToBeOccupied, asyncEB(destroy)],
};
