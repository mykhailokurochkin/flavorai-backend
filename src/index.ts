import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './auth/auth.controller.js';
import recipeRouter from './recipe/recipe.controller.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use('/api/auth', authRouter);
app.use('/api/recipes', recipeRouter);

app.listen(PORT);