import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import { allUsersReducer, userReducer } from "./reducer/userReducer.js";

 

 

const reducer = combineReducers({
  user: userReducer,
  alluser: allUsersReducer,
  
});

let initailState = {
   
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initailState,
  applyMiddleware(...middleware)
);

export default store;
