const hasProperties = require("../errors/hasProperties");

//reservationDate is a date?
function DateCorrectFormat(req, res, next) {
  const { data: { reservation_date } = {} } = req.body;
  // const dateSplit = reservation_date.split("/");
  const regex = /\d{4}-\d{2}-\d{2}/;
  if (!regex.test(reservation_date)) {
    next({
      status: 400,
      message: "reservation_date not a number",
    });
  }
  return next();
}

//reservationTime is a time?
function isATime(req, res, next) {
  const { data: { reservation_time } = {} } = req.body;
  const arr = reservation_time.split(":");

  if (!reservation_time.includes(":")) {
    next({
      status: 400,
      message: "reservation_time requires proper time format.",
    });
  }
  next();
}

const validProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

//people is a number?
function PeopleNumber(req, res, next) {
  let { data: { people } = {} } = req.body;

  if (!people || typeof people !== "number" || people < 1) {
    return next({
      status: 400,
      message: "people in party must be a number",
    });
  }
  return next();
}

// later for reading functions
// async function reservationExists(req, res, next) {
//   const review = await service.read(req.params.Id);
//   if (review) {
//     res.locals.review = review;
//     return next();
//   }
//   next({ status: 404, message: `Review cannot be found.` });
// }

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !validProperties.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

const properties = hasProperties(...validProperties);

//------------isTuesday-------------
function isTuesday(req, res, next) {
  let reqData = req.body.data.reservation_date.split("-");

  let year = reqData[0];
  let month = reqData[1];
  let day = reqData[2];

  let reserved = new Date(year, month - 1, day);

  if (reserved.getUTCDay() === 2) {
    console.log("tues");
    return next({
      message: "The restaurant is closed on Tuesdays.",
      status: 400,
    });
  } else {
    next();
  }
}

//-----------------ReservationIsInPast?----------------
function isPast(req, res, next) {
  current = new Date();
  let date = current.getDate(),
    year = current.getFullYear(),
    dayOfWeek = current.getDay(),
    month = current.getMonth() + 1,
    reqData = req.body.data.reservation_date;
  let rDate = reqData.split("-");

  if (rDate[0] >= year || rDate[1] >= month || rDate[2] >= date) {
    next({
      message: "Reservations can only be created in the future",
      status: 400,
    });
  } else {
    next();
  }
}

module.exports = {
  DateCorrectFormat,
  isATime,
  isPast,
  isTuesday,
  PeopleNumber,
  hasOnlyValidProperties,
  properties,
};
