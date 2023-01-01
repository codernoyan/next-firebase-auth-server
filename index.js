const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ufdxsbo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const dbConnect = async () => {
  try {
    await client.connect();
    console.log('Database Connected');

  } catch (error) {
    res.send({
      success: false,
      error: error.name
    })
  }
}
dbConnect();

// database collection
const tasksCollection = client.db("nextFirebase").collection("tasks");

// task port api
app.post('/tasks', async (req, res) => {
  try {
    const taskData = req.body;
    const result = await tasksCollection.insertOne(taskData);

    res.send(result);

  } catch (error) {
    res.send({
      success: false,
      error: error.name
    })
  }
});

// get api
app.get('/tasks', async (req, res) => {
  try {
    const query = {};
    const cursor = tasksCollection.find(query);
    const result = await cursor.toArray();

    res.send(result);

  } catch (error) {
    res.send({
      success: false,
      error: error.name
    })
  }
})


app.get('/user/tasks/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const status = req.query.status;
    const query = {
      userEmail: email,
      status
    };
    const cursor = tasksCollection.find(query);
    const result = await cursor.toArray();

    res.send(result);

    } catch (error) {
    res.send({
      success: false,
      error: error.name
    })
  }
})

// get tasks details
app.get('/task/details/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await tasksCollection.findOne(query);

    res.send(result);

  } catch (error) {
    res.send({
      success: false,
      error: error.name
    })
  }
});

// update task status
app.put('/task/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updateTaskData = req.body;
    const query = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updatedDoc = {
      $set: updateTaskData
    };
    const result = await tasksCollection.updateOne(query, updatedDoc, options);

    res.send(result);

  } catch (error) {
    res.send({
      success: false,
      error: error.name
    })
  }
});

// delete task
app.delete('/task/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await tasksCollection.deleteOne(query);

    res.send(result);

  } catch (error) {
    res.send({
      success: false,
      error: error.name
    })
  }
})

app.get('/', (req, res) => {
  res.send('Next Firebase Server is running');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
