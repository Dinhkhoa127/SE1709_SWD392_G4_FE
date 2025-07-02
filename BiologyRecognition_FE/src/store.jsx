import { createStore, applyMiddleware } from "redux";
import * as ReduxThunk from "redux-thunk";
import rootReducer from "./redux/reducer/rootReducer";
import { persistStore, persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session"; // Sử dụng session storage

const persistConfig = {
  key: "root",
  storage: sessionStorage,
  whitelist: ["user", "project"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer, applyMiddleware(ReduxThunk.thunk || ReduxThunk.default));

const persistor = persistStore(store);

export { store, persistor }; 