import React from "react";
import PropTypes from "prop-types";

const Loader = ({ size = "md", message = "Loading..." }) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={`${sizes[size]} border-t-transparent border-indigo-500 rounded-full animate-spin`}
      ></div>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
};

Loader.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  message: PropTypes.string,
};

export default Loader;