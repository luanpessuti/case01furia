export interface User {
    _id?: string;
    name: string;
    email: string;
    password: string;
    cpf?: string;
    verified: boolean;
    verificationStep: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface UserPublic {
    _id: string;
    name: string;
    email: string;
    verified: boolean;
    verificationStep: number;
  }