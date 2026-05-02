export interface Plan {
  name: string;
  value: string;
  price: number;
  description: string;
  duration: number;
  status: string;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}