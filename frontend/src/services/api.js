import axios from 'axios';

// Pull the URL from your .env file (VITE_ prefix is required for Vite)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create a configured axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * AUTH: Sends the Google JWT token to the backend for verification and profile sync.
 * @param {string} googleToken - The credential received from Google Login.
 */
export const loginWithGoogle = async (googleToken) => {
  try {
    const response = await apiClient.post('/auth/google', {
      token: googleToken,
    });
    return response.data;
  } catch (error) {
    console.error("API Error: Authentication failed.", error);
    throw error;
  }
};

/**
 * AI CONVERTER: Sends a base64 encoded blueprint image to extract wall coordinates.
 * @param {string} base64Image - The blueprint image as a Base64 string.
 * @param {string} userEmail - The email of the logged-in user to save the project.
 */
export const convertBlueprintTo3D = async (base64Image, userEmail = "guest") => {
  try {
    const response = await apiClient.post('/ai/convert', {
      image: base64Image,
      user_email: userEmail
    });
    return response.data;
  } catch (error) {
    console.error("API Error: Failed to convert blueprint.", error);
    throw error;
  }
};

/**
 * PROJECTS: Fetches all saved 3D designs for a specific user.
 * @param {string} userEmail - The email of the user whose projects to fetch.
 */
export const getUserProjects = async (userEmail) => {
  try {
    const response = await apiClient.get(`/projects/${userEmail}`);
    return response.data;
  } catch (error) {
    console.error("API Error: Failed to fetch user projects.", error);
    throw error;
  }
};

export default apiClient;