import { useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context as TrackContext } from '../context/trackContext';
import { Context as LocationContext } from '../context/locationContext';

export default () => {
  const {
    state: { trail, error, success }, createTrack, editSavedTrack,
  } = useContext(TrackContext);
  const {
    state: { name, locations },
    changeSavedStatus, setLocations, setPolyLines,
  } = useContext(LocationContext);

  const saveTrack = async (loading, offline) => {
    const mode = await AsyncStorage.getItem('mode');
    if (trail?.id && mode === 'edit') {
      editSavedTrack(name, locations, trail?.id, loading, val => changeSavedStatus(val), offline);
    } else {
      createTrack(name, locations, loading, val => changeSavedStatus(val), offline);
    }
  };

  const editTrack = async (navigate) => {
    await AsyncStorage.setItem('mode', 'edit');
    const length = trail?.locations.length;
    const index = length > 0 ? trail?.locations[length - 1].index : 0;
    setLocations(trail?.name, trail?.locations, index);
    setPolyLines();
    navigate();
  };

  return [saveTrack, error, success, trail, editTrack];
};
