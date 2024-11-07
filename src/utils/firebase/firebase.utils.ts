import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

enum firebaseConfig  {
    apiKey = import.meta.env.VITE_API_KEY,
    authDomain = import.meta.env.VITE_AUTH_DOMAIN,
    databaseURL = import.meta.env.VITE_DATABASE_URL,
    projectId = import.meta.env.VITE_PROJECT_ID,
    storageBucket = import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId = import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId = import.meta.env.VITE_APP_ID,
    measurementId = import.meta.env.VITE_MEASUREMENT_ID
  };

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export const db = getFirestore();
export const signUpUser = async (email: string, password: string) => {

  return await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      return user
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      throw new Error(errorMessage);
      // ..
    });
}

export const signInUser = async(email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    return user
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(errorMessage);
  });
}