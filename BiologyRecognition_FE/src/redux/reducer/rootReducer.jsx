import { combineReducers } from "redux";
import subjectReducer from "./subjectReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
    subjects: subjectReducer,
    user: userReducer,
});

export default rootReducer;