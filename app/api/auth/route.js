import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

let users = []; // same in-memory array (for simplicity)
const SECRET = 'your-secret-key';

export async function POST(req) {
  const { email, password } = await req.json();

  const user = users.find(u => u.email === email);
  if (!user) return new Response('User not found', { status: 404 });

  const valid = await compare(password, user.passwordHash);
  if (!valid) return new Response('Invalid password', { status: 401 });

  const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });

  return new Response(JSON.stringify({ message: 'Logged in', token }), { status: 200 });
}
