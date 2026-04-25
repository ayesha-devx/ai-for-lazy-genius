const mongoose = require('mongoose');

async function updateArjun() {
  try {
    const uri = "mongodb+srv://ayesha111206_db_user:HBOCvoQnM5PyLeTT@cluster0.emiaylq.mongodb.net/ai-for-lazy-genius?retryWrites=true&w=majority&appName=Cluster0";
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected!');

    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      avatar: String
    }));

    // Find Arjun and clear his avatar so the "Smart System" takes over
    const result = await User.updateOne(
      { email: 'arjun@gmail.com' },
      { $set: { avatar: '' } }
    );

    if (result.modifiedCount > 0) {
      console.log('Success! Arjun\'s avatar has been cleared.');
    } else {
      console.log('Arjun already has a cleared avatar or was not found.');
    }

    await mongoose.disconnect();
    console.log('Disconnected.');
  } catch (err) {
    console.error('Error:', err);
  }
}

updateArjun();
