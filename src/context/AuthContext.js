import AsyncStorage from '@react-native-async-storage/async-storage';
import createDataContect from './createDataContext';
import trails from '../api/trails';
import * as RootNavigation from '../RootNavigation';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'add_token':
      return { errorMessage: '', token: action.payload };
    case 'add_error':
      return { ...state, errorMessage: action.payload };
    case 'add_success':
      return { ...state, successMessage: action.payload };
    case 'delete_token':
      return { token: null, errorMessage: '' };
    case 'clear_error':
      return { ...state, errorMessage: '' };
    case 'clear_success':
      return { ...state, successMessage: '' };
    case 'store_user':
      return { ...state, userId: action.payload };
    case 'clear_user':
      return { ...state, userId: '' };
    case 'set_offline_mode':
      return { ...state, offline: action.payload };
    default:
      return state;
  }
};

const storeData = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};
const removeData = async (key) => {
  await AsyncStorage.removeItem(key);
};

const signup = dispatch => ({ email, password }, loading, saveOfflineData) => {
  trails.post('/signup', { email, password }).then(async (res) => {
    storeData('token', res?.data?.token);
    storeData('email', email);
    dispatch({ type: 'add_token', payload: res?.data?.token });
    const guest = await AsyncStorage.getItem('guest');
    if (guest === 'yes') {
      await AsyncStorage.removeItem('guest');
      saveOfflineData();
    }
    loading(false);
    RootNavigation.navigate('Home', { screen: 'Tracks' });
  }).catch((err) => {
    dispatch({ type: 'add_error', payload: err?.response?.data?.message });
    loading(false);
  });
};

const signin = dispatch => ({ email, password }, loading) => {
  trails.post('/signin', { email, password }).then((res) => {
    storeData('token', res?.data?.token);
    storeData('email', email);
    dispatch({ type: 'add_token', payload: res?.data?.token });
    loading(false);
    RootNavigation.navigate('Home', { screen: 'Tracks' });
  }).catch((err) => {
    dispatch({ type: 'add_error', payload: err?.response?.data?.message });
    loading(false);
  });
};

const sendResetEmail = dispatch => ({ email }, loading, stage) => {
  trails.post('/forgot-password', { email }).then((res) => {
    dispatch({ type: 'store_user', payload: res?.data?.id });
    loading(false);
    stage(2);
    dispatch({ type: 'add_success', payload: res?.data?.message });
    setTimeout(() => {
      dispatch({ type: 'clear_success' });
    }, 6000);
  }).catch((err) => {
    dispatch({ type: 'add_error', payload: err?.response?.data?.message });
    setTimeout(() => {
      dispatch({ type: 'clear_error' });
    }, 3000);
    loading(false);
  });
};

const validateToken = dispatch => ({ id, token, password }, loading) => {
  trails.post('/validate-token', { id, token, password }).then((res) => {
    dispatch({ type: 'clear_user' });
    loading(false);
    dispatch({ type: 'add_success', payload: res?.data?.message });
    setTimeout(() => {
      dispatch({ type: 'clear_success' });
      RootNavigation.navigate('Signin');
    }, 6000);
  }).catch((err) => {
    dispatch({ type: 'add_error', payload: err?.response?.data?.message });
    setTimeout(() => {
      dispatch({ type: 'clear_error' });
    }, 3000);
    loading(false);
  });
};

const deleteAccount = dispatch => (loading) => {
  loading(true);
  trails.delete('/delete-account').then((res) => {
    removeData('token');
    dispatch({ type: 'delete_token' });
    dispatch({ type: 'add_success', payload: res?.data?.message });
    RootNavigation.navigate('Auth', { screen: 'Signin' });
    loading(false);
    setTimeout(() => {
      dispatch({ type: 'clear_success' });
    }, 6000);
  }).catch((err) => {
    dispatch({ type: 'add_error', payload: err?.response?.data?.message });
    setTimeout(() => {
      dispatch({ type: 'clear_error' });
    }, 3000);
    loading(false);
  });
};

const offlineMode = dispatch => async (mode) => {
  dispatch({ type: 'set_offline_mode', payload: mode });
  if (mode) {
    await AsyncStorage.setItem('offline', mode);
  } else {
    await AsyncStorage.removeItem('offline');
  }
};

const signout = dispatch => () => {
  removeData('token');
  dispatch({ type: 'delete_token' });
  RootNavigation.navigate('Auth', { screen: 'Signin' });
};

const setError = dispatch => (err) => {
  dispatch({ type: 'add_error', payload: err });
};

const clearErrors = dispatch => () => {
  dispatch({ type: 'clear_error' });
};

const validateAuth = dispatch => async () => {
  const value = await AsyncStorage.getItem('token');
  const guest = await AsyncStorage.getItem('guest');
  if (value !== null) {
    dispatch({ type: 'add_token', payload: value });
    RootNavigation.navigate('Home', { screen: 'Tracks' });
  } else if (guest === 'yes') {
    RootNavigation.navigate('Home', { screen: 'Tracks' });
  } else {
    RootNavigation.navigate('Auth', { screen: 'Signin' });
  }
};

export const { Provider, Context } = createDataContect(
  authReducer,
  {
    signin,
    signup,
    signout,
    clearErrors,
    setError,
    validateAuth,
    sendResetEmail,
    validateToken,
    deleteAccount,
    offlineMode,
  },
  {
    token: null, errorMessage: '', successMessage: '', userId: '', offline: '',
  },
);
