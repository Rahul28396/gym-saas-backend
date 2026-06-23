import { ObjectId } from "mongodb";

// Represents a fitness trainer in the system
export interface Trainer {
    userId: ObjectId;
    salary: number;
    specialization: string;
    experience: number;
    certifications: string[];
    bio: string;
    availability: Array<{
        day: string; 
        slots: string[];
    }>;
    isActive: boolean;
}