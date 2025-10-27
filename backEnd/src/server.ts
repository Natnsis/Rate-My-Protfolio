import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import AuthRoute from './routes/auth.routes';
import PostRoute from './routes/post.routes';
import LikeRoute from './routes/like.routes';
import CommentRoute from './routes/comment.routes';
import AiRoute from './routes/ai.routes';

dotenv.config();

const app = express();

//middlewares
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

//routes
app.use('/api/v1', AuthRoute);
app.use('/api/v1', PostRoute);
app.use('/api/v1', LikeRoute);
app.use('/api/v1', CommentRoute);
app.use('/api/v1', AiRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
