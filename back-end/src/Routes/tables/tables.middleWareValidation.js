//---------post===================

//---------tablename------check to see if I work-------------
function tableName(req, res, next) {
  if (!req.body.data) {
    next({
      message: "tableName is missing",
      status: 400,
    });
  }

  const { table_name } = req.body.data;
  console.log(table_name, "table_name in tableNamefunct");
  //if data missing
  //if table name missing
  // if tablename empty
  if (!table_name) {
    console.log("!tablename");
    next({
      message: "must have a table_name",
      status: 400,
    });
  }
  if (table_name.length < 2) {
    console.log("tableName.length is less than 2");
    // if table name is one char
    next({
      message: "table_name must be at least 2 chars",
      status: 400,
    });
  }
  next();
}

//-----------capacity----------------

function capacity(req, res, next) {
  const { capacity } = req.body.data;
  console.log(capacity, "capacityfunction");

  //if capacity is missing
  // if capacity is zero
  if (!capacity) {
    console.log("if capacity null or falsey");
    next({
      message: "must have a capacity",
      status: 400,
    });
  }
  next();
}
function capacityANumber(req, res, next) {
  //if capacity NAN
  if (typeof Number(capacity) == NaN) {
    console.log("ln 45 , NotNumber", capacity);
    next({
      message: "capacity must be a number",
      status: 400,
    });
  }
  next();
}

function capacitySize(req, res, next) {
  const { capacity } = req.body.data;
  console.log(capacity, "capacitySizeFunction");
  next();
}

// =========get=====================
//200 for existing id for read
function tableExists(req, res, next) {
  console.log("tableExists funct");
  next();
}

//========put=========================

//returns 400 if data missing
//400 if resvation id is missing
//404 if res id doesnt exist
//200 if table has enough capacity
//400 if table not enough capacity
//400 if table is occupied

module.exports = {
  capacity,
  tableExists,
  capacitySize,
  tableName,
  capacityANumber,
};
