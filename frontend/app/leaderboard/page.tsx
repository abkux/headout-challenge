import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award } from "lucide-react"

// This would typically come from a database
const leaderboardData = [
  { rank: 1, name: "TravelMaster", score: 950, destinations: 42 },
  { rank: 2, name: "GlobeTrotter", score: 920, destinations: 40 },
  { rank: 3, name: "WorldExplorer", score: 880, destinations: 38 },
  { rank: 4, name: "AdventureSeeker", score: 820, destinations: 36 },
  { rank: 5, name: "WanderlustPro", score: 790, destinations: 35 },
  { rank: 6, name: "JetSetter", score: 760, destinations: 34 },
  { rank: 7, name: "NomadKing", score: 730, destinations: 32 },
  { rank: 8, name: "VoyageVeteran", score: 700, destinations: 31 },
  { rank: 9, name: "CompassQueen", score: 680, destinations: 30 },
  { rank: 10, name: "AtlasAce", score: 650, destinations: 29 },
]

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Global Leaderboard</h1>
        <p className="text-gray-500">The world's top Globetrotters</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Players</CardTitle>
          <CardDescription>Players ranked by total score and destinations correctly guessed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Rank</th>
                  <th className="text-left py-3 px-4">Player</th>
                  <th className="text-right py-3 px-4">Score</th>
                  <th className="text-right py-3 px-4">Destinations</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((player) => (
                  <tr key={player.rank} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      {player.rank === 1 ? (
                        <div className="flex items-center">
                          <Trophy className="h-5 w-5 text-yellow-500 mr-1" />
                          <span>{player.rank}</span>
                        </div>
                      ) : player.rank === 2 ? (
                        <div className="flex items-center">
                          <Medal className="h-5 w-5 text-gray-400 mr-1" />
                          <span>{player.rank}</span>
                        </div>
                      ) : player.rank === 3 ? (
                        <div className="flex items-center">
                          <Award className="h-5 w-5 text-amber-700 mr-1" />
                          <span>{player.rank}</span>
                        </div>
                      ) : (
                        player.rank
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium">{player.name}</td>
                    <td className="py-3 px-4 text-right">{player.score}</td>
                    <td className="py-3 px-4 text-right">{player.destinations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">Leaderboard updates daily. Keep playing to improve your rank!</p>
      </div>
    </div>
  )
}

