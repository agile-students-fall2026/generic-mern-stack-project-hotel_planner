import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
      throw new Error('Missing MONGODB_URI or JWT_SECRET in .env');
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
