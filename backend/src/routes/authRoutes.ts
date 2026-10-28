import { Router } from 'express';
import multer  from 'multer';
import { register, login, getAllUsers, deleteUsers } from '../controllers/authController';
import { verifyToken } from '../middlewares/authMiddlewares';
import { verifyAdmin } from '../middlewares/adminMiddlewares';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/regis',upload.single('image'), register);
router.post('/auth/login', login);
router.get('/users', verifyToken, getAllUsers);
router.delete('/users/:id', verifyToken, verifyAdmin, deleteUsers);

export default router;