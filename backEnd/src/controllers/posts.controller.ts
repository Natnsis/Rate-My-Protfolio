import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addPost = async (req: Request, res: Response) => {
  try {
    const { userId, description, url } = req.body;
    await prisma.portfolio.create({
      data: {
        userId,
        description,
        url,
      },
    });
    return res.status(201).json({ message: 'portfolio posted successfully' });
  } catch (e) {
    res.status(500).json({ message: 'internal error has occurred' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.portfolio.delete({
      where: { id },
    });
    return res.status(204).json({ message: 'post deleted successfully' });
  } catch (e) {
    res.status(500).json({ message: 'internal error has occurred' });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { description, url } = req.body;
    await prisma.portfolio.update({
      where: { id },
      data: {
        description,
        url,
      },
    });
    return res.status(201).json({ message: 'updated successfully' });
  } catch (e) {
    res.status(500).json({ message: 'internal error has occurred' });
  }
};

export const fetchPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(posts);
  } catch (e) {
    res.status(500).json({ message: 'internal error has occurred' });
  }
};

export const fetchPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.portfolio.findUnique({
      where: { id },
    });
  } catch (e) {
    res.status(500).json({ message: 'internal error has occurred' });
  }
};
