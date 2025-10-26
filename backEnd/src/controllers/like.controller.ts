import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const likePost = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const { userId } = req.body;
    const post = await prisma.like.findMany({
      where: { userId, portfolioId: id },
    });
    if (!post) {
      await prisma.like.create({
        data: {
          portfolioId: id,
          userId,
        },
      });
    }
    return res.status(201);
  } catch (e) {
    return res.status(500).json(e);
  }
};

export const unlikePost = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const { userId } = req.body;
    const post = await prisma.like.findMany({
      where: { userId, portfolioId: id },
    });
    if (post) {
      await prisma.like.deleteMany({
        where: { userId, portfolioId: id },
      });
    }
    return res.status(200);
  } catch (e) {
    return res.status(500).json(e);
  }
};
