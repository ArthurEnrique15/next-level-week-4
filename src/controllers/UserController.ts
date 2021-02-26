import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';

// Biblioteca utilizada para validação
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class UserController {

    async create(request: Request, response: Response) {

        const { name, email } = request.body;

        // Validação dos campos
        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required(),
        })

        // Verificação da validação
        try {
            await schema.validate(request.body, { abortEarly: false });
        } catch (err) {

            throw new AppError(err);

            // return response.status(400).json({
            //     error: error,
            // })
        }

        const usersRepository = getCustomRepository(UsersRepository);

        // SELECT * FROM USERS WHERE EMAIL = "EMAIL"
        const userAlreadyExists = await usersRepository.findOne({
            email,
        });

        if (userAlreadyExists) {

            throw new AppError("User already exists!");

            // return response.status(400).json({
            //     error: "Usuário já existe!",
            // })
        }

        const user = usersRepository.create({
            name, email
        });

        await usersRepository.save(user);

        return response.status(201).json(user);
        
    }
}

export { UserController };
