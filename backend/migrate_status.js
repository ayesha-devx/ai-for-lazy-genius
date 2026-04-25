import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const result = await mongoose.connection.collection('blogs').updateMany(
      { status: { $exists: false } },
      { $set: { status: 'published' } }
    );

    console.log(`Migration complete. Updated ${result.modifiedCount} blogs.`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrate();
