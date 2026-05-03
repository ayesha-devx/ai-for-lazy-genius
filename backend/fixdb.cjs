const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ayesha111206_db_user:Ayesha12345@cluster0.emiaylq.mongodb.net/ai-for-lazy-genius?retryWrites=true&w=majority&appName=Cluster0')
.then(async () => {
  const db = mongoose.connection.db;
  const blogs = await db.collection('blogs').find({}).toArray();
  for (let b of blogs) {
    if (!b.image) continue;
    let newImg = b.image;
    if (b.image.includes('/src/assets/covers/')) {
      newImg = b.image.replace('/src/assets/covers/', '/covers/');
    } else if (b.image.match(/\/assets\/(cover\d+)-[a-zA-Z0-9]+\.png/)) {
      const match = b.image.match(/\/assets\/(cover\d+)-[a-zA-Z0-9]+\.png/);
      newImg = '/covers/' + match[1] + '.png';
    }
    
    if (newImg !== b.image) {
      console.log('Updating', b.title, b.image, '=>', newImg);
      await db.collection('blogs').updateOne({ _id: b._id }, { $set: { image: newImg } });
    }
  }
  console.log('Database fix complete!');
  process.exit(0);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
