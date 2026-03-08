  import { Request, Response } from 'express';
  import { AdminService } from '../services/admin';

  export async function getDashboardStats(req: Request, res: Response) {
    try {
      const stats = await AdminService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }
