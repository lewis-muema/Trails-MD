import createDataContext from './createDataContext';
import distanceCalc from '../components/distanceCalc';

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
    case 'set_locations':
      return { ...state, locations: action.payload };
    case 'set_index':
      return { ...state, index: action.payload };
    case 'change_name':
      return { ...state, name: action.payload };
    case 'set_distance':
      return { ...state, distance: Math.trunc(totalDistance(state)) };
    case 'refresh_distance':
      return { ...state, distance: Math.trunc(refreshDistance(state)) };
    case 'tracking_status':
      return { ...state, trackStatus: action.payload };
    case 'saved_status':
      return { ...state, savedStatus: action.payload };
    case 'set_play':
      return { ...state, play: action.payload };
    case 'set_permission':
      return { ...state, permission: action.payload };
    case 'set_progress':
      return { ...state, progress: action.payload };
    case 'reset':
      return {
        ...state,
        recording: false,
        name: '',
        locations: [],
        index: 0,
        polylines: [],
        distance: 0,
        trackStatus: 'Start Tracking',
        savedStatus: false,
        mode: 'create',
      };
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
  const { getTotalDistance } = distanceCalc();
  const totalDist = getTotalDistance(state.polylines);
  return totalDist;
};

const totalDistance = (state) => {
  const { getDistanceFromLatLonInKm } = distanceCalc();
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
const changeSavedStatus = dispatch => (status) => {
  dispatch({ type: 'saved_status', payload: status });
};
const reset = dispatch => () => {
  dispatch({ type: 'reset' });
};
const startRecording = dispatch => () => {
  dispatch({ type: 'start_recording' });
  dispatch({ type: 'refresh_distance' });
  dispatch({ type: 'tracking_status', payload: 'Stop Tracking' });
};
const stopRecording = dispatch => () => {
  dispatch({ type: 'stop_recording' });
  dispatch({ type: 'tracking_status', payload: 'Continue Tracking' });
  dispatch({ type: 'saved_status', payload: false });
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

const setPlay = dispatch => (val) => {
  dispatch({ type: 'set_play', payload: val });
};

const setProgress = dispatch => (val) => {
  dispatch({ type: 'set_progress', payload: val });
};

const setPermission = dispatch => (val) => {
  dispatch({ type: 'set_permission', payload: val });
};

const setLocations = dispatch => (name, locations, index) => {
  dispatch({ type: 'set_locations', payload: locations });
  dispatch({ type: 'set_index', payload: index });
  dispatch({ type: 'change_name', payload: name });
};


export const { Context, Provider } = createDataContext(
  locationReducer,
  {
    startRecording,
    stopRecording,
    addLocation,
    changeName,
    setPolyLines,
    changeSavedStatus,
    setLocations,
    reset,
    setPlay,
    setProgress,
    setPermission,
  },
  {
    recording: false,
    locations: [],
    currentLocation: null,
    name: '',
    index: 0,
    polylines: [],
    distance: 0,
    trackStatus: 'Start Tracking',
    savedStatus: false,
    play: false,
    progress: 0,
    permission: '',
  },
);
