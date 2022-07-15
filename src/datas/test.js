const orders = [
  {
    id: "O1",
    booking_id: "B1",
    services: [
      {
        service_id: "S1",
        accessory_id: "AC1",
      },
    ],
  },
  {
    id: "O2",
    booking_id: "B1",
    services: [
      {
        service_id: "S1",
        accessory_id: "AC2",
      },
    ],
  },
];

const services = [
  {
    id: "S1",
    accessories_id: ["AC1", "AC2"],
  },
];

const accessories = [
  {
    id: "AC1",
    name: "RAM",
  },
  {
    id: "AC2",
    name: "CPU",
  },
];
