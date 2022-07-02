require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;

// Nombre de bd
const dbName = 'utpproyectos';
// Conexión URL 
const url = process.env.DB_CNN;

const client = new MongoClient(url, {
  useUnifiedTopology: true
});

module.exports = async () => {
  // Conectamos al servidor
  await client.connect();

  return client.db(dbName); // retornamos la conexión
};