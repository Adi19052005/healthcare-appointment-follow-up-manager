const express = require("express");
const router = express.Router();
const tokenController = require("../controllers/tokenController");
const { cleanupPushTokens } = require("../jobs/cleanupPushTokens");

router.post("/", tokenController.registerToken);
router.delete("/:token", tokenController.deleteToken);
router.get("/user/:userId", tokenController.getTokensForUser);

// Manual cleanup trigger (optional)
router.post('/cleanup', async (req, res, next) => {
	try {
		const days = parseInt(req.body.days || process.env.PUSH_TOKEN_TTL_DAYS || '90', 10);
		await cleanupPushTokens(days);
		res.json({ success: true, message: 'Cleanup triggered' });
	} catch (err) {
		next(err);
	}
});

module.exports = router;
