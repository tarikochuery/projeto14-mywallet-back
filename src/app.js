import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import { signUpSchema } from './utils/schemas.js';

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

app.post('/cadastro', async (req, res) => {
  const bodyData = req.body;
  const saltRounds = 10;
  const { value: signUpData, error } = signUpSchema.validate(bodyData, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(422).send(errors);
  }

  const hashPassword = await bcrypt.hash(signUpData.password, saltRounds);

  const user = {
    name: bodyData.name,
    email: bodyData.email,
    password: hashPassword
  };

  await db.collection('users').insertOne(user);
  res.sendStatus(201);
});


app.listen(5000, () => console.log(`Servidor rodando na porta ${PORT}`));