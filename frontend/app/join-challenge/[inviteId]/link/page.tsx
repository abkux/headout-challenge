"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PlayPage from "@/app/play/page"
import axios from "axios"

const JoinChallenge = () => {
  const { inviteId } = useParams()
  const searchParams = useSearchParams()

  const code = searchParams.get("code")
  const username = searchParams.get("username")

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const verifyChallenge = async () => {
      if (!inviteId || !code || !username) {
        setError("Missing required parameters: inviteId, code, or username.")
        setLoading(false)
        return
      }

      try {
        // Make sure your API endpoint is correct
        const result = await axios.get("/api/game/invite", {
          params: {
            code: code,
            username: username,
          },
        });
        if (result.data.success) {
          setIsValid(true)
        } else {
          setError("Mismatch! The provided details are invalid.")
        }
      } catch (error) {
        console.error("API Error:", error)
        setError("Something went wrong while verifying the challenge.")
      }

      setLoading(false)
    }

    verifyChallenge()
  }, [code, username])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return isValid ? (
    <div>
      <PlayPage />
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-screen">
      <Alert variant="destructive">
        <AlertDescription>Invalid challenge details. Please check and try again.</AlertDescription>
      </Alert>
    </div>
  )
}

export default JoinChallenge

