const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const cors = require("cors");
require("dotenv").config();

app.use(cors());

app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// console.log(process.env.USER_NAME, process.env.DB_KEY);

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.DB_KEY}@cluster0.m38robg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const brandAd = [
  {
    brand: "BMW",
    bgimg1: "https://i.ibb.co/QPCmzMW/bmwad1.jpg",
    bgimg2: "https://i.ibb.co/fqQ1NP2/bmwad2.jpg",
    bgimg3: "https://i.ibb.co/qMYQM2s/bmwad3.jpg",
  },
  {
    brand: "FORD",
    bgimg1: "https://i.ibb.co/rtMVR5r/fordad1.jpg",
    bgimg2: "https://i.ibb.co/5MJtjfJ/fordad2.jpg",
    bgimg3: "https://i.ibb.co/Z8KxBJL/fordad3.jpg",
  },
  {
    brand: "HONDA",
    bgimg1: "https://i.ibb.co/YhBX1Nb/hondaad1.jpg",
    bgimg2: "https://i.ibb.co/kmTbT9Z/hondaad2.jpg",
    bgimg3: "https://i.ibb.co/xsq9CXM/hondaad3.jpg",
  },
  {
    brand: "MERCEDES-BENZ",
    bgimg1: "https://i.ibb.co/X22RzWK/mercedesad01.jpg",
    bgimg2: "https://i.ibb.co/T1Symxz/mercedesad02.jpg",
    bgimg3: "https://i.ibb.co/9YBLCJz/mercedesad03.jpg",
  },
  {
    brand: "TOYOTA",
    bgimg1: "https://i.ibb.co/RGXzGHB/toyotaad01.jpg",
    bgimg2: "https://i.ibb.co/NZ61NPC/toyotaad02.jpg",
    bgimg3: "https://i.ibb.co/BGjNCjD/toyotaad03.jpg",
  },
  {
    brand: "TESLA",

    bgimg1: "https://i.ibb.co/Mn3G9s7/teslaad01.jpg",
    bgimg2: "https://i.ibb.co/KK99x40/teslaad02.jpg",
    bgimg3: "https://i.ibb.co/kG9DWWY/teslaad03.jpg",
  },
];

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const productCollection = client.db("productDB").collection("product");

    const cartCollection = client.db("cartDB").collection("cart");

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/cart", async (req, res) => {
      const newCart = req.body;
      console.log(newCart);
      const result = await cartCollection.insertOne(newCart);
      res.send(result);
    });

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body;

      const product = {
        $set: {
          image: updatedProduct.image,
          name: updatedProduct.name,
          brand: updatedProduct.brand,
          type: updatedProduct.type,
          price: updatedProduct.price,
          ratings: updatedProduct.ratings,
        },
      };

      const result = await productCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("AUTOMOTIVE BRAND SHOP SERVER HOME!");
});

app.get("/brandad", (req, res) => {
  res.send(brandAd);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
