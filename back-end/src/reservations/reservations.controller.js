/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncEB = require("../errors/asyncErrorBoundary");
const {
  DateCorrectFormat,
  isATime,
  PeopleNumber,
  hasOnlyValidProperties,
  isTuesday,
  properties,
  isPast,
  correctOpenTimes,
} = require("./middlewareValidation");

//
async function list(req, res, next) {
  try {
    let { date } = req.query;

    const data = await service.list(date);
    res.json({ data });
    // }
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

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
