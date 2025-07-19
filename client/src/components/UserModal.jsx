"use client"

import { useState, useEffect } from "react"
import { FiX } from "react-icons/fi"
import axios from "axios"
import toast from "react-hot-toast"

const UserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeId: "",
    department: "",
    position: "",
    status: "active",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        employeeId: user.employeeId || "",
        department: user.department || "",
        position: user.position || "",
        status: user.status || "active",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (user) {
        // Update existing user
        await axios.put(`/api/users/${user._id}`, formData)
        toast.success("User updated successfully")
      } else {
        // Create new user
        await axios.post("/api/users", formData)
        toast.success("User created successfully")
      }
      onSave()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save user")
      console.error("Error saving user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{user ? "Edit User" : "Add New User"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Software Engineer, Manager"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="input-field">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn-primary flex-1">
              {isLoading ? "Saving..." : user ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserModal
