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
    case 'delete_token':
      return { token: null, errorMessage: '' };
    case 'clear_error':
      return { ...state, errorMessage: '' };
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

const signup = dispatch => ({ email, password }, loading) => {
  trails.post('/signup', { email, password }).then((res) => {
    storeData('token', res?.data?.token);
    dispatch({ type: 'add_token', payload: res?.data?.token });
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
    dispatch({ type: 'add_token', payload: res?.data?.token });
    loading(false);
    RootNavigation.navigate('Home', { screen: 'Tracks' });
  }).catch((err) => {
    dispatch({ type: 'add_error', payload: err?.response?.data?.message });
    loading(false);
  });
};

const signout = dispatch => () => {
  removeData('token');
  dispatch({ type: 'delete_token' });
  RootNavigation.navigate('Auth', { screen: 'Signin' });
};

const clearErrors = dispatch => () => {
  dispatch({ type: 'clear_error' });
};

const validateAuth = dispatch => async () => {
  const value = await AsyncStorage.getItem('token');
  if (value !== null) {
    dispatch({ type: 'add_token', payload: value });
    RootNavigation.navigate('Home', { screen: 'Tracks' });
  } else {
    RootNavigation.navigate('Auth', { screen: 'Signin' });
  }
};

export const { Provider, Context } = createDataContect(
  authReducer,
  {
    signin, signup, signout, clearErrors, validateAuth,
  },
  { token: null, errorMessage: '' },
);
