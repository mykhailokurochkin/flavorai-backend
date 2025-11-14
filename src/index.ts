import express from 'express';
import dotenv from 'dotenv';
// import authRouter from './auth/auth.controller.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(PORT);