import { Router } from 'express';
import { getTasks, getTaskById, createTask, updateTask, deleteTask, toggleTask } from '../controllers/task.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Apply auth middleware to all task routes
router.get('/', authMiddleware, getTasks as any);
router.get('/:id', authMiddleware, getTaskById as any);
router.post('/', authMiddleware, createTask as any);
router.patch('/:id', authMiddleware, updateTask as any);
router.delete('/:id', authMiddleware, deleteTask as any);
router.patch('/:id/toggle', authMiddleware, toggleTask as any);

export default router;
