import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import {
  signInWithGoogle,
  loginWithEmail,
  registerWithEmail,
  uploadProfileImage,
} from "../fireabaseAuth.js"; // Ensure functions are properly imported
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, register } from "../redux/action/userAction"; 

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      const loggedInUser = await signInWithGoogle(dispatch);
      if (loggedInUser) {
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Email/Password Login
  const handleEmailLogin = async () => {
    try {
      const loggedInUser = await loginWithEmail(dispatch, email, password);
      if (loggedInUser) {
        dispatch(login(loggedInUser));
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        navigate("/dashboard");
      }
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Email/Password Registration
  const handleRegister = async () => {
    try {
      let profileImageUrl = "";
      if (profileImage) {
        profileImageUrl = await uploadProfileImage(profileImage);
      }
      console.log("Profile Image URL:", profileImageUrl);

      const newUser = await registerWithEmail(dispatch, email, password, profileImageUrl);
      if (newUser) {
        // dispatch(register(newUser));
        localStorage.setItem("user", JSON.stringify(newUser));
        navigate("/dashboard");
      }
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          {isRegistering ? "Register" : "Login"}
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Email & Password Input Fields */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Profile Image Upload (only for registration) */}
        {isRegistering && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files[0])}
            className="w-full p-2 border rounded-lg mb-4"
          />
        )}

        {/* Login / Register Button */}
        {isRegistering ? (
          <button
            onClick={handleRegister}
            className="bg-green-500 text-white py-2 w-full rounded-lg font-semibold hover:bg-green-600 transition duration-300"
          >
            Register
          </button>
        ) : (
          <button
            onClick={handleEmailLogin}
            className="bg-blue-500 text-white py-2 w-full rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        )}

        {/* Toggle Between Login & Register */}
        <p
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-blue-500 text-sm mt-3 cursor-pointer text-center"
        >
          {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
        </p>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="mt-4 flex items-center justify-center gap-2 bg-red-500 text-white py-2 w-full rounded-lg font-semibold hover:bg-red-600 transition duration-300"
        >
          <FaGoogle />
          Login with Google
        </button>
      </div>
    </div>
  );
}
