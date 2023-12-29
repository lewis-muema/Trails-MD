import createDataContext from './createDataContext';
import getDistanceFromLatLonInKm from '../components/distance';

const locationReducer = (state, action) => {
  switch (action.type) {
    case 'add_current_location':
      return { ...state, currentLocation: action.payload };
    case 'start_recording':
      return { ...state, recording: true, index: state.index + 1 };
    case 'stop_recording':
      return { ...state, recording: false };
    case 'add_location':
      return {
        ...state,
        currentLocation: action.payload,
        locations: [...state.locations, { ...action.payload, index: state.index }],
      };
    case 'set_polylines':
      return { ...state, polylines: createLocs(state) };
    case 'change_name':
      return { ...state, name: action.payload };
    case 'set_distance':
      return { ...state, distance: Math.trunc(totalDistance(state)) };
    case 'refresh_distance':
      return { ...state, distance: Math.trunc(refreshDistance(state)) };
    default:
      return state;
  }
};

const createLocs = (state) => {
  const arr = [];
  state.locations.forEach((location) => {
    const index = location.index - 1;
    arr[index] ? arr.splice(index, 1, [...arr[index], location])
      : arr.splice(index, 0, [location]);
  });
  return arr;
};

const refreshDistance = (state) => {
  let totalDist = 0;
  state.polylines.forEach((locations) => {
    let distance = 0;
    if (locations.length > 1) {
      let prevLong = locations[0]?.coords?.longitude;
      let prevLat = locations[0]?.coords?.latitude;
      locations.forEach((loc, i) => {
        if (i > 0) {
          prevLong = locations[i - 1]?.coords?.longitude;
          prevLat = locations[i - 1]?.coords?.latitude;
          distance = getDistanceFromLatLonInKm(
            prevLat, prevLong, loc?.coords?.latitude, loc?.coords?.longitude,
          ) + distance;
        }
      });
    }
    totalDist = distance + totalDist;
  });
  return totalDist;
};

const totalDistance = (state) => {
  let distance = 0;
  const polyCount = state.polylines.length;
  const currentPoly = polyCount > 0 ? state.polylines[polyCount - 1] : [];
  if (currentPoly.length > 1) {
    const prevLong = currentPoly[currentPoly.length - 2]?.coords?.longitude;
    const prevLat = currentPoly[currentPoly.length - 2]?.coords?.latitude;
    const currentLong = currentPoly[currentPoly.length - 1]?.coords?.longitude;
    const currentLat = currentPoly[currentPoly.length - 1]?.coords?.latitude;
    distance = getDistanceFromLatLonInKm(
      prevLat, prevLong, currentLat, currentLong,
    );
  }
  return state.distance + distance;
};

const changeName = dispatch => (name) => {
  dispatch({ type: 'change_name', payload: name });
};
const startRecording = dispatch => () => {
  dispatch({ type: 'start_recording' });
  dispatch({ type: 'refresh_distance' });
};
const stopRecording = dispatch => () => {
  dispatch({ type: 'stop_recording' });
};
const addLocation = dispatch => (location, recording) => {
  if (recording) {
    dispatch({ type: 'add_location', payload: location });
    dispatch({ type: 'set_distance' });
  } else {
    dispatch({ type: 'add_current_location', payload: location });
  }
};
const setPolyLines = dispatch => () => {
  dispatch({ type: 'set_polylines' });
};

export const { Context, Provider } = createDataContext(
  locationReducer,
  {
    startRecording,
    stopRecording,
    addLocation,
    changeName,
    setPolyLines,
  },
  {
    recording: false,
    locations: [],
    currentLocation: null,
    name: '',
    index: 0,
    polylines: [],
    distance: 0,
  },
);
