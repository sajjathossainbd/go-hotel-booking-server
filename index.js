const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8i4eibr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const roomsCollection = client.db("roomsDB").collection("rooms");
    const myBookingCollection = client
      .db("myBookingDB")
      .collection("myBooking");

    app.get("/rooms", async (req, res) => {
      const minPrice = parseInt(req.query.minPrice) || 0;
      const maxPrice = parseInt(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;

      const pipeline = [
        {
          $match: {
            price_per_night: { $gte: minPrice, $lte: maxPrice },
          },
        },
      ];

      const cursor = roomsCollection.aggregate(pipeline);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/my-booking", async (req, res) => {
      const cursor = myBookingCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/rooms/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await roomsCollection.findOne(query);
      res.send(result);
    });

    app.post("/my-booking", async (req, res) => {
      const newMyRoom = req.body;
      const result = await myBookingCollection.insertOne(newMyRoom);
      res.send(result);
    });

    app.post("/");

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("GoHotel Booking Backend Server Running");
});

app.listen(port, () => {
  console.log(`GoHotel Booking Server Listening ${port}`);
});
