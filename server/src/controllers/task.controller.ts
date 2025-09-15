import { Request, Response } from 'express';
import Task from '../models/task.model';
import { ITask } from '../models/task.model'; 

// === HÀM TẠO MỘT CÔNG VIỆC MỚI (CREATE) ===
/**
 * @route POST /api/tasks
 * @desc Tạo một công việc mới
 * @access Public
 */
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, content, deadline, isCompleted, reminder } = req.body as Partial<ITask>; 

    if (!title) {
      return res.status(400).json({ message: 'Tiêu đề công việc là bắt buộc.' });
    }

    // Tạo một đối tượng Task mới
    const newTask = new Task({
      title,
      description,
      content, // Bao gồm content
      deadline: deadline ? new Date(deadline) : undefined, // Chuyển đổi sang Date object nếu có
      isCompleted: isCompleted ?? false, // Mặc định là false nếu không được cung cấp
      reminder, // Bao gồm reminder
    });

    // Lưu task mới vào cơ sở dữ liệu
    const savedTask = await newTask.save();
    // Trả về 201 Created và dữ liệu của task mới
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Lỗi khi tạo công việc:", error);
    res.status(500).json({ message: 'Lỗi server khi tạo công việc.', error });
  }
};

// === HÀM LẤY TẤT CẢ CÔNG VIỆC (READ) ===
/**
 * @route GET /api/tasks
 * @desc Lấy tất cả các công việc từ cơ sở dữ liệu
 * @access Public
 */
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    // Tìm tất cả các document trong collection 'tasks'
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách công việc:", error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách công việc.', error });
  }
};

// === HÀM CẬP NHẬT CÔNG VIỆC (UPDATE) ===
/**
 * @route PUT /api/tasks/:id
 * @desc Cập nhật một công việc bằng ID
 * @access Public
 */
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Lấy id từ URL params
    const updateData = req.body as Partial<ITask>; // Dữ liệu cập nhật từ body

    // Xử lý deadline nếu nó được gửi đến (chuyển đổi từ string ISO sang Date)
    if (updateData.deadline && typeof updateData.deadline === 'string') {
        updateData.deadline = new Date(updateData.deadline);
    }
    // Nếu deadline được gửi là null/undefined hoặc chuỗi rỗng, đặt nó là null để xóa deadline
    if (updateData.deadline === null || (typeof updateData.deadline === 'string' && updateData.deadline === '')) {
        updateData.deadline = undefined;
    }

    // Tìm và cập nhật task bằng id.
    // { new: true } để kết quả trả về là task SAU KHI đã được cập nhật
    const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Không tìm thấy công việc.' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Lỗi khi cập nhật công việc:", error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật công việc.', error });
  }
};

// === HÀM XÓA MỘT CÔNG VIỆC (DELETE) ===
/**
 * @route DELETE /api/tasks/:id
 * @desc Xóa một công việc bằng ID
 * @access Public
 */
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Lấy id từ URL params

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Không tìm thấy công việc.' });
    }

    res.status(200).json({ message: 'Công việc đã được xóa thành công.' });
  } catch (error) {
    console.error("Lỗi khi xóa công việc:", error);
    res.status(500).json({ message: 'Lỗi server khi xóa công việc.', error });
  }
};

// === BATCH DELETE TASKS ===
/**
 * @route DELETE /api/tasks/batch-delete
 * @desc Xóa nhiều công việc cùng lúc bằng một mảng các ID
 * @access Public
 */
export const batchDeleteTasks = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body as { ids?: string[] };

    // Kiểm tra dữ liệu đầu vào: ids phải là một mảng chuỗi không rỗng
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Body phải chứa một mảng các ID công việc (ids: string[]).' });
    }

    // Xóa nhiều document dựa trên mảng các ID
    const result = await Task.deleteMany({ _id: { $in: ids } });

    // Trả về số lượng công việc đã xóa
    return res.status(200).json({ deletedCount: result.deletedCount ?? 0 });
  } catch (error) {
    console.error("Lỗi khi xóa hàng loạt công việc:", error);
    res.status(500).json({ message: 'Lỗi server khi xóa hàng loạt công việc.', error });
  }
};