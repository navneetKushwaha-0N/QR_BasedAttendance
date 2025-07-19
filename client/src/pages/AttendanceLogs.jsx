"use client"

import { useState, useEffect } from "react"
import { FiDownload, FiFilter } from "react-icons/fi"
import axios from "axios"
import toast from "react-hot-toast"

const AttendanceLogs = () => {
  const [attendanceData, setAttendanceData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    department: "",
    searchTerm: "",
  })
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchAttendanceData()
    fetchDepartments()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [attendanceData, filters])

  const fetchAttendanceData = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("/api/attendance")
      setAttendanceData(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      toast.error("Failed to fetch attendance data")
      console.error("Error fetching attendance:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("/api/users/departments")
      setDepartments(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error("Error fetching departments:", error)
      setDepartments([])
    }
  }

  const applyFilters = () => {
    let filtered = [...attendanceData]

    if (filters.startDate) {
      filtered = filtered.filter((record) => new Date(record.timestamp) >= new Date(filters.startDate))
    }
    if (filters.endDate) {
      filtered = filtered.filter((record) => new Date(record.timestamp) <= new Date(filters.endDate + "T23:59:59"))
    }
    if (filters.department) {
      filtered = filtered.filter((record) => record.user?.department === filters.department)
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (record) =>
          record.user?.name?.toLowerCase().includes(searchLower) ||
          record.user?.employeeId?.toLowerCase().includes(searchLower) ||
          record.user?.email?.toLowerCase().includes(searchLower),
      )
    }

    setFilteredData(filtered)
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const exportToCSV = () => {
    const headers = ["Name", "Employee ID", "Department", "Email", "Date", "Time"]
    const csvData = filteredData.map((record) => [
      record.user?.name || "N/A",
      record.user?.employeeId || "N/A",
      record.user?.department || "N/A",
      record.user?.email || "N/A",
      new Date(record.timestamp).toLocaleDateString(),
      new Date(record.timestamp).toLocaleTimeString(),
    ])

    const csvContent = [headers, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendance-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      department: "",
      searchTerm: "",
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Attendance Logs</h1>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
          disabled={filteredData.length === 0}
        >
          <FiDownload size={18} />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <FiFilter className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              className="input-field border rounded-lg px-3 py-2 w-full focus:outline-primary-500"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              className="input-field border rounded-lg px-3 py-2 w-full focus:outline-primary-500"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
            <select
              className="input-field border rounded-lg px-3 py-2 w-full focus:outline-primary-500"
              value={filters.department}
              onChange={(e) => handleFilterChange("department", e.target.value)}
            >
              <option value="">All Departments</option>
              {Array.isArray(departments) &&
                departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Name, ID, or Email"
              className="input-field border rounded-lg px-3 py-2 w-full focus:outline-primary-500"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={clearFilters}
            className="text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Attendance Records ({filteredData.length})</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((record, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                          {record.user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{record.user?.name || "Unknown User"}</div>
                          <div className="text-xs text-gray-500">{record.user?.email || "No email"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {record.user?.employeeId || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {record.user?.department || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      <div>
                        <div>{new Date(record.timestamp).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{new Date(record.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Present
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredData.length === 0 && !isLoading && (
              <div className="text-center py-8 text-gray-500">No attendance records found</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AttendanceLogs
