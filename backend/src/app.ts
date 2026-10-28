import express, { Request, Response } from "express";
import db from "./config/db";
import cors from "cors";
import booksRoutes from "./routes/bookRoutes";
import authRoutes from './routes/authRoutes';

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/api/books', booksRoutes);
app.use('/api', authRoutes);

app.listen(5000, () => {
  console.log("Server berjalan di http://localhost:5000");
});
