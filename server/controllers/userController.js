import User from "../models/User.js"

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create new user
export const createUser = async (req, res) => {
  try {
    const { name, email, employeeId, department, position, status } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { employeeId }],
    })

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or employee ID already exists",
      })
    }

    // Create new user
    const user = new User({
      name,
      email,
      employeeId,
      department,
      position,
      status,
    })

    // Generate QR code data
    const qrData = JSON.stringify({
      userId: user._id,
      employeeId: user.employeeId,
      name: user.name,
      timestamp: Date.now(),
    })

    user.qrCode = qrData
    await user.save()

    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, email, employeeId, department, position, status } = req.body

    // Check if email or employeeId is being changed and already exists
    const existingUser = await User.findOne({
      $and: [{ _id: { $ne: req.params.id } }, { $or: [{ email }, { employeeId }] }],
    })

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or employee ID already exists",
      })
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, employeeId, department, position, status },
      { new: true, runValidators: true },
    )

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update QR code data if needed
    const qrData = JSON.stringify({
      userId: user._id,
      employeeId: user.employeeId,
      name: user.name,
      timestamp: Date.now(),
    })

    user.qrCode = qrData
    await user.save()

    res.json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json({ message: "User deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await User.distinct("department")
    res.json(departments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
