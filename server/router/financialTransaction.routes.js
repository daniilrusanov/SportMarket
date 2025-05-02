import express from 'express';
const router = express.Router();
import FinancialTransactionController from '../controller/financialTransaction.controller.js';

router.get('/', FinancialTransactionController.findAll);
router.get('/:id', FinancialTransactionController.findById);
router.post('/', FinancialTransactionController.create);
router.put('/:id', FinancialTransactionController.update);
router.delete('/:id', FinancialTransactionController.delete);

export default router;