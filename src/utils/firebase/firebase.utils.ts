import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc, setDoc, serverTimestamp, query, collection, getDocs, writeBatch, onSnapshot } from 'firebase/firestore';
import {nanoid} from "nanoid";

import { Note, NoteTypes } from '../../types';
import { Dispatch, UnknownAction, ActionCreatorWithPayload } from '@reduxjs/toolkit';

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
// const firestoreDB = firebase.firestore();

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
  batch.set(targetDocRef, { ...note, updatedBy: email, updatedAt: serverTimestamp(), createdBy: email, createdAt: serverTimestamp() });

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

export const listenForTodosUpdates = (dispatch: Dispatch<UnknownAction>, 
    addTodo: ActionCreatorWithPayload<Note, "noteTaking/addTodo">, 
    updateInProgress: ActionCreatorWithPayload<{ id: string; value: Note; }, "noteTaking/updateTodo">, 
    removeInProgress: ActionCreatorWithPayload<string, "noteTaking/removeTodo">,
    email: string) => {
  const todosCollectionRef = collection(db, "todo");

  // Attach a listener to the collection
  const unsubscribe = onSnapshot(todosCollectionRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
          const docData = change.doc.data();
          if(docData.updatedBy === email) return;
          if (change.type === "added") {
              dispatch(addTodo(docData as Note));
          }
          if (change.type === "modified") {
              dispatch(updateInProgress({id: docData.id, value: docData as Note}))
          }
          if (change.type === "removed") {
              dispatch(removeInProgress(docData.id));
          }
      });

  });

  return unsubscribe;
}

export const listenForInProgressesUpdates = (dispatch: Dispatch<UnknownAction>, addTodo: ActionCreatorWithPayload<Note, "noteTaking/addInProgress">, 
  updateTodo: ActionCreatorWithPayload<{ id: string; value: Note; }, "noteTaking/updateInProgress">, 
  removeTodo: ActionCreatorWithPayload<string, "noteTaking/removeInProgress">, email: string) => {
  const todosCollectionRef = collection(db, "inProgress");

  // Attach a listener to the collection
  const unsubscribe = onSnapshot(todosCollectionRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
          const docData = change.doc.data();
          if(docData.updatedBy === email) return;
          if (change.type === "added") {
              dispatch(addTodo(docData as Note));
          }
          if (change.type === "modified") {
              dispatch(updateTodo({id: docData.id, value: docData as Note}))
          }
          if (change.type === "removed") {
              dispatch(removeTodo(docData.id));
          }
      });

  });

  return unsubscribe;
}

export const listenForDonesUpdates = (dispatch: Dispatch<UnknownAction>, addDone: ActionCreatorWithPayload<Note, "noteTaking/addDone">, 
  updateDone: ActionCreatorWithPayload<{ id: string; value: Note; }, "noteTaking/updateDone">, 
  removeDone: ActionCreatorWithPayload<string, "noteTaking/removeDone">, email: string) => {
  const todosCollectionRef = collection(db, "done");

  // Attach a listener to the collection
  const unsubscribe = onSnapshot(todosCollectionRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
          const docData = change.doc.data();
          if(docData.updatedBy === email) return;
          console.log("updated by: ", docData.updatedBy)
          if (change.type === "added") {
              console.log('document added')
              dispatch(addDone(docData as Note));
          }
          if (change.type === "modified") {
              console.log('document modified')
              dispatch(updateDone({id: docData.id, value: docData as Note}))
          }
          if (change.type === "removed") {
              console.log('document modified')
              dispatch(removeDone(docData.id));
          }
      });
  });

  return unsubscribe;
}

export const updateDescription = async(type: NoteTypes, note: Note, email: string) => {
  const docRef = doc(db, type, note.id as string);
  // const docRef = firestoreDB.collection(type).doc( note.id as string);
  const batch = writeBatch(db);
  // const colRef = collection(db, type)
  // const docRef = colRef.doc(note.id as string);
  // await docRef.update({description: note.description, updatedBy: email, updatedAt: serverTimestamp() });
  batch.update(docRef, {description: note.description, updatedBy: email, updatedAt: serverTimestamp() });

  // Commit the batch
  await batch.commit();
}

export const addComment = async(type: NoteTypes, note: Note, comment: {author: string, content: string, createdAt: string}) => {
  const docRef = doc(db, type, note.id as string);
  // const docRef = firestoreDB.collection(type).doc( note.id as string);
  const batch = writeBatch(db);
  // const colRef = collection(db, type)
  // const docRef = colRef.doc(note.id as string);
  // await docRef.update({description: note.description, updatedBy: email, updatedAt: serverTimestamp() });
  batch.update(docRef, {comments: [...(note.comments || []), comment] });

  // Commit the batch
  await batch.commit();
}