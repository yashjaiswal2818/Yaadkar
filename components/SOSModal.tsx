'use client';

import { FaPhone, FaTimes } from 'react-icons/fa';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
  contactPhone: string;
}

export default function SOSModal({ isOpen, onClose, contactName, contactPhone }: SOSModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>

          {/* Content */}
          <div className="text-center">
            {/* Emergency Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPhone className="text-3xl text-red-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Emergency Contact</h2>
            <p className="text-gray-600 mb-6">Call your emergency contact for help</p>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Contact Name</p>
              <p className="text-lg font-semibold text-gray-900">{contactName}</p>
              <p className="text-sm text-gray-500 mb-1 mt-4">Phone Number</p>
              <p className="text-lg font-semibold text-indigo-600">{contactPhone}</p>
            </div>

            {/* Call Button */}
            <a
              href={`tel:${contactPhone}`}
              className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg shadow-lg mb-3"
            >
              <FaPhone className="text-xl" />
              CALL NOW
            </a>

            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}





