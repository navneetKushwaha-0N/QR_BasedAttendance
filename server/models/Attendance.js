import mongoose from "mongoose"

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    scanLocation: {
      type: String,
      default: "Main Entrance",
    },
    scanMethod: {
      type: String,
      enum: ["camera", "upload"],
      default: "camera",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("Attendance", attendanceSchema)
