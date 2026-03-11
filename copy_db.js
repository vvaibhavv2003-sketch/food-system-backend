const mongoose = require('mongoose');

async function migrateData() {
  try {
    const sourceDB = await mongoose.createConnection('mongodb://127.0.0.1:27018/toasty_bites').asPromise();
    const destDB = await mongoose.createConnection('mongodb://127.0.0.1:27017/toasty_bites').asPromise();
    
    const collections = await sourceDB.db.listCollections().toArray();
    for (let collection of collections) {
      if (collection.name.startsWith('system.')) continue;
      const data = await sourceDB.db.collection(collection.name).find({}).toArray();
      if (data.length > 0) {
        await destDB.db.collection(collection.name).deleteMany({});
        await destDB.db.collection(collection.name).insertMany(data);
        console.log(`Copied ${data.length} documents for ${collection.name}`);
      } else {
        console.log(`No documents found for ${collection.name}`);
      }
    }
    
    await sourceDB.close();
    await destDB.close();
    console.log('Migration complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrateData();
