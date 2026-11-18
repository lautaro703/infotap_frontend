import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDqmPDAhk40FiHp26mEinrMiGqDpRmV05o",
  authDomain: "infotap-280bc.firebaseapp.com",
  projectId: "infotap-280bc",
  storageBucket: "infotap-280bc.firebasestorage.app",
  messagingSenderId: "850203566833",
  appId: "1:850203566833:web:5ad37773d1b4d33f7e7f50",
  measurementId: "G-YY9YS6NFRS"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const proveedorGoogle = new GoogleAuthProvider()

proveedorGoogle.setCustomParameters({
    prompt: 'select_account',
})