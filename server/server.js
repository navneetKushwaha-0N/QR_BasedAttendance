import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import attendanceRoutes from "./routes/attendanceRoutes.js"
import qrRoutes from "./routes/qrRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/users", userRoutes)
app.use("/api/attendance", attendanceRoutes)
app.use("/api/qr", qrRoutes)
app.use("/api/dashboard", dashboardRoutes)

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/qr-smart-id", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("MongoDB connection error:", error))

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
