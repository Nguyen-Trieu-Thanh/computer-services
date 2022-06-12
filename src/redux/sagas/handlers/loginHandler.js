import { call, put } from "redux-saga/effects";
import { setLogin } from "../../slices/loginSlice";
import { requestGetLogin } from "../requests/loginRequest";

export function* handleGetLogin(action) {
  const email = action.payload.email;
  const password = action.payload.password;

  const role = yield call(requestGetLogin, [email, password]);

  //Call API success
  if (role !== 0) {
    yield put(setLogin({ role: role }));
  }

  //Catch error
  if (role === 0) {
    yield put(setLogin({ role: role }));
  }
}
