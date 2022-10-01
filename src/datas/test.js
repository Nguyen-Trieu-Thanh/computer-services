// const accessories = [
//   { id: 0, type: "", brand: "" },
//   { id: 1, type: "", brand: "" },
// ];

// const services = [];

const services2 = ["aaa", "bbb"];

const services = services2.map((x) => {
  return { name: x, deleted: false };
});

for (const service of services) {
  const notExist = await Service.findOne({ name: service });
  if (!notExist) {
    service.deleted = true;
    count++;
  } else if (a) {
    service.deleted = false;
    count++;
  }
}
