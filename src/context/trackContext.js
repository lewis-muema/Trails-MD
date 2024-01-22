import createDataContext from './createDataContext';
import trails from '../api/trails';
import distanceCalc from '../components/distanceCalc';

const trackReducer = (state, action) => {
  switch (action.type) {
    case 'store_trail':
      return { ...state, trail: action.payload };
    case 'fetch_trails':
      return { ...state, trails: action.payload };
    case 'set_multiselect':
      return {
        ...state,
        multiselect: action.payload.val,
        selectCount: action.payload.count,
      };
    case 'total_distance':
      return { ...state, distance: action.payload };
    case 'total_time':
      return { ...state, time: action.payload };
    case 'avg_pace':
      return { ...state, avgPace: action.payload };
    case 'add_success':
      return { ...state, success: action.payload };
    case 'delete_success':
      return { ...state, success: '' };
    case 'add_error':
      return { ...state, error: action.payload };
    case 'delete_error':
      return { ...state, error: '' };
    case 'set_map_center':
      return { ...state, mapCenter: action.payload };
    default:
      return state;
  }
};

const multiSelect = dispatch => (trls, index, count) => {
  if (trls[index].selected) {
    delete trls[index].selected;
  } else {
    trls[index].selected = true;
  }
  dispatch({ type: 'store_trail', payload: trls });
  dispatch({
    type: 'set_multiselect',
    payload: {
      val: true, count: trls[index].selected ? count + 1 : count - 1,
    },
  });
};

const clearSelect = dispatch => (trls) => {
  trls.forEach((trl) => {
    delete trl.selected;
  });
  dispatch({ type: 'store_trail', payload: trls });
  dispatch({ type: 'set_multiselect', payload: { val: false, count: 0 } });
};

const totalDistance = (locs) => {
  let distance = 0;
  const { getPolylines, getTotalDistance } = distanceCalc();
  locs.forEach((loc) => {
    const polylines = getPolylines(loc.locations);
    distance += getTotalDistance(polylines);
  });
  return distance;
};

const totalTime = (locs) => {
  let time = 0;
  const { getPolylines, getTotalTime } = distanceCalc();
  locs.forEach((loc) => {
    const polylines = getPolylines(loc.locations);
    time += getTotalTime(polylines);
  });
  return time;
};

const avgPace = (locs) => {
  let speed = 0;
  locs.locations.forEach((loc) => {
    speed += loc.coords.speed;
  });
  return (1 / (speed / locs.locations.length) * (1000 / 60));
};

const setMapCenter = dispatch => (locations) => {
  const { centerOfMap } = distanceCalc();
  dispatch({ type: 'set_map_center', payload: centerOfMap(locations.locations, 0.01) });
};

const fetchTracks = dispatch => (loading) => {
  loading(true);
  trails.get('/tracks').then((res) => {
    loading(false);
    dispatch({ type: 'fetch_trails', payload: res?.data?.tracks.reverse() });
    dispatch({ type: 'total_distance', payload: totalDistance(res?.data?.tracks) });
  }).catch(() => {
    loading(false);
    dispatch({ type: 'fetch_trails', payload: [] });
  });
};
const fetchOneTrack = dispatch => (loading, id) => {
  loading(true);
  dispatch({ type: 'store_trail', payload: {} });
  trails.get(`/tracks/${id}`).then((res) => {
    loading(false);
    dispatch({ type: 'store_trail', payload: res?.data });
    dispatch({ type: 'total_distance', payload: totalDistance([res?.data]) });
    dispatch({ type: 'total_time', payload: totalTime([res?.data]) });
    dispatch({ type: 'avg_pace', payload: avgPace(res?.data) });
  }).catch(() => {
    loading(false);
    dispatch({ type: 'store_trail', payload: {} });
  });
};

const editSavedTrack = dispatch => (name, locations, id, loading, changeSavedStatus) => {
  loading(true);
  dispatch({ type: 'delete_error' });
  dispatch({ type: 'store_trail', payload: {} });
  trails.put(`/tracks/${id}`, { name, locations }).then((res) => {
    loading(false);
    dispatch({ type: 'store_trail', payload: res?.data });
    dispatch({ type: 'add_success', payload: res?.data.message });
    changeSavedStatus(true);
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

const deleteTrack = dispatch => (loading, id, navigateToList) => {
  loading(true);
  trails.delete(`/tracks/${id}`).then((res) => {
    loading(false);
    dispatch({ type: 'add_success', payload: res?.data.message });
    navigateToList();
  }).catch((err) => {
    loading(false);
    dispatch({ type: 'add_error', payload: err?.response?.data?.message });
  });
};

const createTrack = dispatch => (name, locations, loading, changeSavedStatus) => {
  loading(true);
  dispatch({ type: 'delete_error' });
  dispatch({ type: 'store_trail', payload: {} });
  trails.post('/tracks', { name, locations }).then((res) => {
    dispatch({ type: 'store_trail', payload: res?.data });
    dispatch({ type: 'add_success', payload: res?.data.message });
    changeSavedStatus(true);
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
  {
    fetchTracks,
    createTrack,
    fetchOneTrack,
    setMapCenter,
    deleteTrack,
    editSavedTrack,
    multiSelect,
    clearSelect,
  },
  {
    trail: {},
    error: '',
    success: '',
    trails: [],
    distance: 0,
    mapCenter: {},
    time: 0,
    avgPace: 0,
    multiselect: false,
    selectCount: 0,
  },
);
