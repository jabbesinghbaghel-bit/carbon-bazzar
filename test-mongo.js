import { MongoClient } from 'mongodb';

// Replace with your MongoDB URI (use %40 for @ in password)
const uri = "mongodb+srv://CarbonAdmin:Anshul%401246@cluster0.cgkswhu.mongodb.net/carbonbazzar?retryWrites=true&w=majority";

async function test() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ Connection failed:', err);
  } finally {
    await client.close();
  }
}

test();
