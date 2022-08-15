const dates = ["11/08/2022", "12/08/2022", "13/06/2022"];
const datas = [
  "Tổng số lịch hẹn",
  "Số đơn hàng đã hoàn thành",
  "Số khách hàng mới",
];
const type = "day"; //month

const res = [
  {
    name: "Tổng số lịch hẹn",
    data: [12, 14, 25],
  },
  {
    name: "Số đơn hàng đã hoàn thành",
    data: [4, 6, 15],
  },
];

for (let i = 0; i <= dates.length; i++) {
  const result = bookings.find((x) => x.updateAt === dates[i]);
  if (result === undefined) {
    return 0;
  }
}
