import { Router } from "express";
import { getTransactions } from '../controllers/getTransactions.js';
import { createTransaction } from '../controllers/createTransaction.js';
import { validateAuth } from "../middlewares/authMiddleware.js";
import { validateSchema } from "../middlewares/schemaMiddleware.js";
import { transactionSchema } from "../schemas/transactionSchema.js";
import { deleteTransaction } from "../controllers/deleteTransaction.js";

const router = Router();

router.use(validateAuth);
router.get('/transaction', getTransactions);
router.post('/transaction', validateSchema(transactionSchema), createTransaction);
router.delete('/transactions/:id', deleteTransaction);

export default router;