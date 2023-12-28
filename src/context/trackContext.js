import createDataContext from './createDataContext';
import trails from '../api/trails';

const trackReducer = (state, action) => {
  switch (action.type) {
    case 'store_trail':
      return { ...state, trail: action.payload };
    case 'add_success':
      return { ...state, success: action.payload };
    case 'delete_success':
      return { ...state, success: '' };
    case 'add_error':
      return { ...state, error: action.payload };
    case 'delete_error':
      return { ...state, error: '' };
    default:
      return state;
  }
};

const fetchTracks = dispatch => () => {};
const createTrack = dispatch => (name, locations, loading) => {
  loading(true);
  dispatch({ type: 'delete_error' });
  trails.post('/tracks', { name, locations }).then((res) => {
    dispatch({ type: 'store_trail', payload: res?.data });
    dispatch({ type: 'add_success', payload: res?.data.message });
    loading(false);
    setTimeout(() => {
      dispatch({ type: 'delete_success' });
    }, 5000);
  }).catch((err) => {
    dispatch({ type: 'add_error', payload: err?.response?.data?.message });
    loading(false);
    setTimeout(() => {
      dispatch({ type: 'delete_error' });
    }, 5000);
  });
};

export const { Provider, Context } = createDataContext(
  trackReducer,
  { fetchTracks, createTrack },
  { trail: {}, error: '', success: '' },
);
