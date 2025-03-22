import prisma from "../prisma/client.js";

// Get a new question for the user
export const getQuestion = async (req, res) => {
  try {
    // Get the user ID from the authenticated request
    const userId = req.user.id;

    // Fetch all questions that the user has already seen
    const seenQuestions = await prisma.seenQuestion.findMany({
      where: { userId },
      select: { questionId: true }, // only get the question ids
    });

     // Extract the IDs of seen questions
    const seenQuestionId = seenQuestions.map((q) => q.questionId);

    // Fetch the first unseen question for the user
    const question = await prisma.destination.findFirst({
      where: {
        id: { notIn: seenQuestionId }, // Filter out questions that have already been seen
      },
      orderBy: {
        id: "asc",
      },
      take: 1, // get only 1 question at a time
    });

    // if user have seen all question return a messgae.
    if (!question) {
      return res.json({ message: "User already answered all questions!" });
    }


    // Send the question id and its options and clues as a response
    res.json({
      id: question.id,
      options: question.options,
      clues: question.clues,
    });

    // Mark the fetched question as seen by the user
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


// Check the user's answer for a given question
export const checkAnswer = async (req, res) => {
  const { questionId, answer } = req.body;

  try {
    // Find the destination (question) by its ID
    const destination = await prisma.destination.findUnique({
      where: { id: questionId },
    });

    // If the question is not found, return an error
    if (!destination) {
      return res.status(404).json({ error: "Question not found!" });
    }
    // Compare the user's answer with the correct city name (case-insensitive)
    const isCorrect = destination.city.toLowerCase() === answer.toLowerCase();

    res.json({
      correct: isCorrect,
      funFact: destination.funFact || "No fun fact available!", // incase for fun-fact not available then only return this message
    });
  } catch (error) {
    console.error("Error checking answer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update the user's score after answering a question
export const updateScore = async (req, res) => {
  const { userId } = req.user;
  const { score } = req.body;

   // Update the user's score in the database
  await prisma.user.update({ where: { id: userId }, data: { score } });
  
   // Send a success response after updating the score
  res.json({ message: "Score updated!" });
};
