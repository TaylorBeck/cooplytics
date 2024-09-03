import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { ref, get } from 'firebase/database';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const createUser = async userData => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const loginUser = async credentials => {
  const { email, password } = credentials;
  try {
    // Authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Get the Firebase ID token
    const idToken = await userCredential.user.getIdToken();

    // Send the ID token to our backend for verification and to get user data
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idToken })
    });

    if (!response.ok) {
      throw new Error('Failed to login');
    }

    const userData = await response.json();
    return { user: userData.user, idToken };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const authenticateGuest = async guestToken => {
  try {
    // Get a reference to the 'farms' node in the Firebase Realtime Database
    const farmsRef = ref(db, 'farms');
    // Fetch all farms data
    const farmsSnapshot = await get(farmsRef);

    if (farmsSnapshot.exists()) {
      const farms = farmsSnapshot.val();

      // Iterate through all farms
      for (const [farmId, farmData] of Object.entries(farms)) {
        // Check if the farm has guest access enabled
        if (farmData.guestAccess) {
          // Iterate through all guest access entries for this farm
          for (const [guestId, guestData] of Object.entries(farmData.guestAccess)) {
            // Check if the provided token matches a guest token
            if (guestData.token === guestToken) {
              // Check if the token has expired
              const expiresAt = new Date(guestData.expiresAt);
              if (expiresAt > new Date()) {
                // Return the farmId and guestToken if the token is valid
                return { farmId, guestToken };
              } else {
                // Throw an error if the token has expired
                throw new Error('Guest token has expired');
              }
            }
          }
        }
      }
    } else {
      console.log('No farms data found');
    }

    // If we've gone through all farms and haven't found a match, the token is invalid
    console.log('No matching guest token found');
    throw new Error('Invalid guest token');
  } catch (error) {
    console.error('Error authenticating guest:', error);
    throw error;
  }
};
