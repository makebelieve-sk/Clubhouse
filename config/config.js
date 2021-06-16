// Файл, содержащий настройки подключений к бд
const dotenv = require("dotenv");

// Указываем путь к .env файлу
dotenv.config({path: "server/.env"});

module.exports = {
    // Настройка подкючения в базе данных в режиме разработчика
    "development": {
        "username": process.env.DB_USER,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "dialect": "postgres"
    },
    // Настройка подкючения в базе данных в режиме тестирования
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "postgres"
    },
    // Настройка подкючения в базе данных в режиме продакшена
    "production": {
        "username": "root",
        "password": null,
        "database": "database_production",
        "host": "127.0.0.1",
        "dialect": "postgres"
    }
}