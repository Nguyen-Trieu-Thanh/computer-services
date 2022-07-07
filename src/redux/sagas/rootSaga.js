import { takeLatest } from "redux-saga/effects";

//Slices
import { getLogin, getRefreshAccessToken } from "../slices/authSlice";
import { createBooking, getBookings } from "../slices/bookingSlice";
import { getAccounts } from "../slices/accountSlice";

//Handlers
import {
  handleGetLogin,
  handleGetRefreshAccessToken,
} from "./handlers/authHandler";
import {
  handleGetBookings,
  handleCreateBooking,
} from "./handlers/bookingHandler";
import { handleGetAccounts } from "./handlers/accountHandler";

export function* watcherSaga() {
  yield takeLatest(getLogin.type, handleGetLogin);
  yield takeLatest(getBookings.type, handleGetBookings);
  yield takeLatest(getAccounts.type, handleGetAccounts);
  yield takeLatest(createBooking.type, handleCreateBooking);
  yield takeLatest(getRefreshAccessToken.type, handleGetRefreshAccessToken);
}
