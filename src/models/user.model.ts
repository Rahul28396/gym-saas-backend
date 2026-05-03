
export interface User{
    name: string;
    email: string;
    phone: string;
    password: string;
    imageUrl: string;
    type: "admin" | "trainer" | "member";
    tokenVersion: number,


    createdAt: Date;
    updatedAt: Date;
}