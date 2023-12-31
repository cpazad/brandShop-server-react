const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app =express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yiwkd5s.mongodb.net/?retryWrites=true&w=majority`;

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

    const carCollection = client.db('carDB').collection('car')
    
    app.get('/product', async(req, res)=>{
        const cursor = carCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get('/product/:id([0-9a-fA-F]{24})', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await carCollection.findOne(query);
      res.send(result);
    })
    // app.get('/product/:brandname', async(req, res)=>{
    //   const brandname = req.params.brandname;
    //   const query = {brandname: new ObjectId(brandname)}
    //   const result = await carCollection.findOne(query);
    //   res.send(result);
    // })
    
    app.post('/product', async(req, res)=>{
        const newProduct = req.body;
        console.log(newProduct)
        const result = await carCollection.insertOne(newProduct);
        res.send(result);
    })

    app.put('/product/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id:new ObjectId(id)}
      const options = {updsert:true} 
      const updateCar = req.body;
      const car = {
        $set:{
          name:updateCar.name,
          brandname:updateCar.brandname,
          logo:updateCar.logo,
          image:updateCar.image,
          type:updateCar.type,
          price:updateCar.price,
          rating:updateCar.rating,
          details:updateCar.details
        }
      }
      const result = await carCollection.updateOne(filter, car, options)
      res.send(result)
    })

    app.delete('/product/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await carCollection.deleteOne(query);
      res.send(result);
  })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
res.send('Brand Shop Server is running')
})

app.listen(port, ()=>{
    console.log(`Brand server is running on port: ${port}`)
})