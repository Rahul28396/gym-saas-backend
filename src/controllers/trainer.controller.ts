import { Request, Response } from "express";
import { TrainerService } from "../services/trainer.service";
import { error, success } from "../utils/response";
import logger from "../utils/logger";
import { ObjectId } from "mongodb";


export class TrainerController {
    constructor(private service: TrainerService) { }

    getTrainers = async (_req: Request, res: Response) => {

        try {
            const data = await this.service.getAllTrainers();
            return res.status(200).json(success(data));
        } catch (err) {
            logger.error(err);
            return res.status(400).json(error('Something went wrong!!'))
        }

    };

    getTrainer = async (req: Request, res: Response) => {

        const idParam = req.params.id;

        if (!idParam || Array.isArray(idParam)) {
            throw new Error("Invalid ID");
        }

        const objectId = new ObjectId(idParam);

        const data = await this.service.getTrainerById(objectId);
        return res.status(200).json(success(data));
    };

    createTrainer = async (req: Request, res: Response) => {
        const data = await this.service.createTrainer(req.body);
        return res.status(201).json(success(data, "Trainer created"));
    };
}