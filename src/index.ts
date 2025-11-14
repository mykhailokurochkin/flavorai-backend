import express from 'express';
import dotenv from 'dotenv';
import authRouter from './auth/auth.controller.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log("Server is running");
});