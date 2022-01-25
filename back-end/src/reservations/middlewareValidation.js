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

module.exports = {
  DateCorrectFormat,
  // isTuesday,
  isATime,
  PeopleNumber,
  hasOnlyValidProperties,
};
