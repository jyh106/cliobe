const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@clio.dvshms2.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function findListings(client, resultsLimit) {
  const cursor = client
    .db('clio_skeleton')
    .collection('test')
    .find()
    .limit(resultsLimit);

  const results = await cursor.toArray();
  if (results.length > 0) {
    console.log(`Found ${results.length} listing(s):`);
    results.forEach((result, i) => {
      console.log(result);
    });
  }
}

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    await findListings(client, 5);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.post('/msg', (req, res) => {
    console.log(req.body);
    res.status(200).send(req.body);
});

app.get('/msg', (req, res) => {
    const data = [
      '85a57ab49ba7c053825246442afd1b8c02365bf2103c2995ab60a5cdbddbd844d62490b8c817522969f71418d1ad65bb556c1302b4da6574b8cf2ba9d9762340c318e8e9dc29e6ab83dbc9f1048ab6172af1e113ac040e1e93a64c5c3936f4774f1ae04c834f587d4ea6ac4da6259d82fe2308e12b1b638a1b2dece46e83c90a',
    ]
    res.send(data);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
