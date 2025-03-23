import prisma from "../prisma/client.js";

/**
 * @swagger
 * tags:
 *   - name: Question
 *     description: Operations related to questions
 *   - name: Answer
 *     description: Operations related to answering questions
 *   - name: Score
 *     description: Operations related to user score
 *   - name: Invite
 *     description: Operations related to invites
 */

/**
 * @swagger
 * /question:
 *   get:
 *     summary: Get a new question for the authenticated user
 *     tags: [Question]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched a question
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               options: ["Paris", "London", "Tokyo", "New York"]
 *               clues: ["City of Light"]
 *       404:
 *         description: User already answered all questions
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /question2:
 *   get:
 *     summary: Get a new question without authentication (Join Challenge Phase)
 *     tags: [Question]
 *     responses:
 *       200:
 *         description: Successfully fetched a question
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               options: ["Paris", "London", "Tokyo", "New York"]
 *               clues: ["City of Light"]
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /check-answer:
 *   post:
 *     summary: Check the user's answer for a given question
 *     tags: [Answer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             questionId: 1
 *             answer: "Paris"
 *     responses:
 *       200:
 *         description: Returns whether the answer is correct and a fun fact
 *         content:
 *           application/json:
 *             example:
 *               correct: true
 *               funFact: "Paris is known as the City of Light."
 *       404:
 *         description: Question not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /score:
 *   post:
 *     summary: Update the user's score after answering a question
 *     tags: [Score]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             score: 10
 *     responses:
 *       200:
 *         description: Score updated successfully
 *       400:
 *         description: User not found
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /create-invite:
 *   post:
 *     summary: Create an invite for another user
 *     tags: [Invite]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             inviterId: "user123"
 *             invitee: "john_doe"
 *             score: 5
 *             inviteLink: "abcd1234"
 *     responses:
 *       201:
 *         description: Invite created successfully
 *       400:
 *         description: Invite link already exists
 *       500:
 *         description: Failed to create invite
 */

/**
 * @swagger
 * /get-invite:
 *   post:
 *     summary: Get details of an invite
 *     tags: [Invite]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userId: "user123"
 *             code: "abcd1234"
 *             username: "john_doe"
 *     responses:
 *       200:
 *         description: Invite found, proceeding to next step
 *       404:
 *         description: Invite not found or invalid details
 *       500:
 *         description: Failed to get invite details
 */

/**
 * @swagger
 * /update-score:
 *   post:
 *     summary: Update the user's score and record in the UserScore table
 *     tags: [Score]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userId: "user123"
 *             newScore: 20
 *     responses:
 *       200:
 *         description: Score updated successfully
 *       500:
 *         description: Failed to update score
 */

// Get a new question for the user
export const getQuestion = async (req, res) => {
  try {
    const userId = req.user.id;

    const seenQuestions = await prisma.seenQuestion.findMany({
      where: { userId },
      select: { questionId: true },
    });

    const seenQuestionId = seenQuestions.map((q) => q.questionId);

    const question = await prisma.destination.findFirst({
      where: {
        id: { notIn: seenQuestionId },
      },
      orderBy: {
        id: "asc",
      },
      take: 1,
    });

    if (!question) {
      return res.json({ message: "User already answered all questions!" });
    }

    res.json({
      id: question.id,
      options: question.options,
      clues: question.clues,
    });

    await prisma.seenQuestion.create({
      data: {
        userId,
        questionId: question.id,
      },
    });
  } catch (error) {
    console.error("Error getting question:", error);
    return res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

// Get a new question for the user without authentication
export const getQuestion2 = async (req, res) => {
  try {
    const question = await prisma.destination.findFirst({
      orderBy: {
        id: "asc",
      },
      take: 1,
    });
    res.json({
      id: question.id,
      options: question.options,
      clues: question.clues,
    });
  } catch (error) {
    console.error("Error getting question:", error);
    return res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

// Check the user's answer for a given question
export const checkAnswer = async (req, res) => {
  const { questionId, answer } = req.body;

  try {
    const destination = await prisma.destination.findUnique({
      where: { id: questionId },
    });

    if (!destination) {
      return res.status(404).json({ error: "Question not found!" });
    }

    const isCorrect = destination.city.toLowerCase() === answer.toLowerCase();

    res.json({
      correct: isCorrect,
      funFact: destination.funFact || "No fun fact available!",
    });
  } catch (error) {
    console.error("Error checking answer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update the user's score after answering a question
export const score = async (req, res) => {
  const userId = req.user.id;
  const { score } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User not found" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { score: score },
    });

    return res.status(200).json({
      message: "Score updated successfully",
    });
  } catch (error) {
    console.error("Error updating score:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Create an invite for another user
export const createInvite = async (req, res) => {
  const { inviterId, invitee, score, inviteLink } = req.body;
  try {
    const invite = await prisma.invite.create({
      data: {
        inviterId,
        invitee,
        score,
        inviteLink,
      },
    });

    res.status(201).json({ invite, message: "Invite created successfully" });
  } catch (error) {
    console.error("Error while creating invite:", error);

    if (error.code === "P2002") {
      res.status(400).json({ error: "Invite link already exists" });
    } else {
      res.status(500).json({ error: "Failed to create invite", details: error.message });
    }
  }
};

// Get invite details
export const getInvite = async (req, res) => {
  const { userId, code, username } = req.body;

  try {
    const fetchInviteData = await prisma.invite.findFirst({
      where: {
        inviteLink: code,
        inviterId: userId,
        invitee: username,
      },
    });

    if (!fetchInviteData) {
      return res.status(404).json({ error: "Invite not found or invalid details" });
    }

    res.status(200).json({
      success: true,
      invite: fetchInviteData,
      message: "Invite found, proceeding to next step.",
    });
  } catch (error) {
    console.error("Error fetching invite:", error);
    res.status(500).json({ error: "Failed to get invite details" });
  }
};

// Update the user's score and record in the UserScore table
export const updateScore = async (req, res) => {
  const { userId, newScore } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { score: newScore },
    });

    await prisma.userScore.upsert({
      where: { userId },
      update: { score: newScore },
      create: {
        userId,
        username: user.username,
        score: newScore,
      },
    });

    res.json({ message: 'Score updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update score' });
  }
};
