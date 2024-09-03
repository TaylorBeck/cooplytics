import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authenticateGuest } from '../api/auth';
import { setGuestAccess } from '../redux/slices/authSlice';

export default function GuestAccess() {
  // Extract guestToken from URL parameters
  const { guestToken } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const authenticateGuestUser = async () => {
      try {
        // Ensure guestToken is present
        if (!guestToken) {
          throw new Error('No guest token provided');
        }

        // Authenticate guest and get farmId
        const { farmId } = await authenticateGuest(guestToken);

        // Store guest access info in Redux state
        dispatch(setGuestAccess({ farmId, guestToken }));

        // Redirect to the farm page after successful authentication
        navigate(`/farms/${farmId}`);
      } catch (error) {
        console.error('Failed to authenticate guest:', error);
        // Redirect to home page if authentication fails
        navigate('/');
      }
    };

    // Call the authentication function when the component mounts
    authenticateGuestUser();
  }, [guestToken, navigate, dispatch]);

  // Display a loading message while authentication is in progress
  return <div>Authenticating guest access...</div>;
}
