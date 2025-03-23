import express from 'express';
import { checkAnswer, score, getQuestion, createInvite, getInvite, updateScore, getQuestion2 } from '../controllers/gameController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/game/question:
 *   get:
 *     summary: Get a game question
 *     description: Retrieve a random question for the game. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Question retrieved successfully
 *       401:
 *         description: Unauthorized, token required
 */
router.get('/question', authMiddleware, getQuestion);

/**
 * @swagger
 * /api/game/up/question:
 *   get:
 *     summary: Get an updated game question
 *     description: Retrieve an updated or different game question.
 *     responses:
 *       200:
 *         description: Updated question retrieved successfully
 *       400:
 *         description: Error in retrieving question
 */
router.get('/up/question', getQuestion2);

/**
 * @swagger
 * /api/game/answer:
 *   post:
 *     summary: Submit an answer
 *     description: Submit an answer to a question and validate it. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionId:
 *                 type: string
 *                 example: 12345
 *               answer:
 *                 type: string
 *                 example: Option A
 *     responses:
 *       200:
 *         description: Answer checked successfully
 *       400:
 *         description: Invalid input or question not found
 *       401:
 *         description: Unauthorized, token required
 */
router.post('/answer', authMiddleware, checkAnswer);

/**
 * @swagger
 * /api/game/score:
 *   post:
 *     summary: Submit and retrieve user score
 *     description: Submit a score and retrieve the updated user score. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: number
 *                 example: 10
 *     responses:
 *       200:
 *         description: Score updated successfully
 *       400:
 *         description: Invalid score data
 *       401:
 *         description: Unauthorized, token required
 */
router.post('/score', authMiddleware, score);

/**
 * @swagger
 * /api/game/invite:
 *   post:
 *     summary: Create a game invite
 *     description: Generate a game invite to invite other users.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gameId:
 *                 type: string
 *                 example: 12345
 *               invitedUserId:
 *                 type: string
 *                 example: abc123
 *     responses:
 *       201:
 *         description: Invite created successfully
 *       400:
 *         description: Invalid invite data
 */
router.post('/invite', createInvite);

/**
 * @swagger
 * /api/game/invite:
 *   get:
 *     summary: Get a game invite
 *     description: Retrieve details of an invite using the invite ID.
 *     parameters:
 *       - in: query
 *         name: inviteId
 *         required: true
 *         schema:
 *           type: string
 *         description: The invite ID
 *     responses:
 *       200:
 *         description: Invite details retrieved successfully
 *       404:
 *         description: Invite not found
 */
router.get('/invite', getInvite);

/**
 * @swagger
 * /api/game/game/score:
 *   post:
 *     summary: Update game score
 *     description: Update the score for a game session.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gameId:
 *                 type: string
 *                 example: 12345
 *               score:
 *                 type: number
 *                 example: 20
 *     responses:
 *       200:
 *         description: Score updated successfully
 *       400:
 *         description: Invalid score or game ID
 */
router.post('/game/score', updateScore);

export default router;
