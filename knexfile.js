require("dotenv").config({ silent: true });

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
        host:process.env.DB_HOSTNAME,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'Przychodnia'
    },
    migrations: {
        tableName: 'migrations',
        directory: './src/database/migrations'
    },
    seeds: {
        directory: './src/database/seeds'
    }
},
};
