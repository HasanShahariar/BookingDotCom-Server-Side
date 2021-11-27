const express = require("express");
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors')
const port = process.env.PORT || 4000;

//middleware
app.use(cors());
app.use(express.json());
const ObjectId = require('mongodb').ObjectId;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rroqn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
  try {
    await client.connect();
    const database = client.db("BookingDotCom");
    const servicesCollection = database.collection("services");
    const ordersCollection = database.collection("orders");
    const destinationCollection = database.collection("destinations");
    const exploreCollection = database.collection("explore");
    // create a document to insert
    //   GET API 
    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    //GET API FOR DESTINATION
    app.get('/destination', async (req, res) => {
      const cursor = destinationCollection.find({});
      const destination = await cursor.toArray();
      res.send(destination);
    });
    //GET API FOR EXPLORE
    app.get('/explore', async (req, res) => {
      const cursor = exploreCollection.find({});
      const explore = await cursor.toArray();
      res.send(explore);
    });




    // GET API with id 
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;

      

      const query = {_id: ObjectId(id)}
      console.log("serviceId");
      const service = await servicesCollection.findOne(query)
      console.log("load user id", id);
      res.send(service)

    });

    // GET ORDER API
    app.get('/orders/:id', async (req, res) => {
      const id = req.params.id;

      const cursor = ordersCollection.find({ userId: id });
      const users = await cursor.toArray();
      res.send(users);

    });

    // UPDATE API PUT

    app.put('/order/:id', async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: "Approved"
        },
      };
      const result = await ordersCollection.updateOne(filter, updateDoc, options)
      console.log("update", id);
      res.send(result)
    });

    //  POST API
    app.post('/orders', async (req, res) => {

      const newOrder = req.body;
      console.log(newOrder);
      const result = await ordersCollection.insertOne(newOrder);

      console.log("post hitted", result);

      res.json(result);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
    })

    // DELETE 
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query)
      console.log("deleteing", id);
      res.json(result)
    })

    // GET ALL ORDERS API
    app.get('/orders', async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });



  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);









app.get('/',(req, res)=>{
    res.send("Running server")
})
app.listen(port, () => {
  console.log("Listening to port", port);

});