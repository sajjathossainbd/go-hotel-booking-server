const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8i4eibr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    const roomsCollection = client
      .db("roomsDB")
      .collection("rooms");

    app.get("/rooms", async (req, res) => {
      const cursor = roomsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });


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
