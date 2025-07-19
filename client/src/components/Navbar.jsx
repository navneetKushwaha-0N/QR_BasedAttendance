"use client"

import React from "react"
import { Link, useLocation } from "react-router-dom"
import { FiHome, FiUsers, FiCamera, FiClipboard, FiMenu } from "react-icons/fi"

const Navbar = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = React.useState(false)

  const navItems = [
    { path: "/", label: "Dashboard", icon: FiHome },
    { path: "/users", label: "Users", icon: FiUsers },
    { path: "/scanner", label: "QR Scanner", icon: FiCamera },
    { path: "/attendance", label: "Attendance", icon: FiClipboard },
  ]

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">QR</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Smart ID System</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    location.pathname === item.path
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:text-primary-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsOpen(!isOpen)}>
            <FiMenu size={24} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    location.pathname === item.path
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:text-primary-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
