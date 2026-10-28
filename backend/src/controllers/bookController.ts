import { Request, Response } from "express";
import db from "../config/db";
import cloudinary from '../config/cloudinary';

export async function getAllBooks(req: Request, res: Response) {
  try {
    const { keyword, category } = req.query;

    let query = "select * from books where 1=1";
    let params: any[] = [];

    if (keyword) {
      query += " and title like ?";
      params.push(`%${keyword}%`);
    }

    if (category && category !== "Semua") {
      query += " and category = ?";
      params.push(category);
    }

    const [rows] = await db.query(query, params);

    return res.status(200).json({
      message: "Berhasil mengambil data buku",
      data: rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Gagal mengambil data buku",
      error: error.message,
    });
  }
}

export async function getBookById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const [rows]: any = await db.query("select * from books where id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Buku dengan ID tersebut tidak ditemukan",
      });
    }

    return res.status(200).json({
      message: "Berhasil mengambil detail buku",
      data: rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Gagal mengambil detail buku",
      error: error.message,
    });
  }
}

export async function createBook(req: Request, res: Response) {
  try {
    const { title, author, page, category, cover_url, description } = req.body;

    let imageUrl = null;
    
        if (req.file) {
          const uploadResult: any = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: 'cover_books' },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
    
            stream.end(req.file?.buffer);
          });
    
          imageUrl = uploadResult.secure_url;
        }

    const [result]: any = await db.query(
      "insert into books (title, author, page, category, cover_url, description) values (?, ?, ?, ?, ?, ?)",
      [title, author, page, category, cover_url, description],
    );

    return res.status(201).json({
      message: "Buku berhasil ditambahkan",
      bookId: result.insertId,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Gagal menambahkan buku",
      error: error.message,
    });
  }
}

export async function updateBook(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, author, page, category, cover_url, description } = req.body;

    const [result]: any = await db.query(
      "update books set title = ?, author = ?, page = ?, category = ?, cover_url = ?, description = ? WHERE id = ?",
      [title, author, page, category, cover_url, description, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Buku dengan ID tersebut tidak ditemukan",
      });
    }

    return res.status(200).json({
      message: "Data buku berhasil diperbarui",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Gagal memperbarui data buku",
      error: error.message,
    });
  }
}

export async function deleteBook(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const [result]: any = await db.query("delete from books where id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Buku dengan ID tersebut tidak ditemukan",
      });
    }

    return res.status(200).json({
      message: "Buku berhasil dihapus",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Gagal menghapus buku",
      error: error.message,
    });
  }
}
