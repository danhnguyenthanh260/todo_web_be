import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/task.routes'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares 
app.use(cors()); // Cho phép frontend (từ domain khác) gọi API
app.use(express.json()); // Giúp server hiểu được dữ liệu JSON mà frontend gửi lên

// Sử dụng "bảng chỉ dẫn" cho các task
// Tất cả các route trong taskRoutes sẽ có tiền tố là '/api'
app.use('/api', taskRoutes);
// Simple health check to help debug 500s
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', dbState: mongoose.connection.readyState });
});

const mongoURI = process.env.MONGO_URI;

// Kiểm tra và kết nối tới MongoDB
if (!mongoURI) {
  console.error('FATAL ERROR: MONGO_URI is not defined.');
  process.exit(1); // Dừng ứng dụng nếu không có chuỗi kết nối
}

mongoose
  .connect(mongoURI, { dbName: process.env.MONGO_DB_NAME || 'studentflow' })
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
    // Chỉ khởi động server SAU KHI kết nối database thành công
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Connection error', error);
    process.exit(1);
  });
