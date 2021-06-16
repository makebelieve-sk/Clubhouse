// Настраиваем multer
import multer from "multer";
import {nanoid} from "nanoid";

export const uploader = multer({
    // Создаем файл в папке public/avatars
    storage: multer.diskStorage({
        destination: function (_, __: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
            // Устанавливаем место сохранения файла
            callback(null, "public/avatars");
        },
        filename: function (_, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
            // Устанавливаем имя файла
            callback(null, file.fieldname + "-" + nanoid(6) + "." + file.mimetype.split("/").pop());
        }
    })
});