import { ObjectId } from "mongodb";

export interface CreateTrainerData {
    email: string;
    name: string;
    phone: string;
    password: string;
    imageUrl: string;
    type: "trainer";

    // Trainer-specific fields
    specialization: string;
    salary: number;
    experience: number;
    certifications: string[];
    bio: string;
    availability: Array<{
        day: string; 
        slots: string[];
    }>;
    isActive: boolean;
}