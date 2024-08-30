import { useMutation } from '@tanstack/react-query';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const createUserFn = async userData => {
  const { email, password, name, role } = userData;
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, name, role })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to register user');
  }

  return response.json();
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: createUserFn,
    onError: error => {
      console.error('Error creating user:', error.message);
    }
  });
};

const loginUserFn = async credentials => {
  const { email, password } = credentials;
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
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to login');
  }

  const data = await response.json();
  return data.user;
};

export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUserFn,
    onError: error => {
      console.error('Error logging in:', error.message);
    }
  });
};
