/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const { tableExists } = require("../tables/tables.middleWareValidation");
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
  reservationExists,
  reservationExistsForUpdate,
} = require("./reservations.middleWareValidation");

//-----------------list---------------------------------------------
async function list(req, res, next) {
  let { date } = req.query;
  const data = await service.list(date);
  res.json({ data });
}
//-----------------create-------------------------------------------

async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}
//-----------------read---------------------------------------------

//reservations id
async function read(req, res) {
  const data = await service.read(req.params.reservation_id);
  res.json({ data });
}

//----------------update--------------------------------------------

///update needs table id from table dropdown
async function update(req, res) {
  console.log("made it further");

  const { reservation_id } = res.locals.reservation;
  console.log(reservation_id, req.body.data, "looooogggggeeeed");
  // updatedReservation
  const updatedReservation = {
    table_id: req.body.data.table_id,
  };
  console.log(updatedReservation);
  await service.update(updatedReservation, reservation_id);
}
//-------------------exports----------------------------------------

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
  read: [asyncEB(reservationExists), asyncEB(read)],
  update: [reservationExistsForUpdate, asyncEB(update)],
};
