import { ref, onValue } from 'firebase/database';
import { db } from './firebaseConfig';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Subscribes to chicken data for a specific farm
 * @param {string} farmId
 * @param {function} callback
 * @returns {function} Unsubscribe function
 */
export const subscribeToChickens = (farmId, callback) => {
  const chickensRef = ref(db, `chickens/${farmId}`);
  return onValue(chickensRef, snapshot => {
    const data = snapshot.val();
    callback(data);
  });
};

/**
 * Adds a new chicken
 * @param {string} farmId
 * @param {Object} chickenData
 * @returns {Promise<Object>}
 */
export const addChicken = async (farmId, chickenData) => {
  const response = await axios.post(
    `${API_URL}/farms/${farmId}/chickens`,
    chickenData,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

/**
 * Updates an existing chicken
 * @param {string} farmId
 * @param {string} chickenId
 * @param {Object} chickenData
 * @returns {Promise<Object>}
 */
export const updateChicken = async (farmId, chickenId, chickenData) => {
  const response = await axios.put(
    `${API_URL}/farms/${farmId}/chickens/${chickenId}`,
    chickenData
  );
  return response.data;
};

/**
 * Deletes a chicken
 * @param {string} farmId
 * @param {string} chickenId
 * @returns {Promise<void>}
 */
export const deleteChicken = async (farmId, chickenId) => {
  await axios.delete(`${API_URL}/farms/${farmId}/chickens/${chickenId}`);
};
