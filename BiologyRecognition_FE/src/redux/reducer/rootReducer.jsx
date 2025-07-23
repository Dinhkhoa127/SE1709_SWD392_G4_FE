import { combineReducers } from "redux";
import subjectReducer from "./subjectReducer";
import chapterReducer from "./chapterReducer";
import userReducer from "./userReducer";
import topicReducer from "./topicReducer";
import artifactReducer from "./artifactReducer";
import artifactTypeReducer from "./artifactTypeReducer";
import artifactMediaReducer from "./artifactMediaReducer";
import articleReducer from "./articleReducer";
import recognitionReducer from "./recognitionReducer";


const rootReducer = combineReducers({
    subjects: subjectReducer,
    chapters: chapterReducer,
    user: userReducer,
    topics: topicReducer,
    artifacts: artifactReducer,
    artifactTypes: artifactTypeReducer,
    artifactMedia: artifactMediaReducer,
    articles: articleReducer,
    recognitions: recognitionReducer,
});

export default rootReducer;