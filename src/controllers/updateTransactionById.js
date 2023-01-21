import dayjs from "dayjs";
import db from "../config/db.js";

export const updateTransactionById = async (req, res) => {
  const { id } = req.params;
  const { value, description } = req.body;

  try {
    const { transactions } = await db.collection('users').findOne({
      'transactions.id': id
    });

    if (!transactions) return res.status(404).send('Transação não enconrada');

    const updatedTransactions = transactions.map(transaction => {
      if (transaction.id !== id) return transaction;

      return {
        ...transaction,
        value,
        description,
        updatedAt: dayjs().format('DD/MM/YYYY HH:mm:ss')
      };
    });

    console.log(updatedTransactions);

    await db.collection('users').updateOne({
      'transactions.id': id
    },
      {
        $set: { transactions: updatedTransactions }
      });

    res.sendStatus(200);

  } catch (error) {
    console.log(error);
    res.status(500).send('Não foi possível atualizar sua transação');
  }



};