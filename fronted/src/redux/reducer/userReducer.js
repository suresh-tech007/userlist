import {  
  CLEAR_ERRORS,  
  GET_ALL_USER_FAIL, GET_ALL_USER_REQUEST, GET_ALL_USER_SUCCESS,  
  GET_USER_DETAILS_SUCCESS, GET_USER_PROFILE_FAIL, GET_USER_PROFILE_REQUEST,  
  GET_USER_PROFILE_SUCCESS,  
  LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS,  
  LOGOUT_FAIL, LOGOUT_REQUEST, LOGOUT_SUCCESS,  
  REGISTER_FAIL, REGISTER_REQUEST, REGISTER_SUCCESS  
} from "../constant/userContant.js";

export const userReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case LOGOUT_REQUEST:
    case GET_USER_PROFILE_REQUEST:
      return {
        ...state, // Keep existing state
        loading: true,
        isAuthenticated: false,
      };

    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
      };

    case GET_USER_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        userDetails: action.payload.user, // Ensure correct data assignment
      };

    case LOGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        user: null,
        isAuthenticated: false,
        message: action.payload.message || "Logged out successfully",
      };

    case LOGIN_FAIL:
    case REGISTER_FAIL:
    case LOGOUT_FAIL:
    case GET_USER_PROFILE_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        message: null,
      };

    default:
      return state;
  }
};

// Reducer for getting all users
export const allUsersReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ALL_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_ALL_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload.data || action.payload.users, // Ensure correct key
      };

    case GET_ALL_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        message: null,
      };

    default:
      return state;
  }
};
