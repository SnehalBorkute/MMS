const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

// Mark Absence Route (POST)
router.post("/mark", attendanceController.markAbsence);

//  Get Attendance Records Route (GET)
router.get("/", attendanceController.getAbsences);

  

module.exports = router;

