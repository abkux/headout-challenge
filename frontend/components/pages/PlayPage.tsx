"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  HelpCircle,
  MapPin,
  ThumbsUp,
  Frown,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Confetti from "react-confetti";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PlayPage() {

  type Question = {
    id: string;
    questionText: string;
    options: string[];
    clues: string[];
  };

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [gameState, setGameState] = useState("loading");
  const [score, setScore] = useState(0);
  const [hintsRevealed, setHintsRevealed] = useState(1);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [funFact, setFunFact] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    setIsLoading(true);
    setGameState("loading");

    try {
      const response = await axios.get(`http://localhost:5000/api/game/up/question`);
      const data = response.data;

      if (!data) {
        setIsLoading(false);
        return;
      }

      setCurrentQuestion(data);
      setHintsRevealed(1);
      setGameState("guessing");
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching question:", error);
      setIsLoading(false);
    }
  };

  const checkAnswer = async (selectedOption: string) => {
    if (!currentQuestion) return;

    try {
  
      const isCorrect = selectedOption === "Correct Answer"; 

      if (isCorrect) {
        setGameState("correct");
        setScore(score + 1);
      } else {
        setGameState("incorrect");
        setIncorrectAttempts((prev) => prev + 1);
      }

      setQuestionsAnswered(questionsAnswered + 1);

      if (questionsAnswered === totalQuestions - 1) {
        setGameFinished(true);
      }
    } catch (error) {
      console.error("Error checking answer:", error);
    }
  };

  const revealHint = () => {
    if (currentQuestion && hintsRevealed < currentQuestion.clues.length) {
      setHintsRevealed(hintsRevealed + 1);
    }
  };

  const nextQuestion = () => {
    fetchQuestion();
  };

  const playAgain = () => {
    setScore(0);
    setHintsRevealed(1);
    setIncorrectAttempts(0);
    setQuestionsAnswered(0);
    setGameFinished(false);

    fetchQuestion();
  };

  if (isLoading || (!currentQuestion && !gameFinished)) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-8 max-w-4xl relative">
      {gameState === "correct" && <Confetti />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-8 gap-1 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold">
            Globetrotter Challenge
          </h1>
          <p className="text-gray-500 text-xs sm:text-base">
            Question {questionsAnswered + 1} of {totalQuestions}
          </p>
        </div>
        <div className="text-left sm:text-right w-full sm:w-auto mt-1 sm:mt-0">
          <p className="text-md sm:text-lg font-semibold">Score: {score}</p>
          <Progress
            value={(questionsAnswered / totalQuestions) * 100}
            className="w-full sm:w-32 h-2"
          />
        </div>
      </div>

      <Card className="mb-3 sm:mb-8 shadow-sm">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-2xl">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
            <span className="truncate">Mystery Destination</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-base">
            Guess the famous place based on the clues below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-4 p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="space-y-1.5 sm:space-y-2">
            {currentQuestion &&
              currentQuestion.clues
                .slice(0, hintsRevealed)
                .map((clue, index) => (
                  <div
                    key={index}
                    className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-950 rounded-md"
                  >
                    <p className="text-blue-800 dark:text-blue-300 text-xs sm:text-base">
                      {clue}
                    </p>
                  </div>
                ))}
          </div>

          {gameState === "incorrect" && (
            <div className="flex flex-col items-center space-y-2 mt-2 sm:mt-3 sm:space-y-3">
              <Frown className="h-8 w-8 sm:h-12 sm:w-12 text-red-500 animate-bounce" />
              <Alert variant="destructive" className="mt-1 sm:mt-4 p-2 sm:p-4">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <AlertTitle className="text-xs sm:text-base">
                  Incorrect guess
                </AlertTitle>
                <AlertDescription className="text-xs sm:text-sm">
                  {funFact || "That's not right. Try again or reveal another hint."}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {gameState === "correct" && (
            <div className="flex flex-col items-center space-y-2 mt-2 sm:mt-3 sm:space-y-3">
              <ThumbsUp className="h-8 w-8 sm:h-12 sm:w-12 text-green-500" />
              <Alert className="mt-1 sm:mt-4 p-2 sm:p-4">
                <AlertTitle className="text-xs sm:text-base">
                  Correct guess!
                </AlertTitle>
                <AlertDescription className="text-xs sm:text-sm">
                  {funFact || "Well done! Ready for the next question?"}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center gap-3 sm:gap-6">
        <Button
          variant="outline"
          onClick={revealHint}
          disabled={hintsRevealed >= (currentQuestion?.clues.length || 0)}
        >
          Reveal Hint
        </Button>
        <Button onClick={nextQuestion} variant="default">
          Next Question
        </Button>
      </div>

      {gameFinished && (
        <div className="mt-6 flex justify-center">
          <Button onClick={playAgain} variant="default">
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
}

