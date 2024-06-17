// firebase.js

import { initializeApp } from '@react-native-firebase/app';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDzrbfm_9-yjCEhi7TRmAVhDdTQa7SuqR4",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "loginprojectayush",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

export default app;
