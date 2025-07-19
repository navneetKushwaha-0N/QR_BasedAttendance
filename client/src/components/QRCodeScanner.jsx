"use client"

import { FiX } from "react-icons/fi"
//Live QR Camera Scannerimport { QrReader } from "react-qr-reader"

const QRCodeScanner = ({ onClose, onScan }) => {
  const handleScan = (result, error) => {
    if (!!result) {
      onScan(result?.text)
      onClose()
    }
    if (!!error) {
      console.error("Scanner Error:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full relative">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Scan QR Code</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>
        <div className="p-6 text-center">
          <QrReader
            constraints={{ facingMode: "environment" }}
            onResult={handleScan}
            containerStyle={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  )
}

export default QRCodeScanner
