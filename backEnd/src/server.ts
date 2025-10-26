import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import AuthRoute from './routes/auth.routes';
import PostRoute from './routes/post.routes';
import LikeRoute from './routes/like.routes';
import CommentRoute from './routes/comment.routes';

dotenv.config();

const app = express();

//external middlewares
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

//routes
app.use('/api/v1', AuthRoute);
app.use('/api/v1', PostRoute);
app.use('/api/v1', LikeRoute);
app.use('/api/v1', CommentRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
