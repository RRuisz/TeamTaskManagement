import { Request } from 'express';

export interface AuthRequest extends Request {
    user: {
        id: number,
        email: string,
        firstName: string|undefined,
        lastName: string|undefined,
        createdAt: Date|undefined,
    }
}