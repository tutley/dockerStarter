const express = require("express");

const authController = require("../controllers/authController");

const router = express.Router();

const {protect} = require ('../middleware/authMiddleware');

router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/signup", authController.signUp);
router.post("/verify", authController.verifyEmail);
router.post("/resendVerification", protect, authController.resendVerification);
router.post("/checkzip", authController.checkzip);
router.put("/profile", protect, authController.updateProfile);
router.get("/profile", protect, authController.getProfile);

module.exports = router;
