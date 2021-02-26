import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";


class AnswerController {


    /**
    
    http://localhost:3333/answers/1?u=8ea59a93-ab26-4f57-97ff-35e5805103b0

    Route Params => Parâmetros que compõem a rota
    routes.get("/answers/:value")

    Query Params => Busca, Paginação, não obrigatórios
    Vêm sempre depois do ? na URL
    chave=valor
     
     */

    async execute(request: Request, response: Response) {
        
        // Route Param passado em answers/1
        const { value } = request.params;

        // Query Param passado após o ?
        const { u } = request.query;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        // Procura uma surveyUser pelo id recebido na URL
        const surveyUser = await surveysUsersRepository.findOne({
            // Força o u a ser uma string (Parse), que é o tipo do atributo na classe SurveyUser
            id: String(u)
        });

        // Se a SurveyUser não for encontrada, retorna um erro
        if (!surveyUser) {
            throw new AppError("Survey User does not exists!");

            // return response.status(400).json({
            //     error: "Survey User does not exists!"
            // })
        }

        // Força o value a ser um number (Parse), que é o tipo definido do atributo na classe SurveyUser
        surveyUser.value = Number(value)

        await surveysUsersRepository.save(surveyUser);

        return response.json(surveyUser);
    }
}

export { AnswerController }