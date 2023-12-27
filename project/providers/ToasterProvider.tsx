// Import the necessary module
import { Toaster } from "react-hot-toast";

// Define a functional component named ToastProvider
const ToastProvider = () => {
  // Return the Toaster component with custom toast options
  return (
    <Toaster
      toastOptions={{
        style: {
          background: "#333", // Background color for the toast
          color: "#fff", // Text color for the toast
        },
      }}
    />
  );
};

// Export the ToastProvider component as the default export of this module
export default ToastProvider;
