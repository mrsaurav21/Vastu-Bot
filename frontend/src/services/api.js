import axios from 'axios';

// Base URL for your FastAPI backend
const API_BASE_URL = 'http://localhost:8000';

// Create a configured axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Sends a base64 encoded blueprint image to the Python backend
 * to extract 2D wall coordinates using OpenCV.
 * * @param {string} base64Image - The blueprint image converted to a Base64 string.
 * @returns {Promise<Object>} - Returns the JSON object containing wall coordinates.
 */
export const convertBlueprintTo3D = async (base64Image) => {
  try {
    const response = await apiClient.post('/ai/convert', {
      image: base64Image,
    });
    
    return response.data;
  } catch (error) {
    console.error("API Error: Failed to convert blueprint.", error);
    // Throw the error so the UI (Home.jsx) can display a failure message to the user
    throw error;
  }
};