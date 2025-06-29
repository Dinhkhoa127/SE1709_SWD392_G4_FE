import { combineReducers } from "redux";
import subjectReducer from "./subjectReducer";
import userReducer from "./userReducer";
<<<<<<< HEAD
import chapterReducer from "./chapterReducer";
=======
>>>>>>> e19e7a94f29870a9832573f66fcd199990bce730

const rootReducer = combineReducers({
    subjects: subjectReducer,
    user: userReducer,
<<<<<<< HEAD
    chapters: chapterReducer,
=======
>>>>>>> e19e7a94f29870a9832573f66fcd199990bce730
});

export default rootReducer;