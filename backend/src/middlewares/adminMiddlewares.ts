import { Response, NextFunction } from 'express';

export async function verifyAdmin (req: any, res: Response, next: NextFunction) {

  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    return res.status(403).json({
      message: 'Akses ditolak! Khusus Admin.'
    });
  }
};