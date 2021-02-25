import { Connection, createConnection, getConnectionOptions } from 'typeorm'

export default async (): Promise<Connection> => {

    const defaultOptions = await getConnectionOptions();

    return createConnection(
        Object.assign(defaultOptions, {
            database: 
                // IF TERNÁRIO
                // ? COMANDO A SER EXECUTADO NO IF
                // : COMANDO A SER EXECUTADO NO ELSE
                // Sempre que uma variável de ambiente for utilizada, deve-se escrever process.ent
                process.env.NODE_ENV === 'test' 
                ? "./src/database/database.test.sqlite"
                : defaultOptions.database
        })
    );
};