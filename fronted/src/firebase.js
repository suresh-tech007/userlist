import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCeHJvzlhWNztMy7F624O5GJcdqGDsyv6o",
  authDomain: "userdashboard-925d4.firebaseapp.com",
  projectId: "userdashboard-925d4",
  storageBucket: "userdashboard-925d4.appspot.com",
  messagingSenderId: "593601006595",
  appId: "1:593601006595:web:0eaeee32dcae77a13c1236",
  measurementId: "G-2F5VCYGNFP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

export { app, auth, storage };
