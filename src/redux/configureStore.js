import { combineReducers, configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { watcherSaga } from "./sagas/rootSaga";

//Reducers
import loginReducer from "./slices/loginSlice";
import bookingReducer from "./slices/bookingSlice";
import minorStateReducer from "./slices/minorStateSlice";

const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers({
  login: loginReducer,
  booking: bookingReducer,
  minorState: minorStateReducer,
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
