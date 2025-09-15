import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;          
  description?: string;   
  isCompleted: boolean;   
  deadline?: Date;        
}

// Định nghĩa cấu trúc (Schema) cho Task trong MongoDB
const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true, 
    },
    description: {
      type: String,
      required: false,
    },
    isCompleted: {
      type: Boolean,
      default: false, // Mặc định khi tạo mới là chưa hoàn thành
    },
    deadline: {
      type: Date,
      required: false, // Hạn chót là không bắt buộc
    },
  },
  {
    timestamps: true, // Tự động thêm hai trường: createdAt và updatedAt
  }
);

// Xuất ra Model để có thể sử dụng ở các file khác
// Mongoose sẽ tự động tạo một collection tên là 'tasks' (số nhiều) trong DB
export default mongoose.model<ITask>('Task', TaskSchema);