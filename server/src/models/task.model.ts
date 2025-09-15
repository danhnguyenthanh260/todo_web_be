import mongoose, { Schema, Document } from 'mongoose';


export interface ITask extends Document {
  title: string;          
  description?: string;   
  content?: string;       
  isCompleted: boolean;   
  deadline?: Date;        // Hạn chót của công việc (không bắt buộc, kiểu Date)
  reminder?: 'none' | '30m' | '1h' | '1d'; 
  createdAt: Date;        
  updatedAt: Date;        
}

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
    content: { 
      type: String,
      required: false, 
    },
    isCompleted: {
      type: Boolean,
      default: false, 
    },
    deadline: {
      type: Date,
      required: false, 
    },
    reminder: { 
      type: String,
      enum: ['none', '30m', '1h', '1d'], 
      default: 'none', 
      required: false,
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model<ITask>('Task', TaskSchema);