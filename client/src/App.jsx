import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
import UserManagement from "./pages/UserManagement"
import QRScanner from "./pages/QRScanner"
import AttendanceLogs from "./pages/AttendanceLogs"
import UserProfile from "./pages/UserProfile"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/scanner" element={<QRScanner />} />
            <Route path="/attendance" element={<AttendanceLogs />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
