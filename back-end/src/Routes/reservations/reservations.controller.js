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
} = require("./reservations.middleWareValidation");

//-----------------list---------------------------------------------
async function list(req, res, next) {
  try {
    if (req.query.mobile_number) {
      const data = await service.phoneNumberList(req.query.mobile_number);
      if (!data) {
        throw new Error("No reservations found");
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
//make phone list
// async function

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
  const { reservation } = res.locals;
  await service.update(
    reservation,
    reservation.reservation_id,
    req.body.data.status
  );
  res.sendStatus(200);
  // res.json({ data: { status: reservation.status } });
}
async function updatedStatus(req, res) {
  const { status } = req.body.data;
  const { reservation } = res.locals;
  reservation.status = status;
  await service.updateStatusInService(reservation);
  res.sendStatus(200);
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
  update: [reservationExistsForUpdate, asyncEB(update)],
  //updates status assignment
  updateStatus: [
    reservationExists,
    statusCheckReservation,
    statusCheckReq,
    asyncEB(updatedStatus),
  ],
};
