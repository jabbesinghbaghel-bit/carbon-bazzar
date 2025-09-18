import clientPromise from '../../../../lib/mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET = 'your-secret-key';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      console.log('Missing email or password');
      return new Response('Missing email or password', { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('carbonbazzar');

    console.log('MongoDB connected');

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return new Response('User not found', { status: 404 });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('Invalid password for:', email);
      return new Response('Invalid password', { status: 401 });
    }

    const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });
    console.log('Login successful for:', email);

    return new Response(JSON.stringify({ message: 'Logged in', token }), { status: 200 });
  } catch (err) {
    console.error('Login API error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
