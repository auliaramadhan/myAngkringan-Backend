module.exports = {
   "type": "mysql",
   "host": "localhost",
   "port": 3306,
   "username": 'root',
   "password": "",
   "database": 'myangkringan',
   "synchronize": true,
   "logging": false,
   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      __dirname + "src/migration/**/*.ts"
   ],
   "subscribers": [
      __dirname + "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}