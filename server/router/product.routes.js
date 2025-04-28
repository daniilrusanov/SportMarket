import express from 'express';
import ProductController from '../controller/product.controller.js';  // Імпортуємо контролер за замовчуванням

const router = express.Router();

router.get('/', ProductController.findAll);
router.get('/:id', ProductController.findById);
router.post('/', ProductController.create);
router.put('/:id', ProductController.update);
router.delete('/:id', ProductController.deleteProduct);

export default router;  // Замість module.exports
