import { Request, Response } from 'express';
import * as service from './customers.service';

export async function listCustomersHandler(_req: Request, res: Response) {
  const customers = await service.listCustomers();
  res.json({ customers });
}
