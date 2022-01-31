// const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");
const service = require("./tables.service");
const asyncEB = require("../../errors/asyncErrorBoundary");
const hasProperties = require("../../errors/hasProperties");
const {
  tableName,
  capacity,
  tableExists,
  capacityANumber,
} = require("./tables.middleWareValidation");

async function list(req, res, next) {
  try {
    const data = await service.list();
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  console.log("createFunct cntrllr,req,body.data", req.body.data);
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

//update function
async function update(req, res, next) {
  //   const updatedTable = {
  //     ...req.body.data,
  //     table_id: res.locals.something,
  //     capacity:
  // };
  const table = await service.update(updatedTable);
  res.json({ data: table });
}
let params = ["capacity", "table_name"];

let properties = hasProperties(...params);

module.exports = {
  list: asyncEB(list),
  post: [properties, tableName, capacity, capacityANumber, asyncEB(create)],
  // update: [tableExists, asyncEB(update)],
};
