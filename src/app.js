import express, { json } from 'express';
import cors from 'cors';
import authRoute from './routes/authRoutes.js';
import transactionRoute from './routes/transactionRoutes.js';

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(json());

app.use([authRoute, transactionRoute]);



app.listen(5000, () => console.log(`Servidor rodando na porta ${PORT}`));