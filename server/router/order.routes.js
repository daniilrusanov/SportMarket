import express from 'express';
const router = express.Router();
import OrderController from '../controller/order.controller.js';

router.get('/', OrderController.findAll);
router.get('/:id', OrderController.findById);
router.post('/', OrderController.create);
router.put('/:id', OrderController.update);
router.delete('/:id', OrderController.deleteOrder);

export default router;