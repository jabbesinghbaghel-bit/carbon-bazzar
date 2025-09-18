import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://CarbonAdmin:Anshul%401246@cluster0.cgkswhu.mongodb.net/carbonbazzar?retryWrites=true&w=majority";

const options = {};

let client;
let clientPromise;

if (!uri) {
  throw new Error('Please provide your MongoDB URI');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
