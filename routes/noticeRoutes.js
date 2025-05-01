const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice
} = require('../controllers/noticeController');

router.post('/create', upload.single('profile'), createNotice);
router.put('/update', upload.single('profile'), updateNotice);
router.get('/getall', getAllNotices);
router.get('/getbyid/:id', getNoticeById);
router.delete('/delete/:id', deleteNotice);

module.exports = router;
