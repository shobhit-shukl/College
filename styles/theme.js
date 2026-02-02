// Global Design System: Theme

const lightTheme = {
  colors: {
    background: "#ffffff",
    text: "#333333",
    primary: "#4F46E5",
    secondary: "#6B7280",
    border: "#E5E7EB",
    hover: "#F3F4F6",
    error: "#EF4444",
    success: "#10B981",
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "16px",
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  spacing: (factor) => `${factor * 8}px`,
};

const darkTheme = {
  colors: {
    background: "#1F2937",
    text: "#F9FAFB",
    primary: "#6366F1",
    secondary: "#9CA3AF",
    border: "#374151",
    hover: "#4B5563",
    error: "#F87171",
    success: "#34D399",
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "16px",
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  spacing: (factor) => `${factor * 8}px`,
};

export { lightTheme, darkTheme };