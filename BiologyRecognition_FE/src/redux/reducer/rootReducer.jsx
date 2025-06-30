import { combineReducers } from "redux";
import subjectReducer from "./subjectReducer";
import userReducer from "./userReducer";
import chapterReducer from "./chapterReducer";
import artifactTypeReducer from "./artifactTypeReducer";
import topicReducer from "./topicReducer";
import artifactReducer from "./artifactReducer";
import artifactMediaReducer from "./artifactMediaReducer";

const rootReducer = combineReducers({
    subjects: subjectReducer,
    user: userReducer,
    chapters: chapterReducer,
    artifactTypes: artifactTypeReducer,
    topics: topicReducer,
    artifacts: artifactReducer,
    artifactMedia: artifactMediaReducer,
});

export default rootReducer;