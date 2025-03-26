import { 
    createUserWithEmailAndPassword, 
    getAuth, 
    GoogleAuthProvider, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut 
  } from "firebase/auth";
  import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import { login, register } from "./redux/action/userAction.js"; 
  import { app, auth, storage } from "./firebase"; // Import initialized instances
  import axios from "axios";
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const provider = new GoogleAuthProvider();
  
  async function checkIfEmailExists(email) {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      
      if (signInMethods.length > 0) {
        return true; 
      } else {
        return false; // Email does not exist
      }
    } catch (error) {
      console.error("Error checking email:", error.message);
      return false;
    }
  }
  
  export const  signInWithGoogle = async (dispatch) => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result?.user;
  
        if (!user) throw new Error("Google Sign-In failed!");
  
        const emailExists = await checkIfEmailExists(user.email);
  
        const usrdata = {
            uid: user.uid,
            email: user.email,
            photoURL: user.photoURL,
            displayName: user.displayName,
        };
  
        // ✅ If email is new, register in Redux store and backend
        if (!emailExists) {
          
            dispatch(register(usrdata)); // Backend me save hoga
            console.log("✅ User registered in backend via Redux.");
        } else {
            console.log("✅ User already exists, logging in.");
        }
  
        dispatch(login(usrdata));
        return user;
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        throw error;
    }
  };
  
  // ✅ Email & Password Login
  export const loginWithEmail = async (dispatch, email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const usrdata = {
        uid: result.user.uid,
        email: result.user.email,
      };
      dispatch(login(usrdata));
      return result.user;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };
  
  // ✅ Register New User
  export const registerWithEmail = async (dispatch, email, password, profileImageUrl = "") => {
    try {
      if (!email || !password || !profileImageUrl) {
        throw new Error("Email,profileImageUrl  and Password are required");
      }
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const usrdata = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || "",
        photoURL: profileImageUrl || result.user.photoURL || "",
      };
      dispatch(register(usrdata));
      return result.user;
    } catch (error) {
      console.error("Registration Error:", error);
      throw error;
    }
  };
  


// Upload Profile Image to Local Server
export const uploadProfileImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    console.log("Image File:", imageFile);

    const response = await axios.post(`${BACKEND_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Image Upload Response:", response?.data);
    return response.data.url;
  } catch (error) {
    console.error("Image Upload Failed!", error);
    return "";
  }
};
  
  // ✅ Function to handle logout
  export const logout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };
  