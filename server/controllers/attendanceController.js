import Attendance from "../models/Attendance.js"
import User from "../models/User.js"

// Get all attendance records
export const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("user", "name email employeeId department")
      .sort({ timestamp: -1 })
    res.json(attendance)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get recent attendance (last 10 records)
export const getRecentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("user", "name email employeeId department")
      .sort({ timestamp: -1 })
      .limit(10)

    const formattedAttendance = attendance.map((record) => ({
      userName: record.user?.name,
      userEmail: record.user?.email,
      timestamp: record.timestamp,
    }))

    res.json(formattedAttendance)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get attendance by user ID
export const getAttendanceByUser = async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.params.userId }).sort({ timestamp: -1 })
    res.json(attendance)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Mark attendance
export const markAttendance = async (req, res) => {
  try {
    const { userId, scanMethod = "camera" } = req.body

    // Check if user exists
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if user is active
    if (user.status !== "active") {
      return res.status(400).json({ message: "User is not active" })
    }

    // Check if attendance already marked today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const existingAttendance = await Attendance.findOne({
      user: userId,
      timestamp: {
        $gte: today,
        $lt: tomorrow,
      },
    })

    if (existingAttendance) {
      return res.status(400).json({
        message: "Attendance already marked for today",
        user: user,
      })
    }

    // Create attendance record
    const attendance = new Attendance({
      user: userId,
      scanMethod,
    })

    await attendance.save()

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      user: user,
      attendance: attendance,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
