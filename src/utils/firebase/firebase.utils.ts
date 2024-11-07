import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc, setDoc, serverTimestamp, query, collection, getDocs, writeBatch} from 'firebase/firestore';
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
  const noteID = nanoid()
  const noteRef = doc(db, type, noteID)

  await setDoc(noteRef, {
    id: noteID,
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

export const changeNoteType = async(source: NoteTypes, target: NoteTypes, note: Note, email: string) => {
  const sourceRef = doc(db, source, note.id as string);
  const targetCollectionRef = collection(db, target);
  const targetDocRef = doc(targetCollectionRef, note.id);

  const batch = writeBatch(db);
  batch.delete(sourceRef);
  batch.set(targetDocRef, { ...note, updatedBy: email, updatedAt: serverTimestamp() });

  try {
      await batch.commit();
      console.log("Document moved successfully");

      // Optional: Check if document exists in target collection
      const docSnap = await getDoc(targetDocRef);
      if (docSnap.exists()) {
          console.log("Document found in new collection:", docSnap.data());
      } else {
          console.log("Document not found in the new collection.");
      }
  } catch (error) {
      console.error("Error moving document:", error);
  }
};