// Контроллер, отвечающий за авторизацию
import express from "express";
import {Code, User} from "../../models";

class AuthController {
    async getMe(req: express.Request, res: express.Response) {
        const user = await User.findOne({where: {id: req.user.id}});    // Находим текущего пользователя по id

        if (!user) res.status(400).json("Такого пользователя не существует");

        res.json(user);
    };

    authCallBack(req: express.Request, res: express.Response) {
        // Автоматическое закрытие окна авторизации через github
        res.send(`
            <script>
                window.opener.postMessage('${JSON.stringify(req.user)}', "*");
                window.close();
            </script>`
        );
    };

    async activate(req: express.Request, res: express.Response) {
        const userId = req.user.id;     // Получаем id пользователя
        const smsCode = req.query.code; // Берем из get параметра code

        if (!smsCode) return res.status(400).json({message: "Введите код активации"});

        const whereQuery = {code: smsCode, user_id: userId};   // Запрос в бд

        try {
            const findCode = await Code.findOne({where: whereQuery});

            if (findCode) {
                await Code.destroy({where: whereQuery});    // Удаляем такой код

                // Обновляем поле isActive у пользователя
                await User.update({isActive: 1}, {where: {id: userId}});

                return res.send();
            } else {
                res.status(400).json({message: "Код не найден"});
            }
        } catch (e) {
            console.log("Ошибка активации кода: ", e);
            res.status(500).json({message: "Ошибка при активации аккаунта"});
        }
    };

    async sendSMS(req: express.Request, res: express.Response) {
        const phone = req.query.phone;   // Получаем телефон в объекте body
        const userId = req.user.id;     // Получаем id пользователя
        const smsCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;  // Генерируем смс код

        // Если нет номера, отправляем ошибку
        if (!phone) res.status(400).json({message: "Номер телефона не указан"});

        try {
            // Отправляем смс с кодом smsCode на номер
            // await Axios.get(`https://sms.ru/sms/send?api_id=${process.env.SMS_API_KEY}&to=79506554587&msg=${smsCode}`);

            const findCode = await Code.findOne({
                where: {
                    user_id: userId
                }
            });

            // Проверка на то, был ли отправлен код по указанному номеру
            if (findCode)
                return res.status(400).json({message: "Код уже был отправлен на этот номер"});

            // Создаем запись кода в базе данных
            await Code.create({code: smsCode, user_id: userId});

            res.status(201).json();
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Ошибка при отправке СМС-кода"})
        }
    };
}

export default new AuthController();