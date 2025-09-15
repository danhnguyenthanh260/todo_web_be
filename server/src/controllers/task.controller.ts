import { Request, Response } from 'express';
import Task from '../models/task.model'; 

// === HÃ€M Táº O Má»˜T CÃ”NG VIá»†C Má»šI (CREATE) ===
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, deadline } = req.body;

    // Kiá»ƒm tra dá»¯ liá»‡u Ä‘áº§u vÃ o cÆ¡ báº£n
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTask = new Task({
      title,
      description,
      deadline,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask); // Tráº£ vá» 201 Created vÃ  dá»¯ liá»‡u cá»§a task má»›i
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating task', error });
  }
};

// === HÃ€M Láº¤Y Táº¤T Cáº¢ CÃ”NG VIá»†C (READ) ===
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find(); // TÃ¬m táº¥t cáº£ cÃ¡c document trong collection 'tasks'
    res.status(200).json(tasks); 
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching tasks', error });
  }
};

// === HÃ€M Cáº¬P NHáº¬T CÃ”NG VIá»†C (UPDATE) ===
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Láº¥y id tá»« URL
    
    // TÃ¬m vÃ  cáº­p nháº­t task báº±ng id.
    // req.body chá»©a cÃ¡c trÆ°á»ng cáº§n cáº­p nháº­t, vÃ­ dá»¥: { isCompleted: true }
    // { new: true } Ä‘á»ƒ káº¿t quáº£ tráº£ vá» lÃ  task SAU KHI Ä‘Ã£ Ä‘Æ°á»£c cáº­p nháº­t
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating task', error });
  }
};

// === HÃ€M XÃ“A Má»˜T CÃ”NG VIá»†C (DELETE) ===
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Láº¥y id tá»« URL

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting task', error });
  }
};
// === BATCH DELETE TASKS ===
export const batchDeleteTasks = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body as { ids?: string[] };
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Body must include { ids: string[] }' });
    }
    const result = await Task.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({ deletedCount: result.deletedCount ?? 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error while batch deleting tasks', error });
  }
};
