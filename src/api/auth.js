import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';

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
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const idToken = await userCredential.user.getIdToken();

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
