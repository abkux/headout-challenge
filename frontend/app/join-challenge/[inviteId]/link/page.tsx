"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PlayPage from "@/components/pages/PlayPage";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";

const JoinChallenge = () => {
  const { inviteId } = useParams();
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const username = searchParams.get("username");
  const score = searchParams.get("score");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const verifyChallenge = async () => {
      if (!code || !username) {
        setError("Missing required parameters: code or username.");
        setLoading(false);
        return;
      }

      try {
        const result = await axios.get(`https://headout-challenge.onrender.com/api/game/invite?code=${code}&username=${username}`);
        if (result.data.success) {
          setIsValid(true);
        } else {
          setError("Mismatch! The provided details are invalid.");
        }
      } catch (error) {
        console.error("API Error:", error);
        setError("Something went wrong while verifying the challenge.");
      }

      setLoading(false);
    };

    verifyChallenge();
  }, [code, username, inviteId]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleAcceptChallenge = async () => {
    try {
      setAccepted(true);
    } catch (error) {
      console.error("API Error:", error);
      setError("Something went wrong while accepting the challenge, Please check URL Carefully.");
    }
  };

  if (accepted) {
    return <PlayPage />;
  }

  return isValid ? (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <Card className="w-[400px] max-w-[90%]">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">Friend Challenge</CardTitle>
          <p className="text-center text-gray-500 mt-2">Can you beat their score?</p>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-5 rounded-lg mb-6">
            <h3 className="text-center text-xl mb-4">Score:</h3>
            <div className="flex justify-center gap-16">
              <div className="text-center">
                <p className="text-5xl font-bold text-green-500">{score}</p>
                <p className="text-gray-500">Correct</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full text-lg py-6" onClick={handleAcceptChallenge}>
            Accept Challenge <span className="ml-2">→</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-screen">
      <Alert variant="destructive">
        <AlertDescription>Invalid challenge details. Please check and try again.</AlertDescription>
      </Alert>
    </div>
  );
};

export default JoinChallenge;
