import { useState, useEffect } from 'react';
import {
  Accuracy,
  requestForegroundPermissionsAsync,
  requestBackgroundPermissionsAsync,
  watchPositionAsync,
} from 'expo-location';

export default (tracking, callback) => {
  const [err, setErr] = useState(null);
  const [subscriber, setSubscriber] = useState(null);
  const startWatching = async () => {
    try {
      await requestForegroundPermissionsAsync();
      await requestBackgroundPermissionsAsync();
      const sub = await watchPositionAsync({
        accuracy: Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 10,
      }, callback);
      setSubscriber(sub);
    } catch (e) {
      setErr(e);
    }
  };

  useEffect(() => {
    if (tracking) {
      startWatching();
    } else {
      subscriber ? subscriber.remove() : null;
      setSubscriber(null);
    }
  }, [tracking]);

  return [err];
};
