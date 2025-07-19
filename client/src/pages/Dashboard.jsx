"use client"

import { useState, useEffect } from "react"
import { FiUsers, FiUserCheck, FiCalendar, FiTrendingUp } from "react-icons/fi"
import axios from "axios"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    todayAttendance: 0,
    totalAttendance: 0,
    activeUsers: 0,
  })
  const [recentAttendance, setRecentAttendance] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, attendanceRes] = await Promise.all([
        axios.get("/api/dashboard/stats"),
        axios.get("/api/attendance/recent"),
      ])
      setStats(statsRes.data)
      setRecentAttendance(Array.isArray(attendanceRes.data) ? attendanceRes.data : [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setRecentAttendance([])
    }
  }

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`rounded-2xl shadow-lg p-6 border border-gray-100 bg-white hover:shadow-xl transition-transform transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color} shadow-md`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-4xl font-extrabold text-gray-900">📊 Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={FiUsers} color="bg-blue-500" />
        <StatCard title="Today's Attendance" value={stats.todayAttendance} icon={FiUserCheck} color="bg-green-500" />
        <StatCard title="Total Attendance" value={stats.totalAttendance} icon={FiCalendar} color="bg-purple-500" />
        <StatCard title="Active Users" value={stats.activeUsers} icon={FiTrendingUp} color="bg-orange-500" />
      </div>

      {/* Recent Attendance */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 transition hover:shadow-2xl">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">🕒 Recent Attendance</h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(recentAttendance) && recentAttendance.length > 0 ? (
                recentAttendance.map((record, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-inner">
                          {record.userName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{record.userName || "Unknown User"}</div>
                          <div className="text-sm text-gray-500">{record.userEmail || "No email"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Present
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center py-8 text-gray-500" colSpan="3">
                    No recent attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
