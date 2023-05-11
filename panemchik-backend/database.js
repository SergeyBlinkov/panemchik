const { Sequelize } = require('sequelize')

module.exports = new Sequelize(
    process.env.DB_NAME, //database name
    process.env.DB_USER, // database user
    process.env.DB_PASSWORD, // database password
    {
        dialect:'postgres',
        host:process.env.DB_HOST, //database host( ip )
        port:process.env.DB_PORT // database port
    }
)