"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { FiUser, FiHash, FiBriefcase, FiCalendar } from "react-icons/fi"
import axios from "axios"
import QRCodeDisplay from "../components/QRCodeDisplay"

const UserProfile = () => {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [showQR, setShowQR] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetchUserData()
      fetchAttendanceHistory()
    }
  }, [userId])

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}`)
      setUser(response.data)
    } catch (error) {
      console.error("Error fetching user:", error)
    }
  }

  const fetchAttendanceHistory = async () => {
    try {
      const response = await axios.get(`/api/attendance/user/${userId}`)
      setAttendanceHistory(response.data)
    } catch (error) {
      console.error("Error fetching attendance history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">User not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
        <button onClick={() => setShowQR(true)} className="btn-primary">
          View QR Code
        </button>
      </div>

      {/* User Info Card */}
      <div className="card">
        <div className="flex items-center space-x-6 mb-6">
          <div className="flex-shrink-0 h-24 w-24">
            <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 font-bold text-3xl">{user.name.charAt(0)}</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
                user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {user.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FiHash className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Employee ID</p>
                <p className="text-gray-900">{user.employeeId}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FiBriefcase className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p className="text-gray-900">{user.department}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FiCalendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Joined Date</p>
                <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FiUser className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Position</p>
                <p className="text-gray-900">{user.position || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Attendance History ({attendanceHistory.length} records)
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceHistory.map((record, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(record.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(record.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Present
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {attendanceHistory.length === 0 && (
            <div className="text-center py-8 text-gray-500">No attendance records found</div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && <QRCodeDisplay user={user} onClose={() => setShowQR(false)} />}
    </div>
  )
}

export default UserProfile
