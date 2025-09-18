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

    const user = await db.collection('portfolios').findOne({ email });
    if (!user || !user.credits[symbol]) {
      return new Response(
        JSON.stringify({ message: `You don’t own any ${symbol}`, portfolio: {} }),
        { status: 200 }
      );
    }

    // Decrement owned credits
    user.credits[symbol] = user.credits[symbol] - 1;
    if (user.credits[symbol] <= 0) delete user.credits[symbol];

    await db.collection('portfolios').updateOne(
      { email },
      { $set: { credits: user.credits } }
    );

    return new Response(
      JSON.stringify({ message: `Sold 1 ${symbol}`, portfolio: user.credits }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
