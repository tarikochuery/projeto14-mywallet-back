import db from "../config/db.js";

export const getTransactions = async (req, res) => {
  const session = res.locals.session;

  const user = await db.collection('users').findOne({ _id: session.userId });

  if (!user) return res.sendStatus(404);

  res.send(user.transactions);
};