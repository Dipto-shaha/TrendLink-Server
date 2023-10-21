const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config()

const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

const port= process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



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
    //await client.connect();
    // Send a ping to confirm a successful connection
    const Collection = client.db("trendLink").collection("product");
    const CollectionCartProduct = client.db("trendLink").collection("cart");


    //await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");


    // Selected brand Produt
    app.get(`/branddetails/:brand`, async (req, res) => {
      const brand=req.params.brand;
      console.log("Single Barand all Product request ",brand);
      const result = await Collection.find({brand:brand}).toArray();
      res.send(result);
    });

    // Selected Single Product
    app.get('/productDetails/:_id',async(req,res)=>{
      const id = req.params._id;
      console.log("Single Product request " ,id);
      const result = await Collection.findOne({ _id: new ObjectId(id) });
      return res.send(result);

    })
    // Cart Product
    app.get('/saveCartProduct/:userId',async(req,res)=>{
      const userId= req.params.userId;
      console.log("Cart Prouct get by mail address ",userId);
      const result = await CollectionCartProduct.find({ user_id: userId }).toArray();
      return res.send(result);

    })
    //Add Product
    app.post("/addproduct", async (req, res) => {
      const product = req.body;
      console.log("Product Add request");
      const result = await Collection.insertOne(product);
      res.send(result);
    });
    //Save Cart Product
    app.post("/saveCartProduct",async(req,res)=>{
      const cartProduct = req.body;
      console.log("Save Cart Prouct with mail address ",cartProduct);
      const result = await CollectionCartProduct.insertOne(cartProduct);
      res.send(result);
    })
    app.put("/updateProduct/:_id", async (req, res) => {
      const id = req.params._id;
      console.log("Update Product ",id);
      const product = req.body;
      console.log(id);
      const result = await Collection.updateOne(
        { _id: new ObjectId(id) }, // Find Data by query many time query type is "_id: id" Cheack on database
        {
          $set: product, // Set updated Data
        },
        { upsert: true } // define work
      );
      res.send({ result });
    });
    app.delete("/cartDelete/:_id", async (req, res) => {
      const id = req.params._id;
      console.log("Product delted from Cart request ",id);
      const result = await CollectionCartProduct.deleteOne({productId: id });
      res.send(result);
    });
    app.get("/check",(req,res)=>{
      res.send("Database Problem");
    })
    
  
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


