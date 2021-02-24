import { Connection, createConnection, getConnectionOptions } from 'typeorm'

export default async (): Promise<Connection> => {

    const defaultOptions = await getConnectionOptions();

    return createConnection(
        Object.assign(defaultOptions, {
            database: 
                // IF TERNÁRIO
                // ? COMANDO A SER EXECUTADO NO IF
                // : COMANDO A SER EXECUTADO NO ELSE
                process.env.NODE_ENV === 'test' 
                ? "./src/database/database.test.sqlite"
                : defaultOptions.database
        })
    );
};