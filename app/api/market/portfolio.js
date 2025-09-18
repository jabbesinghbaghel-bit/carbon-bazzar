import clientPromise from '../../../../lib/mongodb';
import jwt from 'jsonwebtoken';

const SECRET = 'your-secret-key';

export async function POST(req) {
  try {
    const { token } = await req.json();
    if (!token) return new Response('Missing token', { status: 400 });

    const payload = jwt.verify(token, SECRET);
    const email = payload.email;

    const client = await clientPromise;
    const db = client.db('carbonbazzar');

    const user = await db.collection('portfolios').findOne({ email }) || { credits: {} };

    // Convert credits object to array
    const portfolio = Object.entries(user.credits).map(([symbol, amount]) => ({
      symbol,
      amount
    }));

    return new Response(JSON.stringify({ portfolio }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
