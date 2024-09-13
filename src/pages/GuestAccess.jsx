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

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Authenticating guest access...
        </h2>
        <p className="text-gray-600">Please wait while we verify your access.</p>
      </div>
    </div>
  );
}
