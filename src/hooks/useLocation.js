import { useState, useEffect, useContext } from 'react';
import {
  Accuracy,
  requestForegroundPermissionsAsync,
  requestBackgroundPermissionsAsync,
  watchPositionAsync,
  startLocationUpdatesAsync,
  stopLocationUpdatesAsync,
} from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Context as locationContext } from '../context/locationContext';

export default (tracking, callback) => {
  const [err, setErr] = useState(null);
  const { state: { recording } } = useContext(locationContext);
  TaskManager.defineTask('recording', async ({ data, error }) => {
    if (data) {
      callback(data.locations[0]);
    }
  });
  useEffect(() => {
    let subscriber;
    let foregroundStatus;
    let backgroundStatus;
    const startWatching = async () => {
      try {
        foregroundStatus = await requestForegroundPermissionsAsync();
        if (foregroundStatus.status === 'granted') {
          subscriber = await watchPositionAsync({
            accuracy: Accuracy.BestForNavigation,
            distanceInterval: 1,
          }, callback);
          backgroundStatus = await requestBackgroundPermissionsAsync();
          if (backgroundStatus.status === 'granted' && recording) {
            subscriber ? subscriber.remove() : null;
            await startLocationUpdatesAsync('recording', {
              accuracy: Accuracy.BestForNavigation,
              timeInterval: 0,
              distanceInterval: 1,
              foregroundService: {
                notificationTitle: 'Tracking in progress',
                notificationBody: 'Recording your trail in the background',
              },
            });
          } else {
            stopWatching();
          }
        }
      } catch (e) {
        if (foregroundStatus.status === 'granted') {
          subscriber = await watchPositionAsync({
            accuracy: Accuracy.BestForNavigation,
            distanceInterval: 1,
          }, callback);
        }
        setErr(e);
      }
    };
    if (tracking) {
      startWatching();
    } else {
      subscriber ? subscriber.remove() : null;
      stopWatching();
      subscriber = null;
    }
    return () => {
      subscriber ? subscriber.remove() : null;
    };
  }, [tracking, callback]);

  const stopWatching = () => {
    TaskManager.isTaskRegisteredAsync('recording')
      .then((tracking) => {
        if (tracking) {
          stopLocationUpdatesAsync('recording');
        }
      });
  };

  return [err];
};
