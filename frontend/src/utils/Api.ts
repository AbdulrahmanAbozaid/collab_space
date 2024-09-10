import axios from "axios";
import cookies from "./cookies"; // Assuming you are using cookies-next or a similar package

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URI}`,
  timeout: 10000, // Set a timeout for requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = cookies.get("clb-tkn");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Return the response data directly for simplicity
    return response.data;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error("Error Response:", error.response);
      // Optionally handle specific status codes
      if (error.response.status === 401) {
        // Handle unauthorized access
        console.log("Unauthorized - Redirect to login");
      }
    } else if (error.request) {
      // No response was received
      console.error("No Response:", error.request);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
