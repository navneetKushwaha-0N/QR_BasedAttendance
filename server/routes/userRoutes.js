import express from "express"
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getDepartments,
} from "../controllers/userController.js"

const router = express.Router()

router.get("/", getUsers)
router.get("/departments", getDepartments)
router.get("/:id", getUserById)
router.post("/", createUser)
router.put("/:id", updateUser)
router.delete("/:id", deleteUser)

export default router
