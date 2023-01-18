import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import { loginSchema, signUpSchema, transactionSchema } from './utils/schemas.js';
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';

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

app.post('/login', async (req, res) => {
  const bodyData = req.body;
  const { value: loginData, error } = loginSchema.validate(bodyData, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(422).send(errors);
  }

  const user = await db.collection('users').findOne({ email: loginData.email });

  if (!user) return res.status(401).send('Email não cadastrado');

  const match = await bcrypt.compare(loginData.password, user.password);

  if (!match) {
    return res.status(401).send('Senha incorreta');
  }

  return res.send(user.token);
});

app.post('/cadastro', async (req, res) => {
  const bodyData = req.body;
  const saltRounds = 10;
  const { value: signUpData, error } = signUpSchema.validate(bodyData, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(422).send(errors);
  }

  const isEmailInUse = !!(await db.collection('users').findOne({ email: signUpData.email }));

  if (isEmailInUse) return res.status(409).send('Email já cadastrado');

  const hashPassword = await bcrypt.hash(signUpData.password, saltRounds);

  const user = {
    name: bodyData.name,
    email: bodyData.email,
    password: hashPassword,
    transactions: [],
    token: uuid()
  };

  await db.collection('users').insertOne(user);
  res.sendStatus(201);
});

app.get('/transaction', async (req, res) => {
  const token = req.headers.authorization;

  const user = await db.collection('users').findOne({ token });

  if (!user) return res.sendStatus(403);

  res.send(user.transactions);
});

app.post('/transaction', async (req, res) => {
  const token = req.headers.authorization;
  const bodyData = req.body;

  const { value: transactionData, error } = transactionSchema.validate(bodyData, { abortEarly: false });

  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(422).send(errors);
  }

  const user = await db.collection('users').findOne({ token });

  if (!user) return res.sendStatus(403);

  const newTransaction = { ...transactionData, date: dayjs().format('DD/MM') };

  await db.collection('users').updateOne({
    token
  },
    {
      $set: { transactions: [...user.transactions, newTransaction] }
    });

  res.sendStatus(201);

});

app.listen(5000, () => console.log(`Servidor rodando na porta ${PORT}`));