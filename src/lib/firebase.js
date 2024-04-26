import {initializeApp} from "firebase/app";
import {createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword} from "firebase/auth";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    limit,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB1XBBljaX_4NFIlCYdpOfl8KOlfXag8ds",
    authDomain: "chat-app-9711a.firebaseapp.com",
    projectId: "chat-app-9711a",
    storageBucket: "chat-app-9711a.appspot.com",
    messagingSenderId: "840013634949",
    appId: "1:840013634949:web:e2e5ee4a54aba2bfba78ec",
    measurementId: "G-E9RMYP3MLQ"

};


const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();

export function getUserCollection(userId, collectionName) {
  return collection(db, `users/${userId}/${collectionName}`);
}

export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit,
  deleteDoc,
  updateDoc,
};