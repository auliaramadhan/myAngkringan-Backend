module.export  =  {
   "name": "default",
   "type": "mysql",
   "host": "localhost",
   "port": 3306,
   "username": "root",
   "password": "",
   "database": "myangkringan",
   "synchronize": true,
   "logging": false,
   "entities": [
      __dirname + '/../**/*.js'
   ],
   "migrations": [
      "src/migration/**/*.js"
   ],
   "subscribers": [
      "src/subscriber/**/*.js"
   ],
   // "cli": {
   //    "entitiesDir": "src/entity",
   //    "migrationsDir": "src/migration",
   //    "subscribersDir": "src/subscriber"
   // }
}