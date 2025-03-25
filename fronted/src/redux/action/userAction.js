import axios from "axios";
import {  
  CLEAR_ERRORS, 
  GET_ALL_USER_FAIL, GET_ALL_USER_REQUEST, GET_ALL_USER_SUCCESS, 
  GET_USER_PROFILE_FAIL, GET_USER_PROFILE_REQUEST, GET_USER_PROFILE_SUCCESS,  
  LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS,  
  REGISTER_FAIL, REGISTER_REQUEST, REGISTER_SUCCESS  
} from "../constant/userContant";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// LOGIN ACTION ==>
export const login = (formdata) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.post(
      `${BACKEND_URL}/api/users/login`,
      formdata,
      config
    );

    dispatch({ type: LOGIN_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response ? error.response.data.error : "Unauthorized: Invalid email or password",
    });
  }
};

// REGISTER ACTION ==>
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" }, // Use JSON format if no file
      withCredentials: true,
    };

    const { data } = await axios.post(
      `${BACKEND_URL}/api/users/register`,
      userData,
      config
    );

    dispatch({ type: REGISTER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: REGISTER_FAIL,
      payload: error.response ? error.response.data.error : "Something went wrong",
    });
  }
};

// Load User ==>
export const loaduser = (userId) => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_PROFILE_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.get(`${BACKEND_URL}/users/user_details/${userId}`, config);

    dispatch({ type: GET_USER_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_USER_PROFILE_FAIL,
      payload: error.response ? error.response.data.error : "Unauthorized: Invalid email or password",
    });
  }
};

// Get All Users ==>
export const getAllusers = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_USER_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
   
    console.log("Sending request to:", `${BACKEND_URL}/users`);
    const {data} = await axios.get(`${BACKEND_URL}/users`, config);
    

    console.log("Response received:", data.users); // Yaha response print hoga
     
    dispatch({ type: GET_ALL_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_ALL_USER_FAIL,
      payload: error.response ? error.response.data.error : "Something went wrong",
    });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
