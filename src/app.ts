import 'reflect-metadata';
import createConnection from './database' //Não precisa especificar qual o arquivo, pois o padrão é o index
import express, { NextFunction, Request, Response } from 'express';
import "express-async-errors";
import { router } from './routes';
import { AppError } from './errors/AppError';

createConnection();

const app = express();

// O express não utiliza somente json, então precisamos informar que o formato usado será este
app.use(express.json()); 

app.use(router);

app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
    // Se o erro for do tipo AppError
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            message: err.message
        })
    }

    return response.status(500).json({
        status: "Error",
        message: `Internal server error ${err.message}`
    })
});

export { app };

/* 
GET => Busca
POST => Salvar
PUT => Alterar
DELETE => Deletar
PATCH => Alteração específica


// Os caminhos podem ser iguais desde que os métodos sejam diferentes
// Se o caminho fosse "/" e fossem 2 métodos get, não funcionaria

//http://localhost:3333/users
app.get("/", (request, response) => {

    return response.json({ message: "Hello World - NLW04" });

});

// 1 parâmetro => Rota(Recurso API)
// 2 parâmetro => request, response

app.post("/", (request, response) => {
    //Recebeu os dados para salvar
    return response.json({ message: "Os dados foram salvos com sucesso!" })
});

*/