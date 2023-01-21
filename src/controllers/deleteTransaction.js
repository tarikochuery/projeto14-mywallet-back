import db from "../config/db.js";

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await db.collection('users').findOne({ 'transactions.id': id });
    if (!user) return res.status(404).send('Transação não encontrada');

    const filteredTransactions = user.transactions.filter(transaction => transaction.id !== id);

    await db.collection('users').updateOne({
      'transactions.id': id
    },
      {
        $set: {
          transactions: filteredTransactions
        }
      });

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send('Não foi possível deletar sua transação');
  }
};