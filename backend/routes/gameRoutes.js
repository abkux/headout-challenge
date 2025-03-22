import express from 'express';
import { checkAnswer, updateScore, getQuestion } from '../controllers/gameController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
// fetch question from db route
router.get('/question', authMiddleware, getQuestion);
// check answer, with id and selected ooption
router.post('/answer', authMiddleware, checkAnswer);
// check score of the user
router.post('/score', authMiddleware, updateScore);

export default router;
