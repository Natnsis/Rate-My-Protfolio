import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const sendComment = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const { content, userId } = req.body;
    await prisma.comment.create({
      data: {
        portfolioId: id,
        content,
        userId,
      },
    });
    res.status(201).json({ message: 'comment sent successfully ' });
  } catch (e) {
    return res.status(500).json({ message: 'internal server error' });
  }
};

export const fetchComment = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const comments = await prisma.comment.findMany({
      where: { receiverId: id },
    });
    res.status(200).json(comments);
  } catch (e) {
    return res.status(500).json({ message: 'internal server error' });
  }
};
