import { useState, useEffect, useContext } from 'react';
import {
  Accuracy,
  requestForegroundPermissionsAsync,
  requestBackgroundPermissionsAsync,
  watchPositionAsync,
  startLocationUpdatesAsync,
  stopLocationUpdatesAsync,
} from 'expo-location';
import { Alert } from 'react-native';
import { Linking } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import { Context as locationContext } from '../context/locationContext';

export default (tracking, callback) => {
  const [err, setErr] = useState(null);
  const { state: { recording, permission, backgroundPermission }, setBackgroundPermissions } = useContext(locationContext);
  TaskManager.defineTask('recording', async ({ data, error }) => {
    if (data) {
      callback(data.locations[0]);
    }
  });
  useEffect(() => {
    let subscriber;
    let foregroundStatus;
    const startWatching = async () => {
      try {
        foregroundStatus = await requestForegroundPermissionsAsync();
        if (foregroundStatus.status === 'granted') {
          subscriber = await watchPositionAsync({
            accuracy: Accuracy.BestForNavigation,
            distanceInterval: 1,
          }, callback);
          setBackgroundPermissions('checkBg')
        } else if (!foregroundStatus.canAskAgain) {
          showPermissionAlert();
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
    if (tracking && permission) {
      startWatching();
    } else {
      subscriber ? subscriber.remove() : null;
      stopWatching();
      subscriber = null;
    }
    return () => {
      subscriber ? subscriber.remove() : null;
    };
  }, [tracking, callback, permission]);

  useEffect(() => {
    if (backgroundPermission === 'denied') {
      requestBackgroundPermissions();
    }
  }, [backgroundPermission])

  const stopWatching = () => {
    TaskManager.isTaskRegisteredAsync('recording')
      .then((tracking) => {
        if (tracking) {
          stopLocationUpdatesAsync('recording');
        }
      });
  };

  const requestBackgroundPermissions = async () => {
    let backgroundStatus;
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
    } else if (!backgroundStatus.canAskAgain) {
      showPermissionAlert();
    } else {
      stopWatching();
    }
  }

  const showPermissionAlert = () => {
    Alert.alert(
      "Location Permission Required",
      "You have permanently denied location access. Please enable it in settings.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() },
      ]
    );
  };

  return [err];
};
