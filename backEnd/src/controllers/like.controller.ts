import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const likePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const existingLike = await prisma.like.findFirst({
      where: { userId, portfolioId: id },
    });

    if (!existingLike) {
      await prisma.like.create({
        data: {
          portfolioId: id,
          userId,
        },
      });
      return res.status(201).json({ message: 'Post liked successfully' });
    }

    return res.status(200).json({ message: 'Post already liked' });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export const unlikePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const existingLike = await prisma.like.findFirst({
      where: { userId, portfolioId: id },
    });

    if (existingLike) {
      await prisma.like.deleteMany({
        where: { userId, portfolioId: id },
      });
      return res.status(200).json({ message: 'Post unliked successfully' });
    }

    return res.status(404).json({ message: 'Like not found' });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export const likes = async (req: Request, res: Response) => {
  try {
    const data = await prisma.like.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};
