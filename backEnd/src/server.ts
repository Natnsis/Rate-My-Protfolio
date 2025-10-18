import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import AuthRoute from './routes/auth.routes';
import PostRoute from './routes/post.routes';

dotenv.config();

const app = express();

//external middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//routes
app.use('/api/v1', AuthRoute);
app.use('/api/v1', PostRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
