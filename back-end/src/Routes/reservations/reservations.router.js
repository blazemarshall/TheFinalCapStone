/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
const methodNotAllowed = require("../../errors/methodNotAllowed");

const router = require("express").Router();
const controller = require("./reservations.controller");

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

// router
//   .route("/:reservation_id/seat")
//   //.get(controller.read)
//   .all(methodNotAllowed);

module.exports = router;