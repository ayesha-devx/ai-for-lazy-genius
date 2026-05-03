import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function listDatabases() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const admin = mongoose.connection.db.admin();
    const result = await admin.listDatabases();
    
    console.log('--- Databases on this cluster ---');
    result.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });
    console.log('---------------------------------');

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

listDatabases();
