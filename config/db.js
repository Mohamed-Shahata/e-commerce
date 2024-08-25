
const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URL; 

const options = {
  serverSelectionTimeoutMS: 30000 
};


const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, options);
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};


module.exports = connectDB;
