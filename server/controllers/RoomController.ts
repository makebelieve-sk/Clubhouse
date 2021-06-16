import express from "express";
import {Room} from "../../models";

class RoomController {
    async index(req: express.Request, res: express.Response) {
        try {
            const items = await Room.findAll();
            res.status(200).json(items);
        } catch (e) {
            res.status(500).json({message: "Возникла ошибка при получении комнат: " + e.message});
        }
    };

    async create(req: express.Request, res: express.Response) {
        try {
            const data = {
                title: req.body.title,
                type: req.body.type,
            }

            if (!data.title || !data.type) return res.status(400).json({message: "Отсутствует загловок или тип комнаты"});

            const room = await Room.create(data);

            res.status(201).json(room);
        } catch (e) {
            res.status(500).json({message: "Возникла ошибка при получении комнат: " + e.message});
        }
    };

    async show(req: express.Request, res: express.Response) {
        try {
            const id = req.params.id;

            if (!id) return res.status(400).json({message: "Отсутствует id комнаты"});

            const room = await Room.findByPk(id);

            if (!room) return res.status(404).json({message: "Комната не существует"});

            res.status(200).json(room);
        } catch (e) {
            res.status(500).json({message: "Возникла ошибка при получении комнаты: " + e.message});
        }
    };

    async delete(req: express.Request, res: express.Response) {
        try {
            const id = req.params.id;

            if (!id) return res.status(500).json({message: "Отсутствует id комнаты"});

            await Room.destroy({where: {id}});

            res.status(200).json("Комната успешно удалена");
        } catch (e) {
            res.status(500).json({message: "Возникла ошибка при удалении комнаты: " + e.message});
        }
    };
}

export default new RoomController();