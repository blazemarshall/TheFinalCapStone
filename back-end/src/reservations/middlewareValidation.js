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

// later for reading individual reservations
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
  let current = new Date();

  let reqData = req.body.data.reservation_date,
    rDate = reqData.split("-");

  resDate = new Date(Number(rDate[0]), Number(rDate[1]), Number(rDate[2]));
  if (current.getTime() > resDate.getTime()) {
    next({
      message: "Reservations can only be created in the future",
      status: 400,
    });
  } else {
    console.log("works");
    next();
  }
}
// --------------reservation times are correct?------------------------
function correctOpenTimes(req, res, next) {
  let rTime = req.body.data.reservation_time.split(":");

  console.log(rTime, "rTime");
  let current = new Date(),
    hours = current.getHours(),
    minutes = current.getMinutes(),
    rHours = rTime[0],
    rMins = rTime[1],
    rNumber = rHours + rMins,
    cNumber = hours + minutes;

  //if before 10:30 am
  if (Number(rNumber) < 1030) {
    next({
      message: "before 10:30am restaurant is closed.",
      status: 400,
    });
  }
  //if after 930 pm
  if (Number(rNumber) > 2130) {
    next({
      message:
        "Cannot make reservations after 9:30. Restaurant closes at 10:30pm.",
      status: 400,
    });
  }

  //if time is past or less than current time
  if (rNumber < cNumber) {
    next({
      message: "cannot make reservations in the past",
      status: 400,
    });
  }
  next();
}

module.exports = {
  DateCorrectFormat,
  isATime,
  isPast,
  isTuesday,
  PeopleNumber,
  hasOnlyValidProperties,
  properties,
  correctOpenTimes,
};
