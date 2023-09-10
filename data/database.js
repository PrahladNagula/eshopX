const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let database;
// Any function decorated with a async will always return a promise even if you dont return it

async function connectToDatabase() {
  const client = await MongoClient.connect('mongodb://127.0.0.1:27017'); //address of local mongodb server
  database = client.db('online-shop');
}

function getDb() {
  if (!database) {
    throw new Error('You must connect first!');
    // Builtin error class or constructor function
  }

  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb
};