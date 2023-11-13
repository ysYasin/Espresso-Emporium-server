const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5300;

app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env._Mongo_UserId}:${process.env._Mongo_Pass}@coffeeshop.rudwhjs.mongodb.net/?retryWrites=true&w=majority`;

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


        const coffeeCollactions = client.db("CoffeeDB").collection("coffees")
        console.log("Connected successfully to server");

        app.post('/coffee', async (req, res) => {
            const body = req.body;
            // console.log(body);
            const result = await coffeeCollactions.insertOne(body);
            res.send(result);
        })

        app.get("/coffee", async (req, res) => {
            let results = await coffeeCollactions.find().toArray();
            res.send(results)
        })

        app.delete("/coffee/:id", async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const filter = { _id: new ObjectId(id) };
            const result = await coffeeCollactions.deleteOne(filter)
            res.send(result)
        })

        app.get("/coffee/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollactions.findOne(query);
            if (!result) {
                res.status(404).send({ message: "Not Found" })
            } else {
                res.send(result);
            }
        })

        app.put("/coffee/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const body = req.body;
            const updated = {
                $set: {
                    name: body.name,
                    supplier: body.supplier,
                    category: body.category,
                    chef: body.chef,
                    test: body.test,
                    details: body.details,
                    photo: body.photo,
                }
            }
            const options = { upsert: true };
            const updateResult = await coffeeCollactions.updateOne(filter, updated, options);
            res.send(updateResult)
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



app.get("/", (req, res) => {
    res.send("Coffee Store Manual Data Server")
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})