const express = require('express');
const router = express.Router();
const multer = require('multer');
const inventoryCtrl = require('../controllers/inventoryController');
const reportCtrl = require('../controllers/reportController');

const upload = multer({ dest: 'uploads/' });

router.post('/inventory/upload', upload.single('file'), inventoryCtrl.uploadCSV);
router.get('/store/:id/download-report', reportCtrl.generateReport);

module.exports = router;