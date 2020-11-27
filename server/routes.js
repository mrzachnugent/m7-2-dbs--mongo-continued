const router = require("express").Router();
const {
  getSeats,
  bookSeat,
  getReservations,
  deleteRes,
  updateReservation,
} = require("./handlers");

const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;

// Code that is generating the seats.
// ----------------------------------
// const seats = {};
// const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
// for (let r = 0; r < row.length; r++) {
//   for (let s = 1; s < 13; s++) {
//     seats[`${row[r]}-${s}`] = {
//       price: 225,
//       isBooked: false,
//     };
//   }
// }
// ----------------------------------
//////// HELPERS
const getRowName = (rowIndex) => {
  return String.fromCharCode(65 + rowIndex);
};

const randomlyBookSeats = (num) => {
  const bookedSeats = {};

  while (num > 0) {
    const row = Math.floor(Math.random() * NUM_OF_ROWS);
    const seat = Math.floor(Math.random() * SEATS_PER_ROW);

    const seatId = `${getRowName(row)}-${seat + 1}`;

    bookedSeats[seatId] = true;

    num--;
  }

  return bookedSeats;
};

let state;

router.get("/api/seat-availability", getSeats);

router.get("/api/reservations", getReservations);
router.put("/api/reservations", updateReservation);

router.delete("/api/delete/:_id", deleteRes);
// async (req, res) => {
//   if (!state) {
//     state = {
//       bookedSeats: randomlyBookSeats(30),
//     };
//   }

//   return res.json({
//     seats: seats,
//     bookedSeats: state.bookedSeats,
//     numOfRows: 8,
//     seatsPerRow: 12,
//   });
// });

let lastBookingAttemptSucceeded = false;

router.post("/api/book-seat", bookSeat);

// async (req, res) => {
//   const { seatId, creditCard, expiration } = req.body;

//   if (!state) {
//     state = {
//       bookedSeats: randomlyBookSeats(30),
//     };
//   }

//   await delay(Math.random() * 3000);

//   const isAlreadyBooked = !!state.bookedSeats[seatId];
//   if (isAlreadyBooked) {
//     return res.status(400).json({
//       message: "This seat has already been booked!",
//     });
//   }

//   if (!creditCard || !expiration) {
//     return res.status(400).json({
//       status: 400,
//       message: "Please provide credit card information!",
//     });
//   }

//   if (lastBookingAttemptSucceeded) {
//     lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;

//     return res.status(500).json({
//       message: "An unknown error has occurred. Please try your request again.",
//     });
//   }

//   lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;

//   state.bookedSeats[seatId] = true;

//   return res.status(200).json({
//     status: 200,
//     success: true,
//   });
// });

module.exports = router;
