/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncEB = require("../../errors/asyncErrorBoundary");
const {
  DateCorrectFormat,
  isATime,
  PeopleNumber,
  hasOnlyValidProperties,
  isTuesday,
  properties,
  isPast,
  correctOpenTimes,
} = require("./reservations.middleWareValidation");

//
async function list(req, res, next) {
  let { date } = req.query;
  const data = await service.list(date);
  res.json({ data });
}

async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

//reservations id
// async function read(req, res) {
//   const data = await service.read(req.params.reservation_id);
//   res.json({ data });
// }

module.exports = {
  list: asyncEB(list),
  create: [
    properties,
    hasOnlyValidProperties,
    PeopleNumber,
    DateCorrectFormat,
    isATime,
    isTuesday,
    isPast,
    correctOpenTimes,
    asyncEB(create),
  ],
};
