import AsyncStorage from '@react-native-async-storage/async-storage';
import createDataContect from './createDataContext';
import trails from '../api/trails';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'add_token':
      return { errorMessage: '', token: action.payload };
    case 'add_error':
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};

const storeData = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

const signup = dispatch => ({ email, password }, loading, navigate) => {
  trails.post('/signup', { email, password }).then((res) => {
    storeData('token', res?.data?.token);
    dispatch({ type: 'add_token', payload: res?.data?.token });
    loading(false);
    navigate();
  }).catch((err) => {
    dispatch({ type: 'add_error', payload: err?.response?.data?.message });
    loading(false);
  });
};

const signin = (dispatch) => {
  return ({ email, password }) => {

  };
};

const signout = (dispatch) => {
  return () => {

  };
};

export const { Provider, Context } = createDataContect(
  authReducer,
  { signin, signup, signout },
  { token: null, errorMessage: '' },
);
