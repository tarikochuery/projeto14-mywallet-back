import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import db from '../config/db.js';

export const login = async (req, res) => {
  const loginData = req.body;

  const user = await db.collection('users').findOne({ email: loginData.email });

  if (!user) return res.status(401).send('Email não cadastrado');

  const match = await bcrypt.compare(loginData.password, user.password);

  if (!match) {
    return res.status(401).send('Senha incorreta');
  }

  const token = uuid();

  const sessionInfo = {
    userId: user._id,
    token
  };

  await db.collection('sessions').insertOne(sessionInfo);

  return res.send({
    token,
    name: user.name
  });
};