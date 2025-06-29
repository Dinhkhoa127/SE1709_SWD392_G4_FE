import { combineReducers } from "redux";
import subjectReducer from "./subjectReducer";
import userReducer from "./userReducer";
import topicReducer from "./topicReducer";

const rootReducer = combineReducers({
    subjects: subjectReducer,
    user: userReducer,
    topics: topicReducer,
});

export default rootReducer;