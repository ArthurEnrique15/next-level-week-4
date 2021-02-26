import { Request, Response } from 'express';
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from '../services/SendMailService';
import { resolve } from 'path';
import { AppError } from '../errors/AppError';


class SendMailController {

    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({ email });

        if (!user) {
            throw new AppError("User does not exists!");

            // return response.status(400).json({
            //     error: "User does not exists!",
            // })
        }

        const survey = await surveysRepository.findOne({ 
            // RECEBE O SURVEY_ID, MAS COMPARA COM O ATRIBUTO ID DAS SURVEYS
            id: survey_id
        });

        if (!survey) {

            throw new AppError("User does not exists!");

            // return response.status(400).json({
            //     error: "Survey does not exists!",
            // })
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        // Procura uma surveyUser já existente na tabela
        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: { user_id: user.id, value: null },
            relations: ["user", "survey"],
        });

        // Definição do parâmetro variables
        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }

        // Se tiver encontrado uma surveyUser já existente, apenas envia o email para o usuário
        if (surveyUserAlreadyExists) {

            // Atribui o valor do id da surveyUser encontrada ao parâmetro variables
            variables.id = surveyUserAlreadyExists.id;
            
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExists);
        }


        // Salvar as informações na tabela surveyUser 

        const surveyUser = surveysUsersRepository.create({
            user_id: user.id, 
            survey_id,
        });

        await surveysUsersRepository.save(surveyUser);


        // Enviar email para o usuário

        // Atribui o valor do id da surveyUser criada ao parâmetro variables
        variables.id = surveyUser.id; 

        await SendMailService.execute(email, survey.title, variables, npsPath);

        return response.json(surveyUser);
    }
}

export { SendMailController };