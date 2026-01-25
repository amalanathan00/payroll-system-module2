require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/payroll';

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log(`📦 Database: ${mongoose.connection.name}`);
    
    // Start server ONLY after DB connects
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
      console.log(` Frontend URL: http://localhost:5173`);
      console.log(` Backend URL: http://localhost:${PORT}`);
      console.log(` API Base: http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error(' MongoDB connection error:', error.message);
    process.exit(1);
  });

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error(' Unhandled Rejection:', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error(' Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log(' SIGTERM received, shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log(' MongoDB connection closed');
    process.exit(0);
  });
});
