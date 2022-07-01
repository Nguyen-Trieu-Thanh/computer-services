import { call, put } from "redux-saga/effects";
import { setUser, setIsLoggedIn } from "../../slices/authSlice";
import { setLoginLoading } from "../../slices/minorStateSlice";
import { requestGetLogin } from "../requests/authRequest";

export function* handleGetLogin(action) {
  yield put(setLoginLoading({ loginLoading: true }));
  const username = action.payload.username;
  const password = action.payload.password;

  const { response, error } = yield call(requestGetLogin, [username, password]);

  //Call API success
  if (response) {
    const data = response.data;
    localStorage.setItem("token", data.accessToken);
    yield put(
      setUser({
        name: "",
        role: data.role,
        isLoggedIn: true,
      })
    );
    yield put(setIsLoggedIn({ isLoggedIn: true }));
  }

  //Catch error
  // if (error) {
  //   yield put(setIsLoginCorrect({ isLoginCorrect: false }));
  // }

  yield put(setLoginLoading({ loginLoading: false }));
}
