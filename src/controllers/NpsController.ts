import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

/**

Cálculo do NPS

1 2 3 4 5 6 7 8 9 10

Detratores => 0 - 6
Passivos => 7 - 8
Promotores => 9 - 10

(Número de promotores - Número de detratores) / Número de respondentes * 100
 */


class NpsController {

    async execute(request: Request, response: Response) {

        // Recebe o id da pesquisa que o usuário quer ver o NPS
        const { survey_id } = request.params;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        // Busca todas as respostas referentes à pesquisa desejada nas quais o valor não seja nulo 
        // (se o valor é nulo, ela ainda não foi respondida)
        const surveysUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull()),
        })

        // Filtrando a tabela de surveysUsers para encontrar o total de detratores, promotores e passivos
        // a função filter retorna um array, então o .length serve para receber o total de cada tipo de respondente

        const detractors = surveysUsers.filter(
            (survey) => survey.value >= 0 && survey.value <= 6
        ).length;
        
        const passives = surveysUsers.filter(
            (survey) => survey.value >= 7 && survey.value <= 8
        ).length;
        
        const promoters = surveysUsers.filter(
            (survey) => survey.value >= 9 && survey.value <= 10
        ).length;
        
        // Pega o total de respostas
        const totalAnswers = surveysUsers.length;
        
        // Cálculo do NPS
        // toFixed(2) => apenas 2 números depois da vírgula
        const calculate = Number(
            ((promoters - detractors) / (totalAnswers) * 100).toFixed(2)
        );

        return response.json({
            detractors,
            promoters,
            passives,
            totalAnswers,
            nps: calculate,
        })
    }

}

export { NpsController };