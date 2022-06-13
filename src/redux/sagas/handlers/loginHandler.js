import { call, put } from "redux-saga/effects";
import { setIsLoginCorrect, setLogin } from "../../slices/loginSlice";
import { requestGetLogin } from "../requests/loginRequest";

export function* handleGetLogin(action) {
  const email = action.payload.email;
  const password = action.payload.password;

  const { response, error } = yield call(requestGetLogin, [email, password]);

  //Call API success
  if (response) {
    yield put(setIsLoginCorrect({ isLoginCorrect: true }));
  }

  //Catch error
  if (error) {
    yield put(setIsLoginCorrect({ isLoginCorrect: false }));
  }
}
