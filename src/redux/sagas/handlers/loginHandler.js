import { call, put } from "redux-saga/effects";
import { setIsLoginCorrect, setLogin } from "../../slices/loginSlice";
import { requestGetLogin } from "../requests/loginRequest";

export function* handleGetLogin(action) {
  const username = action.payload.username;
  const password = action.payload.password;

  const { response, error } = yield call(requestGetLogin, [username, password]);

  //Call API success
  console.log(response);
  // if (response) {
  //   yield put(setIsLoginCorrect({ isLoginCorrect: true }));
  // }

  //Catch error
  if (error) {
    yield put(setIsLoginCorrect({ isLoginCorrect: false }));
  }
}
