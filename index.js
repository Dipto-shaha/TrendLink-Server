const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

const express = require("express");
const cors = require("cors");
const app = express();
const port= process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECRET_KEY}@cluster0.bnmqd0w.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const Collection = client.db("trendLink").collection("product");

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.get(`/branddetails/:brand`, async (req, res) => {
      const result = await Collection.find().toArray();
      res.send(result);
      });
    app.get('/productDetails/:_id',async(req,res)=>{
      const id = req.params._id;
      const result = await Collection.findOne({ _id: new ObjectId(id) });
      return res.send(result);

    })
    app.post("/addproduct", async (req, res) => {
      const product = req.body;
      const result = await Collection.insertOne(product);
      res.send(result);
    });
    
  
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Hello');
})

app.listen(port, () => {
    console.log('Server is runding on ',port);
})


