const express = require("express");
const cors = require("cors");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const port = process.env.PORT || 8000;
const app = express();
app.use(cors());
app.use(BodyParser.json());
app.use(express.static("homeService"));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fvccc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const usersCollection = client.db("emergency_medical").collection("users");
  const doctorsCollection = client
    .db("emergency_medical")
    .collection("doctors");

  console.log("Emergency Medical DataBase Connected");

  // Root Route
  app.get("/", (req, res) => res.send("Welcome To Emergency Medical Database"));

  //DOCTORS POST API
  app.post("/doctors", async (req, res) => {
    const doctors = req.body;
    const result = await doctorsCollection.insertOne(doctors);
    // console.log(result);
    res.json(result);
  });
});

app.listen(port, (err) =>
  err
    ? console.log("Filed to Listen on Port", port)
    : console.log("Listing for Port", port)
);
