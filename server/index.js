// packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

//utils
import {connectDB} from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes)

app.listen(port, () => console.log(`Server is runing on the port ${port}`));
