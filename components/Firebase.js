// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { initializeAuth , getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
const firebaseConfig = {
  apiKey: "AIzaSyDzrbfm_9-yjCEhi7TRmAVhDdTQa7SuqR4",
  authDomain: "loginprojectayush.firebaseapp.com",
  projectId: "loginprojectayush",
  storageBucket: "loginprojectayush.appspot.com",
  messagingSenderId: "1034501321129",
  appId: "1:1034501321129:android:2cdd408944bb8e58c794b8",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, 
  {persistence:getReactNativePersistence(ReactNativeAsyncStorage)});

export { app, auth };
