"use client"

import { useState, useEffect } from "react"
import { FiPlus, FiEdit2, FiTrash2, FiEye } from "react-icons/fi"
import axios from "axios"
import toast from "react-hot-toast"
import UserModal from "../components/UserModal"
import QRCodeDisplay from "../components/QRCodeDisplay"

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showQR, setShowQR] = useState(false)
  const [qrUser, setQrUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users")
      setUsers(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      toast.error("Failed to fetch users")
      console.error("Error fetching users:", error)
    }
  }

  const handleAddUser = () => {
    setSelectedUser(null)
    setIsModalOpen(true)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/api/users/${userId}`)
        toast.success("User deleted successfully")
        fetchUsers()
      } catch (error) {
        toast.error("Failed to delete user")
        console.error("Error deleting user:", error)
      }
    }
  }

  const handleViewQR = (user) => {
    setQrUser(user)
    setShowQR(true)
  }

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase()
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.employeeId?.toLowerCase().includes(search)
    )
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-extrabold text-gray-900">👥 User Management</h1>
        <button
          onClick={handleAddUser}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-5 py-3 rounded-full shadow-md hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105"
        >
          <FiPlus size={18} />
          <span>Add User</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white shadow rounded-lg p-4 border border-gray-100 transition hover:shadow-md">
        <input
          type="text"
          placeholder="🔍 Search users by name, email, or employee ID..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100 transition hover:shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-inner">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{user.name || "Unknown"}</div>
                        <div className="text-sm text-gray-500">{user.email || "No email"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.employeeId || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.department || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status || "inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleViewQR(user)}
                        className="text-blue-600 hover:text-blue-800 transition transform hover:scale-110"
                        title="View QR Code"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-800 transition transform hover:scale-110"
                        title="Edit User"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-800 transition transform hover:scale-110"
                        title="Delete User"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">No users found</div>
          )}
        </div>
      </div>

      {/* User Modal */}
      {isModalOpen && (
        <UserModal
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            setIsModalOpen(false)
            fetchUsers()
          }}
        />
      )}

      {/* QR Code Modal */}
      {showQR && qrUser && (
        <QRCodeDisplay
          user={qrUser}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  )
}

export default UserManagement
