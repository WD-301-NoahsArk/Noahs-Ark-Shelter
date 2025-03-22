import { Hono } from 'hono';
import { collections } from '../src/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = new Hono();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

//Admin only: register new staff member
app.post('/register', async (c) => {
  const { first_name, last_name, email, phone, password, role } = await c.req.json();
  const existingUser = await collections.staff.findOne({ email });

  if (existingUser) {
    return c.json({ message: 'User already exists' }, 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { first_name, last_name, email, phone, password: hashedPassword, role };
  
  const result = await collections.staff.insertOne(user);
  return c.json({ id: result.insertedId });
});

//Logging in
app.post('/login', async (c) => {
  const { email, password } = await c.req.json();
  const user = await collections.staff.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return c.json({ message: 'Invalid credentials for login' }, 401);
  }

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '4h' });
  return c.json({ token });
});

export default app;
