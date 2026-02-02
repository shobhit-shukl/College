import React from "react";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";

const Modal = ({ title, children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <FaTimes size={20} />
        </button>
        {title && <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>}
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;