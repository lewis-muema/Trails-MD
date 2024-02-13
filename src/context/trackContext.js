import AsyncStorage from '@react-native-async-storage/async-storage';
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
    case 'reset':
      return { ...state, ...action.payload };
    case 'save_trails_offline':
      return { ...state, ...storeDataOffline('trail_state', state) };
    case 'remove_trails_offline':
      return { ...state, ...removeDataOffline(state) };
    case 'set_state':
      return { ...state, ...action.payload };
    case 'set_offline':
      return { ...state, offline: action.payload };
    default:
      return state;
  }
};

const storeDataOffline = async (key, value) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
  return value;
};

const removeDataOffline = async (value) => {
  await AsyncStorage.removeItem('trail_state');
  await AsyncStorage.removeItem('deleted_trails_state');
  return value;
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

const setOffline = dispatch => (offline) => {
  dispatch({ type: 'set_offline', payload: offline });
};

const fetchTracks = dispatch => (loading, offline) => {
  loading(true);
  if (offline) {
    dispatch({ type: 'set_offline', payload: offline });
    AsyncStorage.getItem('trail_state').then((value) => {
      if (value !== null) {
        dispatch({ type: 'set_state', payload: JSON.parse(value) });
      }
      loading(false);
    });
  } else {
    dispatch({ type: 'set_offline', payload: offline });
    trails.get('/tracks').then((res) => {
      loading(false);
      dispatch({ type: 'fetch_trails', payload: res?.data?.tracks.reverse() });
      dispatch({ type: 'total_distance', payload: totalDistance(res?.data?.tracks) });
    }).catch(() => {
      loading(false);
      dispatch({ type: 'fetch_trails', payload: [] });
    });
  }
};
const fetchOneTrack = dispatch => (loading, id, offline) => {
  loading(true);
  if (offline) {
    dispatch({ type: 'set_offline', payload: offline });
    dispatch({ type: 'store_trail', payload: {} });
    AsyncStorage.getItem('trail_state').then((value) => {
      if (value !== null) {
        const trail = JSON.parse(value).trails.filter(trl => trl.id === id);
        dispatch({ type: 'store_trail', payload: trail[0] });
        dispatch({ type: 'total_distance', payload: totalDistance(trail) });
        dispatch({ type: 'total_time', payload: totalTime(trail) });
        dispatch({ type: 'avg_pace', payload: avgPace(trail[0]) });
        loading(false);
      }
    });
  } else {
    dispatch({ type: 'set_offline', payload: offline });
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
  }
};

const editSavedTrack = dispatch => (
  name, locations, id, loading, changeSavedStatus, offline,
) => {
  loading(true);
  if (offline) {
    dispatch({ type: 'set_offline', payload: offline });
    dispatch({ type: 'delete_error' });
    AsyncStorage.getItem('trail_state').then(async (value) => {
      if (value !== null) {
        const trls = JSON.parse(value);
        trls.trails.forEach((trail, i) => {
          if (trail.id === id) {
            trls.trails[i] = {
              id, name, locations, action: 'edit',
            };
          }
        });
        await AsyncStorage.setItem('trail_state', JSON.stringify(trls));
        dispatch({ type: 'add_success', payload: 'Trail updated successfully' });
        changeSavedStatus(true);
        setTimeout(() => {
          dispatch({ type: 'delete_success' });
        }, 5000);
        loading(false);
      }
    });
  } else {
    dispatch({ type: 'set_offline', payload: offline });
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
  }
};

const deleteTrack = dispatch => (loading, id, navigateToList, offline) => {
  loading(true);
  if (offline) {
    AsyncStorage.getItem('trail_state').then(async (value) => {
      if (value !== null) {
        const trls = JSON.parse(value);
        let deletedTrail = {};
        trls.trails.forEach((trail, i) => {
          if (trail.id === id) {
            deletedTrail = trail;
            trls.trails.splice(i, 1);
          }
        });
        await AsyncStorage.setItem('trail_state', JSON.stringify(trls));
        AsyncStorage.getItem('deleted_trails_state').then(async (trail) => {
          if (trail === null) {
            await AsyncStorage.setItem('deleted_trails_state', JSON.stringify([deletedTrail]));
          } else {
            const parsedTrail = JSON.parse(trail);
            parsedTrail.push(deletedTrail);
            await AsyncStorage.setItem('deleted_trails_state', JSON.stringify(parsedTrail));
          }
        });
        dispatch({ type: 'add_success', payload: 'Trail deleted successfully' });
        navigateToList();
        loading(false);
      }
    });
  } else {
    trails.delete(`/tracks/${id}`).then((res) => {
      loading(false);
      dispatch({ type: 'add_success', payload: res?.data.message });
      navigateToList();
    }).catch((err) => {
      loading(false);
      dispatch({ type: 'add_error', payload: err?.response?.data?.message });
    });
  }
};

const deleteManyTracks = dispatch => (loading, trls) => {
  loading(true);
  const ids = trls.filter(trl => trl.selected === true).map(({ id }) => id);
  trails.post('/delete-tracks', ids).then((response) => {
    trails.get('/tracks').then((res) => {
      loading(false);
      dispatch({ type: 'add_success', payload: response?.data.message });
      setTimeout(() => {
        dispatch({ type: 'delete_success' });
      }, 5000);
      dispatch({ type: 'set_multiselect', payload: { val: false, count: 0 } });
      dispatch({ type: 'fetch_trails', payload: res?.data?.tracks.reverse() });
      dispatch({ type: 'total_distance', payload: totalDistance(res?.data?.tracks) });
    }).catch(() => {
      loading(false);
      dispatch({ type: 'fetch_trails', payload: [] });
    });
  }).catch((err) => {
    loading(false);
    dispatch({ type: 'add_error', payload: err?.response?.data?.message });
  });
};

const createTrack = dispatch => (name, locations, loading, changeSavedStatus, offline) => {
  loading(true);
  if (offline) {
    dispatch({ type: 'set_offline', payload: offline });
    dispatch({ type: 'delete_error' });
    AsyncStorage.getItem('trail_state').then(async (value) => {
      if (value !== null) {
        const payload = {
          name, locations, action: 'create', id: `offline_${name.replaceAll(' ', '_')}_${Math.floor(Math.random() * 1000)}`,
        };
        const trls = JSON.parse(value);
        trls.trails.unshift(payload);
        await AsyncStorage.setItem('trail_state', JSON.stringify(trls));
        dispatch({ type: 'store_trail', payload });
        dispatch({ type: 'add_success', payload: 'Trail created successfully' });
        changeSavedStatus(true);
        setTimeout(() => {
          dispatch({ type: 'delete_success' });
        }, 5000);
        loading(false);
      }
    });
  } else {
    dispatch({ type: 'set_offline', payload: offline });
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
  }
};

const saveTrailsOffline = dispatch => async (mode) => {
  if (mode) {
    dispatch({ type: 'save_trails_offline' });
  } else {
    dispatch({ type: 'remove_trails_offline' });
  }
};

const resetTrails = dispatch => () => {
  dispatch({
    type: 'reset',
    payload: {
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
    deleteManyTracks,
    editSavedTrack,
    multiSelect,
    clearSelect,
    resetTrails,
    saveTrailsOffline,
    setOffline,
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
    offline: '',
  },
);
