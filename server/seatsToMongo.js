require("isomorphic-fetch");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, dbName } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let arrObject = [];

const sendSeatsToMongo = async (arr) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db(dbName);
    await db.collection("seats").insertMany(arr);
    console.log("success");
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};

fetch("http://localhost:5678/api/seat-availability")
  .then((res) => res.json())
  .then((ans) => {
    Object.keys(ans.bookedSeats).forEach((bookedSeatID) => {
      ans.seats[bookedSeatID].isBooked = true;
    });
    Object.keys(ans.seats).forEach((seatID, i) => {
      arrObject.push({
        _id: Object.keys(ans.seats)[i],
        price: ans.seats[seatID].price,
        isBooked: ans.seats[seatID].isBooked,
      });
    });

    sendSeatsToMongo(arrObject);
    return;
  });
