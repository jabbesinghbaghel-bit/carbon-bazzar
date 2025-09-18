import clientPromise from '../../../../lib/mongodb';
import jwt from 'jsonwebtoken';

const SECRET = 'your-secret-key';

export async function POST(req) {
  try {
    const { token, symbol } = await req.json();
    if (!token || !symbol) return new Response('Missing token or symbol', { status: 400 });

    const payload = jwt.verify(token, SECRET);
    const email = payload.email;

    const client = await clientPromise;
    const db = client.db('carbonbazzar');

    // Get or create portfolio
    let user = await db.collection('portfolios').findOne({ email });
    if (!user) {
      user = { email, credits: {} };
    }

    // Increment owned credits
    user.credits[symbol] = (user.credits[symbol] || 0) + 1;

    await db.collection('portfolios').updateOne(
      { email },
      { $set: { credits: user.credits } },
      { upsert: true }
    );

    return new Response(
      JSON.stringify({ message: `Bought 1 ${symbol}`, portfolio: user.credits }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
