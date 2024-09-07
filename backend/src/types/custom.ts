import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: {
    _id: string;
    id?: string;
    username: string;
    email: string;
  };
}
