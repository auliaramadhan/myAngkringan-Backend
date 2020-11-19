import { Connection, createConnection, getConnection } from "typeorm";

const config = require('../../ormconfig.ts');


export class DBConnection {

    public static connection : Connection ;

    public static async connect(){
        try {
            if (this.connection === null ||this.connection === undefined ) {
                const connection = await createConnection( config )
                this.connection = connection
            }
            return this.connection
        } catch (error) {
            console.log(error)
            console.log('.... rettrying')
            setTimeout(async () => {
                return await DBConnection.connect()
            }, 2000);
        }
    }

}