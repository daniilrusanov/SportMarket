import express from 'express';
const router = express.Router();
import WarehouseController from '../controller/warehouse.controller.js';

router.get('/', WarehouseController.findAll);
router.get('/:id', WarehouseController.findById);
router.post('/', WarehouseController.create);
router.put(':id', WarehouseController.update);
router.delete('/:id', WarehouseController.deleteWarehouse);

export default router;