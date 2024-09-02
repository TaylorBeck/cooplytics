import { useState, useEffect } from 'react';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { db } from '../api/firebaseConfig';

/**
 * Hook for managing chicken data
 * @param {string} userId
 * @returns {Object} Chicken data and operations
 */
export const useChickens = userId => {
  const [chickens, setChickens] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    const userFarmsRef = ref(db, `users/${userId}/farms`);
    const chickensRef = ref(db, 'chickens');

    const unsubscribe = onValue(
      userFarmsRef,
      farmSnapshot => {
        if (farmSnapshot.exists()) {
          const userFarms = farmSnapshot.val();

          onValue(
            chickensRef,
            chickenSnapshot => {
              const chickenData = chickenSnapshot.val();
              if (chickenData) {
                const userChickens = Object.entries(chickenData)
                  .filter(([farmId]) => userFarms[farmId])
                  .reduce((acc, [farmId, farmChickens]) => {
                    acc[farmId] = farmChickens;
                    return acc;
                  }, {});
                setChickens(userChickens);
              } else {
                setChickens({});
              }
              setIsLoading(false);
            },
            error => {
              setError(error.message);
              setIsLoading(false);
            }
          );
        } else {
          setChickens({});
          setIsLoading(false);
        }
      },
      error => {
        setError(error.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const addChicken = async (farmId, chickenData) => {
    const chickenRef = ref(db, `chickens/${farmId}`);
    await push(chickenRef, chickenData);
  };

  const updateChicken = async (farmId, chickenId, chickenData) => {
    const chickenRef = ref(db, `chickens/${farmId}/${chickenId}`);
    await update(chickenRef, chickenData);
  };

  const deleteChicken = async (farmId, chickenId) => {
    const chickenRef = ref(db, `chickens/${farmId}/${chickenId}`);
    await remove(chickenRef);
  };

  return {
    chickens,
    isLoading,
    error,
    addChicken,
    updateChicken,
    deleteChicken
  };
};
