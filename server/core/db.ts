// Подключаемся к базе данных postgres
import {Sequelize} from "sequelize";

// Создаем новый экземпляр Sequelize, используя файл с системынми настройками (.env)
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
    }
);

// Подключаемся к базе данных postgres
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw new Error(error);
    }
})();

export {sequelize};