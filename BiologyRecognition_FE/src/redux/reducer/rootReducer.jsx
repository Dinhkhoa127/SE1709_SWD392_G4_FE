import { combineReducers } from "redux";
import subjectReducer from "./subjectReducer";
import userReducer from "./userReducer";
import chapterReducer from "./chapterReducer";

const rootReducer = combineReducers({
    subjects: subjectReducer,
    user: userReducer,
    chapters: chapterReducer,
});

export default rootReducer;