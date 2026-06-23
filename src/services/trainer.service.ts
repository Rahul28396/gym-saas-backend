import { ObjectId } from "mongodb";
import { TrainerRepository } from "../repositories/trainer.repository";
import { CreateTrainerData } from "../types/trainer.types";

export class TrainerService {
    constructor(private repo: TrainerRepository) {}

    async getAllTrainers() {
        return await this.repo.findAll();
    }

    async getTrainerById(id: ObjectId) {
        const trainer = await this.repo.findById(id);
        if (!trainer) throw new Error("Trainer not found");
        return trainer;
    }

    async createTrainer(newTrainer: CreateTrainerData) {
        return await this.repo.create(newTrainer);
        }
}