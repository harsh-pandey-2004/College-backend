const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.post('/bulk-upload', courseController.bulkUploadCourses);
router.get('/search', courseController.getCourses);
router.get('/', courseController.getCollege);

module.exports = router;