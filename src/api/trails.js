import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../RootNavigation';

const instance = axios.create({
  baseURL: 'https://tracks-408014.uc.r.appspot.com',
});

instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    Promise.reject(err);
  },
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    if (err.response.status === 401 && err.response.data?.message === 'You are not logged in') {
      await AsyncStorage.removeItem('token');
      RootNavigation.navigate('Auth', { screen: 'Signin' });
    } else {
      throw err;
    }
  },
);

export default instance;
