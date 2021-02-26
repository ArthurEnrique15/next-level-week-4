import 'reflect-metadata';
import createConnection from './database' //Não precisa especificar qual o arquivo, pois o padrão é o index
import express from 'express';
import { router } from './routes';

createConnection();

const app = express();

// O express não utiliza somente json, então precisamos informar que o formato usado será este
app.use(express.json()); 

app.use(router);

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