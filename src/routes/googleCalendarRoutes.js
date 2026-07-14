const express = require('express');
const router = express.Router();
const googleCalendarController = require('../controllers/googleCalendarController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/connect', googleCalendarController.connect);
router.get('/callback', googleCalendarController.callback);
router.post('/disconnect', googleCalendarController.disconnect);

module.exports = router;
