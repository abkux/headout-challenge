import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export default function Home() {
  return (
<div className="flex min-h-screen flex-col items-center">
  <main className="flex-1 w-full">
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-blue-600 p-3 text-white">
            <Globe className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            The Globetrotter Challenge
          </h1>
          <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Test your travel knowledge with cryptic clues about famous destinations around the world.
          </p>
          <div className="space-x-4">
            <Link href="/play">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Playing
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button size="lg" variant="outline">
                Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>

    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-3 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Solve Cryptic Clues</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Decipher mysterious hints about famous landmarks and destinations.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-3 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Discover Fun Facts</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Unlock interesting trivia and surprising information about each location.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-3 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
              >
                <path d="M12 6v12" />
                <path d="M17 10h.01" />
                <path d="M7 10h.01" />
                <path d="M12 2a8 8 0 0 0-8 8v12l8-4 8 4V10a8 8 0 0 0-8-8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Earn Points</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Compete with friends and climb the global leaderboard with each correct guess.
            </p>
          </div>
        </div>
      </div>
    </section>

    <footer className="w-full border-t py-6">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Globetrotter Challenge. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link className="text-sm hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-sm hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  </main>
</div>

  )
}

