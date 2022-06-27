import { takeLatest } from "redux-saga/effects";

//Slices
import { getLogin } from "../slices/loginSlice";
import { getBookings } from "../slices/bookingSlice";

//Handlers
import { handleGetLogin } from "./handlers/loginHandler";
import { handleGetBookings } from "./handlers/bookingHandler";

export function* watcherSaga() {
  yield takeLatest(getLogin.type, handleGetLogin);
  yield takeLatest(getBookings.type, handleGetBookings);
}
