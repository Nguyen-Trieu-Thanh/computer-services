import { configureStore } from "@reduxjs/toolkit";

//Reducers
import accountReducer from "./slices/account/accountSlice";
import { apiSlice } from "./slices/apiSlice";
import authReducer from "./slices/auth/authSlice";
import bookingReducer from "./slices/booking/bookingSlice";
import minorStateReducer from "./slices/minorState/minorStateSlice";
import toastReducer from "./slices/toast/toastSlice";
import serviceReducer from "./slices/service/serviceSlice";
import accessoryReducer from "./slices/accessory/accessorySlice";
import scheduleReducer from "./slices/schedule/scheduleSlice";

// const sagaMiddleware = createSagaMiddleware();

// const reducer = combineReducers({
//   booking: bookingReducer,
//   account: accountReducer,
//   minorState: minorStateReducer,
//   toast: toastReducer,
//   auth: authReducer,
// });

// const middleware = [sagaMiddleware];

// const store = configureStore({
//   reducer,
//   middleware: (getDefaultMiddleware) => [
//     ...getDefaultMiddleware({ thunk: false }),
//     ...middleware,
//   ],
// });

// sagaMiddleware.run(watcherSaga);

// export default store;

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    booking: bookingReducer,
    account: accountReducer,
    minorState: minorStateReducer,
    toast: toastReducer,
    auth: authReducer,
    service: serviceReducer,
    accessory: accessoryReducer,
    schedule: scheduleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
