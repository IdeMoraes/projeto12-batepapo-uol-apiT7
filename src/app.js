import chalk from 'chalk';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
const porta = 5000;

app.listen(porta,()=>{
    console.log(`Servidor aberto na porta ${chalk.blue(porta)}`)
});