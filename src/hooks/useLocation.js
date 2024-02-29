import { useState, useEffect, useContext } from 'react';
import {
  Accuracy,
  requestForegroundPermissionsAsync,
  requestBackgroundPermissionsAsync,
  watchPositionAsync,
} from 'expo-location';
import { AppState, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Context as locationContext } from '../context/locationContext';

export default (tracking, callback) => {
  const [err, setErr] = useState(null);
  const { state: { recording } } = useContext(locationContext);
  let sub = null;
  useEffect(() => {
    let subscriber;
    let foregroundStatus;
    let backgroundStatus;
    const startWatching = async () => {
      try {
        foregroundStatus = await requestForegroundPermissionsAsync();
        if (foregroundStatus.status === 'granted') {
          backgroundStatus = await requestBackgroundPermissionsAsync();
          if (backgroundStatus.status === 'granted') {
            subscriber = await watchPositionAsync({
              accuracy: Accuracy.BestForNavigation,
              distanceInterval: 1,
            }, callback);
          }
        }
      } catch (e) {
        if (foregroundStatus.status === 'granted') {
          subscriber = await watchPositionAsync({
            accuracy: Accuracy.BestForNavigation,
            distanceInterval: 10,
          }, callback);
        }
        setErr(e);
      }
    };
    if (tracking) {
      startWatching();
    } else {
      subscriber ? subscriber.remove() : null;
      subscriber = null;
    }

    sub = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscriber ? subscriber.remove() : null;
      sub.remove();
    };
  }, [tracking, callback]);

  const handleAppStateChange = async (newState) => {
    if (newState === 'background' && recording) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
      await Notifications.scheduleNotificationAsync({
        content: {
          body: 'Trails MD is recording your trail in the background',
          sticky: true,
        },
        trigger: null,
      });
    } else {
      if (Platform.OS === 'android') {
        await Notifications.dismissAllNotificationsAsync();
      } else {
        await Notifications.dismissAllNotificationsIOS();
      }
    }
  };
  return [err];
};
