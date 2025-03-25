  import { initializeApp } from "firebase/app";
  
  import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
  import { useDispatch } from 'react-redux';
  import { login, register } from "./redux/action/userAction.js";
  

  
   
  
  const firebaseConfig = {
    apiKey: "AIzaSyCeHJvzlhWNztMy7F624O5GJcdqGDsyv6o",
    authDomain: "userdashboard-925d4.firebaseapp.com",
    projectId: "userdashboard-925d4",
    storageBucket: "userdashboard-925d4.firebasestorage.app",
    messagingSenderId: "593601006595",
    appId: "1:593601006595:web:0eaeee32dcae77a13c1236",
    measurementId: "G-2F5VCYGNFP"
  };


  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // Function to handle Google login
  export const signInWithGoogle = async (dispatch) => {
    
    try {
      const result = await signInWithPopup(auth, provider);
      const usrdata = {
        uid: result.user.uid,
        email: result.user.email,
      }
      dispatch(login(usrdata));
      return result.user;
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };


  // Email & Password Login
  export const loginWithEmail = async (dispatch,email, password) => {
  
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      const usrdata = {
        uid: result.user.uid,
        email: result.user.email,
      }
      dispatch(login(usrdata));

      return result.user;
    } catch (error) {
      throw error;
    }
  }

  // Register New User
  export const registerWithEmail = async (email, password) => {
    const dispatch = useDispatch();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      const usrdata = {
        uid: result.user.uid, 
        email: result.user.email,
        displayName: result.user.displayName || "",
        photoURL: result.user.photoURL || "",
      }
      dispatch(register(usrdata));
    

      return result.user;
    } catch (error) {
      throw error;
    }
  };
  

  // Function to handle logout
  export const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  export { auth };
