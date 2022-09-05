import chalk from 'chalk';
import express from 'express';
import cors from 'cors';
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import joi from 'joi';
import dayjs from 'dayjs';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
const porta = process.env.PORTA || 5000;

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db(process.env.BANCO);
    console.log(`Conectado ao MongoDB`);
});
mongoClient.connect().catch((e) => {
    console.log(`Erro ao tentar conexão com o MongoDB`);
    console.log(e);
});

app.get('/participants', async (req,res) => {
    const participante = req.body;
    const participanteSchema = joi.object({name: joi.string().required()})
    const {error} = participanteSchema(participante)
    if(error){
        res.status(422).send("Nome deve ser uma string não vazia");
        return;
    }
    const nomeRepetido = await db.collection("participantes").findOne({name: participante.name});
    if(nomeRepetido){
        res.status(409).send("Esse nome já está sendo utilizado");
        return;
    }
    await db.collection("participantes").insertOne({name: participante.name, lastStatus: Date.now()});
    await db.collection("mensagens").insertOne({from: participante.name, to: 'Todos', text: 'entra na sala...', type: 'status', time: dayjs().format('HH:MM:SS')});
    res.sendStatus(201);
});

app.listen(porta,()=>{
    console.log(`Servidor aberto na porta ${chalk.blue(porta)}`)
});