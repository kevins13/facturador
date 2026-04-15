const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware); // Protect all invoice routes

router.get('/', invoiceController.getAll);
router.get('/:id', invoiceController.getById);
router.post('/', invoiceController.create);
router.put('/:id/pay', invoiceController.markAsPaid);
router.get('/:id/pdf', invoiceController.downloadPDF);

module.exports = router;
