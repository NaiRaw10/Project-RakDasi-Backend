import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            message: "Akses ditolak! Token tidak ditemukan." 
        });
    }

    try {
        const secret = "buku_cerminan_hidup";
        const decoded = jwt.verify(token, secret);
        
        (req as any).user = decoded; 
        
        next();
    } catch (error) {
        return res.status(403).json({ 
            message: "Token tidak valid atau sudah kadaluarsa." 
        });
    }
}