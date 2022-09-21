import express from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);

router.route('/:id/reviews').post(protect, createProductReview);

router.get('/top', getTopProducts);

router.route('/:id/edit').put(protect, admin, updateProduct);

router.route('/:id').get(getProductById).put(protect, admin, deleteProduct);

export default router;
