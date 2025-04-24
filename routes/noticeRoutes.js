const express = require('express');
const router = express.Router();
const {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice
} = require('../controllers/noticeController');

router.post('/create', createNotice);
router.get('/getall', getAllNotices);
router.get('/:id', getNoticeById);
router.put('/update', updateNotice);
router.delete('/:id', deleteNotice);

module.exports = router;
