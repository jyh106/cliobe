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

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
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
    console.log('posted messages ---', req.body);
    client.db('clio_skeleton').collection('test').insertOne(req.body);
    setTimeout(() => {
      res.sendStatus(200);
    }, 40000);
});

app.get('/msg', async (req, res) => {
  console.log('getting messages ---', req.body);
  const cursor = client
    .db('clio_skeleton')
    .collection('test')
    .find()
    .limit(20);
  const results = await cursor.toArray();
  console.log('raw result', results);
  const messages = results.map((obj) => {
    return {
      message: obj.message,
      id: obj.id,
      timestamp: obj.timestamp,
    }
  });
  console.log('got from db', messages);
  res.send(messages);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
