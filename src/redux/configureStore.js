import { combineReducers, configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { watcherSaga } from "./sagas/rootSaga";

//Reducers
import bookingReducer from "./slices/bookingSlice";
import accountReducer from "./slices/accountSlice";
import minorStateReducer from "./slices/minorStateSlice";
import toastReducer from "./slices/toastSlice";
import authReducer from "./slices/authSlice";

const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers({
  booking: bookingReducer,
  account: accountReducer,
  minorState: minorStateReducer,
  toast: toastReducer,
  auth: authReducer,
});

const middleware = [sagaMiddleware];

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({ thunk: false }),
    ...middleware,
  ],
});

sagaMiddleware.run(watcherSaga);

export default store;
