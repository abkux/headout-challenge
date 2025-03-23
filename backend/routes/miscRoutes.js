import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { checkUsername } from '../controllers/miscController.js';

const router = express.Router();

/**
 * @swagger
 * /api/misc/username-check:
 *   post:
 *     summary: Check if a username is available
 *     description: Validates whether the given username is available or already taken. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *     responses:
 *       200:
 *         description: Username is available or taken
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized, token required
 */
router.post('/username-check', authMiddleware, checkUsername);

export default router;
