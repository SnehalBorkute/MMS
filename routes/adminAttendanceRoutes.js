
const express = require("express");
const router = express.Router();
const adminAttendanceController = require("../controllers/adminAttendanceController");

// View today's absentees
router.get("/today", adminAttendanceController.viewTodayAttendance);

// View individual student's absence history
router.get("/history/:id", adminAttendanceController.viewStudentHistory);

  
module.exports = router;
