const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getItems, createItem, updateItemStatus, deleteItem } = require('../controllers/itemController');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/', getItems);
router.post('/', auth, upload.single('image'), createItem);
router.put('/:id/status', auth, updateItemStatus);
router.delete('/:id', auth, deleteItem);

module.exports = router;