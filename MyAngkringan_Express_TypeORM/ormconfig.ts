require("dotenv").config();

const option : import("typeorm").ConnectionOptions  =  {
   name: "default",
   type:'mysql',
   "host": process.env.DB_SERVER,
   "port":parseInt(process.env.DB_PORT),
   "username": process.env.DB_USER,
   "password": process.env.DB_PASSWORD,
   "database": process.env.DB_DATABASE,
   "synchronize": true,
   "logging": false,
   entities: [
      'src/entity/*.ts',
   ],
   migrations: [
      'src/migration/**/*.ts',
   ],
   subscribers: [
      'src/subscriber/**/*.ts',
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}

export = option;