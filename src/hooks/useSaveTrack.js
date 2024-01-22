import { useContext } from 'react';
import { Context as TrackContext } from '../context/trackContext';
import { Context as LocationContext } from '../context/locationContext';

export default () => {
  const {
    state: { trail, error, success }, createTrack, editSavedTrack,
  } = useContext(TrackContext);
  const {
    state: { name, locations, mode },
    changeSavedStatus, setLocations, setPolyLines, setMode,
  } = useContext(LocationContext);

  const saveTrack = (loading) => {
    if (trail?.id && mode === 'edit') {
      editSavedTrack(name, locations, trail?.id, loading, val => changeSavedStatus(val));
    } else {
      createTrack(name, locations, loading, val => changeSavedStatus(val));
    }
  };

  const editTrack = () => {
    setMode('edit');
    const length = trail?.locations.length;
    const index = length > 0 ? trail?.locations[length - 1].index : 0;
    setLocations(trail?.name, trail?.locations, index);
    setPolyLines();
  };

  return [saveTrack, error, success, trail, editTrack];
};
