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
  statusCheck,
  statusCheckReq,
  statusCheckReservation,
  unknownStatus,
} = require("./reservations.middleWareValidation");

//-----------------list---------------------------------------------
async function list(req, res, next) {
  try {
    if (req.query.mobile_number) {
      const data = await service.phoneNumberList(req.query.mobile_number);
      if (!data) {
        next({ message: "No reservations found", status: 400 });
      }
      res.json({ data });
    } else {
      const data = await service.list(req.query.date);
      res.json({ data });
    }
  } catch (error) {
    next(error);
  }
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
async function update(req, res) {
  const reservation = req.body.data;
  await service.update(reservation);
  res.status(200).json({ data: reservation });
}
async function updatedStatus(req, res) {
  const { status } = req.body.data;
  const { reservation } = res.locals;
  reservation.status = status;
  await service.updateStatusInService(reservation);
  res.status(200).json({ data: { status: status } });
}
//-------------------exports----------------------------------------

module.exports = {
  list: [asyncEB(list)],
  create: [
    properties,
    statusCheckReq,
    PeopleNumber,
    DateCorrectFormat,
    isATime,
    isTuesday,
    isPast,
    correctOpenTimes,
    asyncEB(create),
  ],
  read: [asyncEB(reservationExists), asyncEB(read)],
  //updates seat assignment
  update: [
    asyncEB(reservationExists),
    properties,
    DateCorrectFormat,
    PeopleNumber,
    isATime,
    asyncEB(update),
  ],
  //updates status assignment
  updateStatus: [
    asyncEB(reservationExists),
    statusCheckReservation,
    unknownStatus,
    asyncEB(updatedStatus),
  ],
};
