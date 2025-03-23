"use client";

import { useState, useEffect } from "react";
import axios from "axios";
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
  Share2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Confetti from "react-confetti";
import api from "@/lib/axios-helper";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/axios";
import ChallengeModal from "@/components/pages/ChallengeModal";

export default function PlayPage() {
  const router = useRouter();

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
  const [username, setUsername] = useState("");
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const [open, setOpen] = useState(false);

  // Fetch question on initial load
  useEffect(() => {

    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    setIsLoading(true);
    setGameState("loading");

    try {
      const response = await axios.get(`https://headout-challenge.onrender.com/api/game/up/question`);
      const data = response.data;

      console.log(data);

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
      const response = await axios.post("https://headout-challenge.onrender.com/api/game/answer", {
        questionId: currentQuestion.id,
        answer: selectedOption,
      });

      const data = response.data;

      if (data.correct) {
        setGameState("correct");
        setScore(score + 1);
      } else {
        setGameState("incorrect");
        setIncorrectAttempts((prev) => prev + 1);
      }

      setFunFact(data.funFact || "");
      setQuestionsAnswered(questionsAnswered + 1);

      if (questionsAnswered == totalQuestions - 1) {
        setGameFinished(true); // Mark game as finished
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

  if (gameFinished) {

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl flex flex-col items-center">
        <Confetti />
        <Card className="shadow-lg p-6 text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Game Over!</CardTitle>
            <CardDescription className="text-gray-600">
              You have completed all {totalQuestions} questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">Your Score: {score}</p>
            <p className="text-gray-500">
              Incorrect Attempts: {incorrectAttempts}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button onClick={playAgain} className="w-full text-base py-2">
              Play Again
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full text-base py-2"
            >
              Go to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-8 max-w-4xl relative">

    {open && <ChallengeModal open={open} setOpen={setOpen} />}

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
                  {funFact ||
                    "That's not right. Try again or reveal another hint."}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {gameState === "correct" && (
            <div className="flex flex-col items-center space-y-2 mt-2 sm:mt-3 sm:space-y-3">
              <ThumbsUp className="h-8 w-8 sm:h-12 sm:w-12 text-green-500 animate-bounce" />
              <Alert className="bg-green-50 dark:bg-green-950 border-green-500 p-2 sm:p-4">
                <AlertTitle className="text-green-800 dark:text-green-300 text-xs sm:text-base">
                  Correct!
                </AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-400 text-xs sm:text-sm">
                  {funFact || "You guessed it! That's the right answer."}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-1.5 sm:gap-4 p-3 sm:p-6 pt-0 sm:pt-0">
          {gameState === "guessing" ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 w-full">
                {currentQuestion && currentQuestion.options.map((option, index) => (
                  <Button
                     key={index}
                    onClick={() => checkAnswer(option)}
                    className="w-full text-xs sm:text-base py-1.5 sm:py-2 h-auto min-h-[2rem] sm:min-h-[2.5rem]"
                  >
                    {option}
                  </Button>
                ))}
              </div>
              { currentQuestion && currentQuestion.clues.length > hintsRevealed && (
                <Button
                  variant="outline"
                  onClick={revealHint}
                  className="w-full mt-1 sm:mt-2 text-xs sm:text-base h-auto py-1.5 sm:py-2"
                >
                  <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">
                    Reveal Next Clue (
                    {currentQuestion.clues.length - hintsRevealed} left)
                  </span>
                </Button>
              )}
            </>
          ) : (
            <Button
              onClick={nextQuestion}
              className="w-full text-xs sm:text-base py-1.5 sm:py-2 h-auto min-h-[2rem] sm:min-h-[2.5rem]"
            >
              Next Question
            </Button>

          )}


        </CardFooter>
      </Card>
      <div className="text-center space-x-1">
        <Badge
          variant="outline"
          className="text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1"
        >
          Clues used: {hintsRevealed} | Incorrect attempts: {incorrectAttempts}
        </Badge>

        {/* <Badge
          variant="outline"
          className="text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1"
        >
          Logged User: {username}
        </Badge> */}

        {/* <Button
          variant="outline"
          className="text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-0.5 border border-red-500"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          Logout
        </Button> */}

        
      </div>
    </div>
  );
}

