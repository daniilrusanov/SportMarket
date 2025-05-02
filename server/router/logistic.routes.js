import express from 'express';
const router = express.Router();
import LogisticController from '../controller/logistic.controller.js';

router.get('/', LogisticController.findAll);
router.get('/:id', LogisticController.findById);
router.post('/', LogisticController.create);
router.put('/:id', LogisticController.update);
router.delete('/:id', LogisticController.delete);

export default router;