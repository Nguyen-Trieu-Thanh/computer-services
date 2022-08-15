const OrderData = [
  {
    id: "O1",
    code: 748451,
    bookingCode: 274005,
    customerName: "Molly",
    phoneNumber: "(981) 521-2343",
  },
  {
    id: "O2",
    code: 240324,
    bookingCode: 748910,
    customerName: "Rocha",
    phoneNumber: "(855) 516-3733",
  },
  {
    id: "O3",
    code: 323536,
    bookingCode: 314969,
    customerName: "Sondra",
    phoneNumber: "(934) 482-2162",
  },
  {
    id: "O4",
    code: 981955,
    bookingCode: 624077,
    customerName: "Lidia",
    phoneNumber: "(923) 564-2218",
  },
  {
    id: "O5",
    code: 106149,
    bookingCode: 280522,
    customerName: "Rosanne",
    phoneNumber: "(846) 496-2190",
  },
  {
    id: "O6",
    code: 150245,
    bookingCode: 125719,
    customerName: "Long",
    phoneNumber: "(970) 405-2613",
  },
  {
    id: "O7",
    code: 798818,
    bookingCode: 190484,
    customerName: "Finch",
    phoneNumber: "(908) 426-3651",
  },
  {
    id: "O8",
    code: 142217,
    bookingCode: 183633,
    customerName: "Letitia",
    phoneNumber: "(913) 429-3664",
  },
  {
    id: "O9",
    code: 605572,
    bookingCode: 696438,
    customerName: "Jessie",
    phoneNumber: "(897) 439-2917",
  },
  {
    id: "O10",
    code: 987147,
    bookingCode: 488190,
    customerName: "Liza",
    phoneNumber: "(897) 410-2175",
  },
  {
    id: "O11",
    code: 996628,
    bookingCode: 713213,
    customerName: "Craig",
    phoneNumber: "(998) 458-2536",
  },
  {
    id: "O12",
    code: 358125,
    bookingCode: 544867,
    customerName: "Hester",
    phoneNumber: "(987) 460-2510",
  },
  {
    id: "O13",
    code: 716977,
    bookingCode: 513884,
    customerName: "Webster",
    phoneNumber: "(851) 501-3985",
  },
  {
    id: "O14",
    code: 690246,
    bookingCode: 156486,
    customerName: "Phelps",
    phoneNumber: "(830) 493-2634",
  },
  {
    id: "O15",
    code: 724605,
    bookingCode: 312607,
    customerName: "Aida",
    phoneNumber: "(819) 582-2878",
  },
  {
    id: "O16",
    code: 462781,
    bookingCode: 712207,
    customerName: "Gray",
    phoneNumber: "(850) 523-3268",
  },
  {
    id: "O17",
    code: 185800,
    bookingCode: 521797,
    customerName: "Boyle",
    phoneNumber: "(895) 500-3981",
  },
  {
    id: "O18",
    code: 918634,
    bookingCode: 277837,
    customerName: "Randolph",
    phoneNumber: "(873) 495-3806",
  },
  {
    id: "O19",
    code: 930208,
    bookingCode: 499080,
    customerName: "Ofelia",
    phoneNumber: "(898) 474-2614",
  },
  {
    id: "O20",
    code: 641587,
    bookingCode: 256222,
    customerName: "Cook",
    phoneNumber: "(825) 579-3715",
  },
  {
    id: "O21",
    code: 549817,
    bookingCode: 237352,
    customerName: "Waters",
    phoneNumber: "(833) 569-2189",
  },
  {
    id: "O22",
    code: 268236,
    bookingCode: 722324,
    customerName: "English",
    phoneNumber: "(990) 442-3617",
  },
  {
    id: "O23",
    code: 321142,
    bookingCode: 840774,
    customerName: "Terry",
    phoneNumber: "(897) 481-2414",
  },
  {
    id: "O24",
    code: 972733,
    bookingCode: 296355,
    customerName: "Mckinney",
    phoneNumber: "(947) 411-2921",
  },
  {
    id: "O25",
    code: 259848,
    bookingCode: 196837,
    customerName: "Ines",
    phoneNumber: "(806) 543-2511",
  },
];

export default OrderData;

/* 
[
  '{{repeat(25, 25)}}',
  {
    id: 'O{{index(1)}}',
    code: '{{integer([100000], [999999])}}',
    bookingCode: '{{integer([100000], [999999])}}',
    customerName: '{{firstName()}}',
    phoneNumber: '{{phone()}}'
  }
]
*/