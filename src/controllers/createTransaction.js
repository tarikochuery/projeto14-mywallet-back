import dayjs from "dayjs";
import db from "../config/db.js";

export const createTransaction = async (req, res) => {
  const transactionData = req.body;

  const { session } = res.locals;

  const user = await db.collection('users').findOne({ _id: session.userId });

  if (!user) return res.sendStatus(401);

  const newTransaction = { ...transactionData, date: dayjs().format('DD/MM') };

  await db.collection('users').updateOne({
    _id: session.userId
  },
    {
      $set: { transactions: [...user.transactions, newTransaction] }
    });

  res.sendStatus(201);

};