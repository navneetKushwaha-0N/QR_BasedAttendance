"use client"

import { useEffect, useState } from "react"
import { FiCheckCircle, FiXCircle, FiCamera, FiStopCircle } from "react-icons/fi"
import { Html5QrcodeScanner } from "html5-qrcode"
import axios from "axios"
import toast from "react-hot-toast"

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null)
  const [scanner, setScanner] = useState(null)
  const [isScanning, setIsScanning] = useState(false)

  // ✅ Add cleanup for scanner when component unmounts
  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear().catch((err) =>
          console.error("Failed to clear scanner on unmount:", err)
        )
      }
    }
  }, [scanner])

  const startScanner = () => {
    setScanResult(null) // reset previous result
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 300, height: 300 } },
      false
    )
    html5QrcodeScanner.render(
      (decodedText) => handleScan(decodedText),
      (error) => console.error("QR Scan Error:", error)
    )
    setScanner(html5QrcodeScanner)
    setIsScanning(true)
  }

  const stopScanner = () => {
    if (scanner) {
      scanner.clear().then(() => {
        setIsScanning(false)
        setScanner(null)
      }).catch((err) => console.error("Failed to clear scanner:", err))
    }
  }

  const handleScan = async (data) => {
    stopScanner()
    toast.success(`QR scanned: ${data}`)

    try {
      const response = await axios.post("/api/qr/scan-text", { qrData: data })

      if (response.data.success) {
        setScanResult({
          success: true,
          user: response.data.user,
          message: response.data.message,
        })
      } else {
        setScanResult({
          success: false,
          message: response.data.message,
        })
      }
    } catch (error) {
      console.error("QR process error:", error)
      setScanResult({
        success: false,
        message: "Failed to process scanned QR",
      })
      toast.error("Failed to process scanned QR")
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold text-gray-900">📷 Smart QR Scanner</h1>
        {scanResult && (
          <button
            onClick={() => setScanResult(null)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Reset
          </button>
        )}
      </div>

      <div className="rounded-2xl bg-white shadow-xl p-6 space-y-6 border border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Live Camera Scanner</h2>
          {!isScanning ? (
            <button
              onClick={startScanner}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-5 py-3 rounded-full shadow-lg hover:from-blue-700 hover:to-blue-600 transition transform hover:scale-105"
            >
              <FiCamera className="w-5 h-5" /> Start Scanner
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold px-5 py-3 rounded-full shadow-lg hover:from-red-700 hover:to-red-600 transition transform hover:scale-105"
            >
              <FiStopCircle className="w-5 h-5" /> Stop Scanner
            </button>
          )}
        </div>

        <div
          id="qr-reader"
          className="w-full rounded-xl overflow-hidden border border-gray-300 transition-all duration-300 bg-gray-50"
        />

        {scanResult && (
          <div className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              {scanResult.success ? (
                <FiCheckCircle className="w-7 h-7 text-green-500 animate-pulse" />
              ) : (
                <FiXCircle className="w-7 h-7 text-red-500 animate-shake" />
              )}
              <h3 className="text-xl font-bold text-gray-900">Scan Result</h3>
            </div>

            {scanResult.success && scanResult.user ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-5 transition-all duration-300 shadow-md">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                  <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-3xl font-bold text-green-600 shadow-inner">
                    {scanResult.user.name.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-lg font-semibold text-green-900">{scanResult.user.name}</h4>
                    <p className="text-green-800">ID: {scanResult.user.employeeId}</p>
                    <p className="text-green-800">Department: {scanResult.user.department}</p>
                    <p className="text-green-800">Email: {scanResult.user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-700 font-medium">Attendance Marked</p>
                    <p className="text-xs text-green-600">{new Date().toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-5 transition-all duration-300 shadow-md">
                <p className="text-red-700 font-medium">{scanResult.message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default QRScanner
