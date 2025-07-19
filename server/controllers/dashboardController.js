import User from "../models/User.js"
import Attendance from "../models/Attendance.js"

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments()

    // Get active users
    const activeUsers = await User.countDocuments({ status: "active" })

    // Get today's attendance
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayAttendance = await Attendance.countDocuments({
      timestamp: {
        $gte: today,
        $lt: tomorrow,
      },
    })

    // Get total attendance
    const totalAttendance = await Attendance.countDocuments()

    res.json({
      totalUsers,
      activeUsers,
      todayAttendance,
      totalAttendance,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
