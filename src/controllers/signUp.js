import db from '../config/db.js';
import bcrypt from 'bcrypt';

export const signUp = async (req, res) => {
  const signUpData = req.body;
  const saltRounds = 10;

  const isEmailInUse = !!(await db.collection('users').findOne({ email: signUpData.email }));

  if (isEmailInUse) return res.status(409).send('Email já cadastrado');

  const hashPassword = await bcrypt.hash(signUpData.password, saltRounds);

  const user = {
    name: signUpData.name,
    email: signUpData.email,
    password: hashPassword,
    transactions: [],
  };

  await db.collection('users').insertOne(user);
  res.sendStatus(201);
};