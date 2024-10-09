import { auth } from './FirebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth';

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return doCreateUserWithEmailAndPassword(auth, email, password);
}