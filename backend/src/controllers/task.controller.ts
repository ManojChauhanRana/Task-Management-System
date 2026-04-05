import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getTasks = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { page = 1, limit = 10, status, search } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  try {
    const where: any = { userId };
    if (status) where.status = status;
    if (search) where.title = { contains: String(search) };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.task.count({ where }),
    ]);

    res.status(200).json({
      tasks,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / take),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;
  try {
    const task = await prisma.task.findFirst({ where: { id: Number(id), userId } });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching task' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { title, description } = req.body;
  
  if (!title) return res.status(400).json({ message: 'Title is required' });

  try {
    const task = await prisma.task.create({
      data: { title, description, userId },
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const existingTask = await prisma.task.findFirst({ where: { id: Number(id), userId } });
    if (!existingTask) return res.status(404).json({ message: 'Task not found' });

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { title, description, status },
    });
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  try {
    const existingTask = await prisma.task.findFirst({ where: { id: Number(id), userId } });
    if (!existingTask) return res.status(404).json({ message: 'Task not found' });

    await prisma.task.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};

export const toggleTask = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  try {
    const existingTask = await prisma.task.findFirst({ where: { id: Number(id), userId } });
    if (!existingTask) return res.status(404).json({ message: 'Task not found' });

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { status: existingTask.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' },
    });
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error toggling task' });
  }
};
