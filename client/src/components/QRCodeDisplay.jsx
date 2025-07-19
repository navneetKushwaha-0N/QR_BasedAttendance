"use client"

import { useState, useEffect } from "react"
import { FiX, FiDownload, FiPrinter } from "react-icons/fi"
//import QRCode from "qrcode"
import QRCodeScanner from "./QRCodeScanner"

const QRCodeDisplay = ({ user, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showScanner, setShowScanner] = useState(false)
  const [scannedData, setScannedData] = useState(null)

  useEffect(() => {
    generateQRCode()
  }, [user])

  const generateQRCode = async () => {
    try {
      const qrData = JSON.stringify({
        userId: user._id,
        employeeId: user.employeeId,
        name: user.name,
        timestamp: Date.now(),
      })

      const url = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: { dark: "#000000", light: "#FFFFFF" },
      })

      setQrCodeUrl(url)
    } catch (error) {
      console.error("Error generating QR code:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const downloadQRCode = () => {
    const link = document.createElement("a")
    link.download = `qr-${user.employeeId}-${user.name.replace(/\s+/g, "-")}.png`
    link.href = qrCodeUrl
    link.click()
  }

  const printQRCode = () => {
    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${user.name}</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
            .id-card { border: 2px solid #333; border-radius: 10px; padding: 20px; max-width: 400px; margin: 0 auto; background: white; }
            .header { background: #3b82f6; color: white; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
            .qr-code { margin: 20px 0; }
            .user-info { text-align: left; margin-top: 20px; }
            .user-info p { margin: 5px 0; font-size: 14px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="id-card">
            <div class="header"><h2>Smart ID Card</h2></div>
            <img src="${qrCodeUrl}" alt="QR Code" class="qr-code" />
            <div class="user-info">
              <p><strong>Name:</strong> ${user.name}</p>
              <p><strong>Employee ID:</strong> ${user.employeeId}</p>
              <p><strong>Department:</strong> ${user.department}</p>
              <p><strong>Email:</strong> ${user.email}</p>
            </div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full relative">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">QR Code</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FiX size={24} />
            </button>
          </div>

          <div className="p-6 text-center">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <img
                    src={qrCodeUrl || "/placeholder.svg"}
                    alt="QR Code"
                    className="mx-auto border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="text-left bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{user.name}</h3>
                  <p className="text-sm text-gray-600">ID: {user.employeeId}</p>
                  <p className="text-sm text-gray-600">Department: {user.department}</p>
                  <p className="text-sm text-gray-600">Email: {user.email}</p>
                </div>

                <div className="flex space-x-2">
                  <button onClick={downloadQRCode} className="btn-secondary flex items-center space-x-2 flex-1">
                    <FiDownload size={18} />
                    <span>Download</span>
                  </button>
                  <button onClick={printQRCode} className="btn-primary flex items-center space-x-2 flex-1">
                    <FiPrinter size={18} />
                    <span>Print</span>
                  </button>
                </div>

                <button onClick={() => setShowScanner(true)} className="btn-primary w-full mt-4">
                  Start QR Scanner
                </button>
              </>
            )}

            {scannedData && (
              <div className="mt-4 text-green-600 text-sm text-left">
                <strong>Last Scanned Data:</strong>
                <pre className="bg-gray-100 p-2 mt-1 rounded text-xs break-all">{scannedData}</pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {showScanner && (
        <QRCodeScanner
          onClose={() => setShowScanner(false)}
          onScan={(data) => setScannedData(data)}
        />
      )}
    </>
  )
}

export default QRCodeDisplay
