import clientPromise from '../../../../lib/mongodb'; // fixed relative path
import bcrypt from 'bcrypt';

export async function POST(req) {
  const { email, password } = await req.json();
  if (!email || !password) return new Response('Missing email or password', { status: 400 });

  try {
    const client = await clientPromise;
    const db = client.db('carbonbazzar'); // use your DB name

    const existing = await db.collection('users').findOne({ email });
    if (existing) return new Response('User already exists', { status: 400 });

    const hashed = await bcrypt.hash(password, 10);
    await db.collection('users').insertOne({ email, password: hashed });

    return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
