import { useState, useEffect } from 'react';
import {
  Accuracy,
  requestForegroundPermissionsAsync,
  requestBackgroundPermissionsAsync,
  watchPositionAsync,
} from 'expo-location';

export default (tracking, callback) => {
  const [err, setErr] = useState(null);

  useEffect(() => {
    let subscriber;
    const startWatching = async () => {
      try {
        await requestForegroundPermissionsAsync();
        await requestBackgroundPermissionsAsync();
        subscriber = await watchPositionAsync({
          accuracy: Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 10,
        }, callback);
      } catch (e) {
        setErr(e);
      }
    };
    if (tracking) {
      startWatching();
    } else {
      subscriber ? subscriber.remove() : null;
      subscriber = null;
    }

    return () => {
      subscriber ? subscriber.remove() : null;
    };
  }, [tracking, callback]);

  return [err];
};
