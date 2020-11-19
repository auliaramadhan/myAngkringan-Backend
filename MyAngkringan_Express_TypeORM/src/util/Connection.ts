import { Connection, createConnection, getConnection } from "typeorm";

const config = require('../../ormconfig.ts');


export class DBConnection {

    public static connection: Connection;

    /**
     * static connectionWait
     */
    public static async connectionWait() {
        return new Promise<Connection>((resolve, reject) => {
            if (DBConnection.connection === null || DBConnection.connection === undefined) {
                setTimeout(async () => {
                    resolve( await DBConnection.connectionWait() )
                }, 2000);
            }else {
                resolve(DBConnection.connection)
            }
        })
    }

    public static async connect() {
        try {
            await DBConnection.connection && DBConnection.connection.close()
            console.log(DBConnection.connection)
            if (DBConnection.connection === null || DBConnection.connection === undefined) {
                const connection = await createConnection(config)
                DBConnection.connection = connection
            }
            return DBConnection.connection
        } catch (error) {
            console.log(error)
        }
    }
}