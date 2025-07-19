import express from "express"
import {
  getAttendance,
  getRecentAttendance,
  getAttendanceByUser,
  markAttendance,
} from "../controllers/attendanceController.js"

const router = express.Router()

router.get("/", getAttendance)
router.get("/recent", getRecentAttendance)
router.get("/user/:userId", getAttendanceByUser)
router.post("/mark", markAttendance)

export default router
