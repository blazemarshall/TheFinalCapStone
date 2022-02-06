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
  if (table) {
    res.locals.table = table;
    next();
  }

  const data = req.body.data;
  if (!data) {
    next({
      message: "table undefined",
      status: 404,
    });
  }
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
  console.log("req.bodyVerrryfiyyyyy", req.body);
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
  console.log("resExistsTableCont");
  try {
    //reqbody undefined
    const { reservation_id } = req.body.data;
    res.locals.reservation = await resService.read(reservation_id);
    console.log(res.locals.reservation, "locals reservations");
    if (!res.locals.reservation) {
      next({
        message: `reservation_id ${reservation_id} does not exist`,
        status: 404,
      });
    }

    // res.locals.reservation = reservation;
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
function tableOccupied(req, res, next) {
  console.log(res.locals.table, "tableOccupied");
  const { reservation_id } = res.locals.table;
  if (reservation_id) {
    next({
      message: "table is occupied",
      status: 400,
    });
  }
  next();
  //   // req.body.table.reservation_id
  //   // if status = occupied return 400
}

// --------------------------------------------------------------------------------
function validateResId(req, res, next) {
  const { reservation_id } = req.body.data;
  console.log(reservation_id, "validResId cont");

  // try {
  if (!reservation_id) {
    next({
      message: `reservation_id ${reservation_id} is missing`,
      status: 400,
    });
  }
  next();
}
// catch (error) {
// console.log(error);
// next(error);
// }
// }

// --------------------------------------------------------------------------------
// --------------------------------exports-----------------------------------------
module.exports = {
  capacity,
  tableOccupied,
  resExists,
  validateResId,
  tableExists,
  capacitySize,
  tableName,
  checkCapacityOfTable,
  verifyTableDataExists,
};
