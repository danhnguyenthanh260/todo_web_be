import { Router } from 'express';
import {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  batchDeleteTasks,
} from '../controllers/task.controller';

const router = Router();

// GET all tasks
router.get('/tasks', getAllTasks);

// CREATE task
router.post('/tasks', createTask);

// UPDATE task by id
router.put('/tasks/:id', updateTask);

// BATCH DELETE (must be before '/tasks/:id')
router.delete('/tasks/batch-delete', batchDeleteTasks);

// DELETE task by id
router.delete('/tasks/:id', deleteTask);

export default router;

