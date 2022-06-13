import { takeLatest } from "redux-saga/effects";
import { getLogin } from "../slices/loginSlice";
import { handleGetLogin } from "./handlers/loginHandler";

export function* watcherSaga() {
  yield takeLatest(getLogin.type, handleGetLogin);
}
