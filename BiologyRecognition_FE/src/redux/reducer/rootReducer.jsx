import { combineReducers } from "redux";
import subjectReducer from "./subjectReducer";
import userReducer from "./userReducer";
import topicReducer from "./topicReducer";
import artifactReducer from "./artifactReducer";
import articleReducer from "./articleReducer";

const rootReducer = combineReducers({
    subjects: subjectReducer,
    user: userReducer,
    topics: topicReducer,
    artifacts: artifactReducer,
    articles: articleReducer,
});

export default rootReducer;