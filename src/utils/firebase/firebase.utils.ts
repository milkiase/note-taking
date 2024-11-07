import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc, setDoc, serverTimestamp, query, collection, getDocs} from 'firebase/firestore';
import {nanoid} from "nanoid";

import { Note, NoteTypes } from '../../types';

const firebaseConfig = {
    "apiKey" : import.meta.env.VITE_API_KEY ,
    "authDomain" : import.meta.env.VITE_AUTH_DOMAIN ,
    "databaseURL" : import.meta.env.VITE_DATABASE_URL ,
    "projectId" : import.meta.env.VITE_PROJECT_ID ,
    "storageBucket" : import.meta.env.VITE_STORAGE_BUCKET ,
    "messagingSenderId" : import.meta.env.VITE_MESSAGING_SENDER_ID ,
    "appId" : import.meta.env.VITE_APP_ID ,
    "measurementId" : import.meta.env.VITE_MEASUREMENT_ID 
  };

const app = initializeApp(firebaseConfig)
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
      // const errorCode = error.code;
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
    // const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(errorMessage);
  });
}


export const createNote = async(note: Note, email: string, type: NoteTypes) => {
  const noteRef = doc(db, type, nanoid())

  await setDoc(noteRef, {
    title: note.title,
    createdBy: email,
    updatedBy: email,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return await getDoc(noteRef);
}

export const getNotesAndDocuments = async(type: NoteTypes) => {
  const collectionRef = collection(db, type);
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

