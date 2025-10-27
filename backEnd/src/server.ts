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

// Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://rate-my-protfolio-1.vercel.app',
];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1', AuthRoute);
app.use('/api/v1', PostRoute);
app.use('/api/v1', LikeRoute);
app.use('/api/v1', CommentRoute);
app.use('/api/v1', AiRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
