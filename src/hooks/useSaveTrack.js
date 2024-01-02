import { useContext } from 'react';
import { Context as TrackContext } from '../context/trackContext';
import { Context as LocationContext } from '../context/locationContext';

export default () => {
  const { state: { trail, error, success }, createTrack } = useContext(TrackContext);
  const { state: { name, locations }, changeSavedStatus } = useContext(LocationContext);

  const saveTrack = (loading) => {
    createTrack(name, locations, loading, val => changeSavedStatus(val));
  };

  return [saveTrack, error, success, trail];
};
