"use strict";
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, dbName } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getSeats = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db(dbName);
    const data = await db.collection("seats").find().toArray();
    const bookedSeats = data.filter((seat) => {
      if (seat.isBooked) {
        return true;
      }
    });
    res.status(200).json({
      status: 200,
      message: "success",
      seats: data,
      bookedSeats: bookedSeats,
      numOfRows: 8,
      seatsPerRow: 12,
    });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
  client.close();
};

const bookSeat = async (req, res) => {
  const { fullName, email, creditCard, expiration, seatId } = req.body;

  if (!fullName || !email || !creditCard || !expiration || !seatId) {
    res.status(400).json({
      status: 400,
      data: req.body,
      message:
        "Incomplete request. Body requires fullName, email, creditCard, expiration, and seatId",
    });
    return;
  }

  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db(dbName);
    const query = { _id: seatId };
    const newValues = { $set: { isBooked: true } };
    await db.collection("seats").updateOne(query, newValues);
    await db.collection("reservations").insertOne(req.body);

    res.status(200).json({
      status: 200,
      message: `Your seat ${seatId} was successfully booked.`,
      order: req.body,
    });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({
      status: 500,
      message: err.message,
      data: req.body,
    });
  }
  client.close();
};

const getReservations = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db(dbName);
    const data = await db.collection("reservations").find().toArray();

    res.status(200).json({
      status: 200,
      message: "success",
      data,
    });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
  client.close();
};

const deleteRes = async (req, res) => {
  const { _id } = req.params;

  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db(dbName);
    await db.collection("reservations").deleteOne({ seatId: `${_id}` });
    const query = { _id };
    const newValues = { $set: { isBooked: false } };
    await db.collection("seats").updateOne(query, newValues);
    res.status(204).json({ status: 204, _id });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
};

const updateReservation = async (req, res) => {
  const { seatId, fullName, email } = req.body;
  const query = { seatId };
  const newValue = {
    $set: { fullName: fullName, email: email },
  };

  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db(dbName);
    await db.collection("reservations").updateOne(query, newValue);
    res.status(204).json({ status: 204, message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      data: req.body,
      message: err.stack,
    });
  }
  client.close();
};

module.exports = {
  getSeats,
  bookSeat,
  getReservations,
  deleteRes,
  updateReservation,
};
