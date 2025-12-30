import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

// ========== REQUEST INTERCEPTOR ==========
API.interceptors.request.use(
  (config) => {
    const timestamp = new Date().toISOString();
    console.log(`[API REQUEST] ${timestamp}`);
    console.log(`  Method: ${config.method.toUpperCase()}`);
    console.log(`  Endpoint: ${config.baseURL}${config.url}`);
    if (config.data) {
      console.log(`  Data:`, config.data);
    }
    if (config.params) {
      console.log(`  Params:`, config.params);
    }
    return config;
  },
  (error) => {
    console.error("[API REQUEST ERROR]", error);
    return Promise.reject(error);
  }
);

// ========== RESPONSE INTERCEPTOR ==========
API.interceptors.response.use(
  (response) => {
    const timestamp = new Date().toISOString();
    console.log(`[API RESPONSE] ${timestamp}`);
    console.log(`  Status: ${response.status} ${response.statusText}`);
    console.log(`  Endpoint: ${response.config.url}`);
    console.log(`  Data:`, response.data);
    return response;
  },
  (error) => {
    const timestamp = new Date().toISOString();
    console.error(`[API ERROR] ${timestamp}`);
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Endpoint: ${error.config.url}`);
      console.error(`  Error Data:`, error.response.data);
    } else if (error.request) {
      console.error(`  No response received`);
      console.error(`  Endpoint: ${error.config.url}`);
      console.error(`  Message: ${error.message}`);
    } else {
      console.error(`  Error:`, error.message);
    }
    return Promise.reject(error);
  }
);

export default API;
