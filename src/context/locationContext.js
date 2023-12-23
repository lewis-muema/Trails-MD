/* eslint-disable no-case-declarations */
import createDataContext from './createDataContext';

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

const changeName = dispatch => (name) => {
  dispatch({ type: 'change_name', payload: name });
};
const startRecording = dispatch => () => {
  dispatch({ type: 'start_recording' });
};
const stopRecording = dispatch => () => {
  dispatch({ type: 'stop_recording' });
};
const addLocation = dispatch => (location, recording) => {
  if (recording) {
    dispatch({ type: 'add_location', payload: location });
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
  },
);
