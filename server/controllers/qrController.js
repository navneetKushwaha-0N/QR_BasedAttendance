import Jimp from "jimp"
import jsQR from "jsqr"
import User from "../models/User.js"

// Scan QR code from uploaded image
export const scanQRCode = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      })
    }

    // Read the uploaded image
    const image = await Jimp.read(req.file.buffer)
    const { data, width, height } = image.bitmap

    // Convert to format expected by jsQR
    const code = jsQR(new Uint8ClampedArray(data), width, height)

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "No QR code found in image",
      })
    }

    // Parse QR code data
    let qrData
    try {
      qrData = JSON.parse(code.data)
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid QR code format",
      })
    }

    // Verify user exists
    const user = await User.findById(qrData.userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Verify QR code belongs to user
    if (user.employeeId !== qrData.employeeId) {
      return res.status(400).json({
        success: false,
        message: "Invalid QR code",
      })
    }

    // Mark attendance
    const attendanceResult = await markAttendanceInternal(user._id, "upload")

    if (attendanceResult.success) {
      res.json({
        success: true,
        message: "QR code scanned and attendance marked successfully",
        user: user,
      })
    } else {
      res.status(400).json({
        success: false,
        message: attendanceResult.message,
        user: user,
      })
    }
  } catch (error) {
    console.error("QR scan error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to process QR code",
    })
  }
}

// Internal function to mark attendance
const markAttendanceInternal = async (userId, scanMethod = "camera") => {
  try {
    // Check if user exists
    const user = await User.findById(userId)
    if (!user) {
      return { success: false, message: "User not found" }
    }

    // Check if user is active
    if (user.status !== "active") {
      return { success: false, message: "User is not active" }
    }

    // Check if attendance already marked today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const Attendance = (await import("../models/Attendance.js")).default
    const existingAttendance = await Attendance.findOne({
      user: userId,
      timestamp: {
        $gte: today,
        $lt: tomorrow,
      },
    })

    if (existingAttendance) {
      return {
        success: false,
        message: "Attendance already marked for today",
      }
    }

    // Create attendance record
    const attendance = new Attendance({
      user: userId,
      scanMethod,
    })

    await attendance.save()

    return {
      success: true,
      message: "Attendance marked successfully",
      attendance: attendance,
    }
  } catch (error) {
    return { success: false, message: error.message }
  }
}
