import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

dotenv.config();
const PORT = 5000;
const app = express();
app.use(cors());
app.use(json());

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

try {
  await mongoClient.connect();
} catch (error) {
  console.error(error);
  console.log('Problema no banco de dados');
}

db = mongoClient.db();

app.listen(5000, () => console.log(`Servidor rodando na porta ${PORT}`));