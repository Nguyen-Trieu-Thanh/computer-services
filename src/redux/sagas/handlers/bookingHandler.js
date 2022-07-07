import { call, put } from "redux-saga/effects";
import {
  setCreateBookingLoading,
  setLoading,
  setShowConfirmCreateBooking,
} from "../../slices/minorStateSlice";
import { setToast } from "../../slices/toastSlice";
import { setBookings } from "../../slices/bookingSlice";
import {
  requestGetBookings,
  requestCreateBooking,
} from "../requests/bookingRequest";

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

export function* handleCreateBooking(action) {
  yield put(setCreateBookingLoading({ createBookingLoading: true }));

  const { response, error } = yield call(requestCreateBooking, [
    action.payload,
  ]);
  //Call API success
  if (response) {
    yield put(setCreateBookingLoading({ createBookingLoading: false }));
    yield put(
      setToast({
        show: true,
        title: "Tạo lịch hẹn",
        time: "just now",
        content: "Lịch hẹn được tạo thành công!",
        color: {
          header: "#dbf0dc",
          body: "#41a446",
        },
      })
    );
    yield put(setShowConfirmCreateBooking({ showConfirmCreateBooking: false }));
  }
  //Catch error
}
