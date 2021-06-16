// Главный файл сервера
import express from "express";
import dotenv from "dotenv";
import sharp from "sharp";
import fs from "fs";
import cors from "cors";
import socket from "socket.io";
import {createServer} from "http";

import {passport} from "./core/passport";
import "./core/db";
import AuthController from "./controllers/AuthController";
import RoomController from "./controllers/RoomController";
import {uploader} from "./core/uploader";
import {Room} from "../models";
import {getUsersFromRoom, SocketRoom} from "./utils/getUsersFromRoom";

// Указываем путь к .env файлу
dotenv.config({path: "server/.env"});

const PORT = process.env.PORT || 8080;  // Инициализируем порт

const app = express();
const server = createServer(app);
const io = socket(server, {
    cors: {
        origin: '*'
    }
});

const rooms: SocketRoom = {};

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('CLIENT@ROOMS:JOIN', ({user, roomId}) => {
        console.log('Юзер подключился к комнате ', roomId);
        socket.join(`room/${roomId}`);
        rooms[socket.id] = {roomId, user};

        const speakers = getUsersFromRoom(rooms, roomId);
        io.emit('SERVER@ROOMS:HOME', {roomId: Number(roomId), speakers});
        io.in(`room/${roomId}`).emit('SERVER@ROOMS:JOIN', speakers);

        Room.update({speakers}, {where: {id: roomId}});
    });

    // При подключении нового пользователя к комнате, оповещаем всех пользователей комнаты
    socket.on('CLIENT@ROOMS:CALL', ({user, roomId, signal}) => {
        socket.broadcast.to(`room/${roomId}`).emit('SERVER@ROOMS:CALL', {user, signal});
    });

    // При подключении нового пользователя к комнате, оповещаем всех пользователей комнаты
    socket.on('CLIENT@ROOMS:ANSWER', ({userId, roomId, signal}) => {
        socket.broadcast.to(`room/${roomId}`).emit('SERVER@ROOMS:ANSWER', {userId, signal});
    });

    socket.on('disconnected', () => {
        if (rooms[socket.id]) {
            const {roomId, user} = rooms[socket.id];
            console.log('disconnected', socket.id);
            socket.broadcast.to(`room/${roomId}`).emit('SERVER@ROOMS:LEAVE', user);
            delete rooms[socket.id];

            const speakers = getUsersFromRoom(rooms, roomId);
            io.emit('SERVER@ROOMS:HOME', {roomId: Number(roomId), speakers});
            Room.update({speakers}, {where: {id: roomId}});
        }
    });
});

app.use(express.json());    // Для парсинга json
app.use(cors());            // Подключаем cors
app.use(passport.initialize());

// Роут загрузки файлов
app.post("/upload", uploader.single("photo"), (req, res) => {
    const filePath = req.file.path;

    // Изменяем размер аватарки
    sharp(filePath)
        .resize(150, 150)
        .toFormat("jpeg")
        .toFile(filePath.replace(".png", ".jpeg"), err => {
            if (err) throw new Error(err.message);

            fs.unlinkSync(filePath);    // Удаляем исходный файл с разрешением png

            res.json({
                url: `/avatars/${req.file.filename.replace(".png", ".jpeg")}`
            });
        });
});

// Получение списка комнат
app.get("/rooms", passport.authenticate("jwt", {session: false}), RoomController.index);
// Создание новой комнаты
app.post("/rooms", passport.authenticate("jwt", {session: false}), RoomController.create);
// Получение конкретной комнаты
app.get("/rooms/:id", passport.authenticate("jwt", {session: false}), RoomController.show);
// Удаление комнаты
app.delete("/rooms/:id", passport.authenticate("jwt", {session: false}), RoomController.delete);

// Роут входа через гитхаб
app.get("/auth/github", passport.authenticate("github"));
// Вход уже зареганного пользователя (с токеном)
app.get("/auth/me", passport.authenticate("jwt", {session: false}), AuthController.getMe);
// Роут отправки смс на номер (мидлвар - создание токена)
app.get("/auth/sms", passport.authenticate("jwt", {session: false}), AuthController.sendSMS);
// Роут активации аккаунта по коду
app.get("/auth/sms/activate", passport.authenticate("jwt", {session: false}), AuthController.activate);

// Роут, который вызывается после того, как пользователь был авторизирован через гитхаб
app.get("/auth/github/callback", passport.authenticate("github", {failureRedirect: "/login"}), AuthController.authCallBack);

server.listen(PORT, () => console.log("Сервер запущен на порту " + PORT));