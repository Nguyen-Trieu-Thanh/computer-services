import { call, put } from "redux-saga/effects";
import { setAccounts } from "../../slices/accountSlice";
import { setLoading } from "../../slices/minorStateSlice";
import { requestGetAccounts } from "../requests/accountRequest";

export function* handleGetAccounts(action) {
  yield put(setLoading({ loading: true }));
  const { response, error } = yield call(requestGetAccounts);

  //Call API success
  if (response) {
    const data = response.data;
    yield put(setAccounts({ data: data }));
    yield put(setLoading({ loading: false }));
  }
  //Catch error
}
