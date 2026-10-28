import { Router } from "express";
import {getAllBooks, createBook, updateBook, deleteBook, getBookById} from "../controllers/bookController";
import { verifyAdmin } from "../middlewares/adminMiddlewares";
import { verifyToken } from "../middlewares/authMiddlewares";

const router = Router();

router.get("/", getAllBooks);
router.get("/books/:id", getBookById);

router.post("/", verifyToken, verifyAdmin, createBook);
router.put("/:id", verifyToken, verifyAdmin, updateBook);
router.delete("/:id", verifyToken, verifyAdmin, deleteBook);

export default router;
