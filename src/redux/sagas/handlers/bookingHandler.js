import { call, put } from "redux-saga/effects";
import { setLoading } from "../../slices/minorStateSlice";
import { setBookings } from "../../slices/bookingSlice";
import { requestGetBookings } from "../requests/bookingRequest";

export function* handleGetBookings(action) {
  yield put(setLoading({ loading: true }));
  const { response, error } = yield call(requestGetBookings);

  //Call API success
  if (response) {
    const data = response.data;

    yield put(setBookings({ data: data }));
    yield put(setLoading({ loading: false }));
  }

  //Catch error
}
