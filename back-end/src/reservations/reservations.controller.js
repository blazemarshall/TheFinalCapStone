/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncEB = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const {
  DateCorrectFormat,
  isATime,
  PeopleNumber,
  hasOnlyValidProperties,
  // isTuesday,
} = require("./middlewareValidation");

const validProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

const properties = hasProperties(...validProperties);

//add query for date
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
    isATime,
    // isTuesday,
    PeopleNumber,
    DateCorrectFormat,
    asyncEB(create),
  ],
};
