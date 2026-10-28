import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../config/db';
import cloudinary from '../config/cloudinary';

export async function register(req: any, res: Response) {
  try { 
    const { username, email, password } = req.body;
    let imageUrl = null;

    if (req.file) {
      const uploadResult: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'user_profiles' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file?.buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    const query =
      'insert into users (username, email, password, image) values (?, ?, ?, ?)';

    await db.execute(query, [username, email, password, imageUrl]);

    return res.status(201).json({
      message: 'Berhasil Registrasi!',
      image_url: imageUrl,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: 'Gagal Register!',
      error: error.message,
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        message: 'Login Gagal! Email dan password wajib diisi.',
      });
    }

    const [users]: [any[], any] = await db.execute(
      'select * from users where email = ?',
      [req.body.email]
    );

    if (!users[0] || users[0].password !== req.body.password) {
      return res.status(400).json({
        message: 'Login Gagal! Email atau password salah.',
      });
    }

    const token = jwt.sign(
      {
        id: users[0].id,
        email: users[0].email,
        role: users[0].role,
      },
      'buku_cerminan_hidup'
    );

    return res.status(200).json({
      message: 'Login Berhasil!',
      token: token,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const [users] = await db.execute('select * from users');

    return res.status(200).json({
      message: 'user masuk!',
      data: users,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Gagal mengambil data user',
      error: error.message,
    });
  }
}

export async function deleteUsers(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const [result]: any = await db.query(
      'delete from users where id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'User dengan ID tersebut tidak ditemukan',
      });
    }

    return res.status(200).json({
      message: 'User berhasil dihapus',
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Gagal menghapus user',
      error: error.message,
    });
  }
}