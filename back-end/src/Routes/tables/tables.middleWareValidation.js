const service = require("./tables.service");
const resService = require("../reservations/reservations.service");
// =============post===================

//---------tablename-------------
function tableName(req, res, next) {
  //if no req.body
  if (!req.body.data) {
    next({
      message: "tableName is missing",
      status: 400,
    });
  }

  const { table_name } = req.body.data;

  //if data missing, table name missing, tablename empty
  if (!table_name) {
    next({
      message: "must have a table_name",
      status: 400,
    });
  }
  // if table name is one character
  if (table_name.length < 2) {
    next({
      message: "table_name must be at least 2 chars",
      status: 400,
    });
  }
  next();
}

//-----------------capacity----------------------------

function capacity(req, res, next) {
  const { capacity } = req.body.data;

  //if capacity is falsey
  if (!Number(capacity)) {
    next({
      message: "must have a capacity",
      status: 400,
    });
  }
  //if not a number
  if (typeof capacity !== "number") {
    next({
      message: "capacity is not a number",
      status: 400,
    });
  }
  next();
}
//if table size is adequate.
function capacitySize(req, res, next) {
  const { capacity } = req.body.data;
  next();
}

// =========get=====================
//200 for existing id for read
//fix me

async function tableExists(req, res, next) {
  const table = await service.read(req.params.table_id);
  if (!table) {
    next({
      message: `table ${req.params.table_id} does not exist`,
      status: 404,
    });
  }
  res.locals.table = table;
  next();
}
// async function findTable(req, res, next) {
//   const table = await service.read();
//   if (table) {
//     res.locals.table = table;
//   }
// }

//========put=========================

//returns 400 if data missing
function verifyTableDataExists(req, res, next) {
  if (!req.body.data) {
    next({
      message: "data is missing",
      status: 400,
    });
  }
  next();
}

//400 if reservation id is missing
//404 if res id doesnt exist
//resExists found in tablecontrollerExport

async function resExists(req, res, next) {
  try {
    const { reservation_id } = req.body.data;
    if (!reservation_id) {
      next({
        message: "must have a reservation_id",
        status: 400,
      });
    }
    res.locals.reservation = await resService.read(reservation_id);
    if (!res.locals.reservation) {
      next({
        message: `reservation_id ${reservation_id} does not exist`,
        status: 404,
      });
    }
    next();
  } catch (error) {
    throw error;
  }
}

//200 if table has enough capacity
//400 if table not enough capacity
function checkCapacityOfTable(req, res, next) {
  let tableCapacity = res.locals.table.capacity;
  let peopleAmount = res.locals.reservation.people;
  if (peopleAmount > tableCapacity) {
    next({
      message: "table has insufficient capacity",
      status: 400,
    });
  }
  next();
}
//400 if table is occupied
//us-5
//for update
function tableOccupied(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (reservation_id) {
    next({
      message: "table is occupied",
      status: 400,
    });
  }
  next();
}

//for delete
function tableNeedsToBeOccupied(req, res, next) {
  if (res.locals.table.reservation_id === null) {
    next({
      message: "not occupied",
      status: 400,
    });
  }
  next();
}

// --------------------------------------------------------------------------------
function validateFormResId(req, res, next) {
  const { reservation_id } = req.body.data;

  // try {
  if (!reservation_id) {
    next({
      message: `reservation_id ${reservation_id} is missing`,
      status: 400,
    });
  }
  next();
}

// --------------------------------exports-----------------------------------------
module.exports = {
  capacity,
  tableOccupied,
  resExists,
  validateFormResId,
  tableExists,
  capacitySize,
  tableName,
  checkCapacityOfTable,
  verifyTableDataExists,
  tableNeedsToBeOccupied,
};
