import express from 'express';
const router = express.Router();
import SupplierController from  '../controller/supplier.controller.js';

router.get('/', SupplierController.findAll);
router.get('/:id', SupplierController.findById);
router.post('/', SupplierController.create);
router.put('/:id', SupplierController.update);
router.delete('/:id', SupplierController.deleteSupplier);

export default router;