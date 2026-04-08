import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export default async function LandingPage() {
  // Check if user is authenticated
  const supabase = await createSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If authenticated, redirect to dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="relative min-h-screen w-full bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-2" href="/">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Pollify</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors" href="#how-it-works">
              How it works
            </a>
            <a className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors" href="#pricing">
              Pricing
            </a>
            <a className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors" href="#resources">
              Resources
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex text-sm font-medium text-gray-600 hover:text-blue-600"
              >
                Log In
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Poll
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl font-poppins">
            Create Polls &amp; Surveys in Seconds
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
            Effortlessly create and share polls and surveys to gather valuable insights from your audience. Clean, minimal, and user-friendly.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/auth/login">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-base font-semibold shadow-lg"
              >
                Create Poll
              </Button>
            </Link>
          </div>
        </div>

        {/* Video Section */}
        <section className="mt-20 py-16 sm:py-24 bg-blue-50 -mx-4 sm:-mx-6 lg:-mx-8 rounded-2xl">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-poppins">
              Guided Introduction to Pollify
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
              Discover the power of effortless polling. Watch our brief video to see how Pollify simplifies gathering insights.
            </p>
            <div className="mt-12 flex justify-center">
              <div className="w-full max-w-4xl aspect-video overflow-hidden rounded-2xl bg-gray-200 shadow-xl">
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                  frameBorder="0"
                  referrerPolicy="strict-origin-when-cross-origin"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=xXzT6z4d8y5yY6z7"
                  title="YouTube video player"
                />
              </div>
            </div>
            <div className="mt-10 max-w-2xl mx-auto text-left">
              <h3 className="text-xl font-semibold text-gray-900">What you'll learn:</h3>
              <ul className="mt-4 space-y-3 text-lg text-gray-600 list-disc list-inside">
                <li>Create your first poll with our intuitive builder in minutes.</li>
                <li>Easily share your polls across platforms to reach your audience.</li>
                <li>Access real-time analytics to understand your results instantly.</li>
                <li>Customize your polls with various question types and branding options.</li>
                <li>Export your data for deeper analysis and reporting.</li>
              </ul>
              <div className="mt-8 text-center">
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-base font-semibold shadow-lg"
                  >
                    Start Your First Poll
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <div className="mt-20 lg:mt-24">
          <div className="relative">
            <div className="relative mx-auto max-w-5xl">
              <div className="rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 overflow-hidden">
                <img
                  alt="Pollify dashboard illustration with charts and graphs"
                  className="rounded-2xl w-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuArLHqXrMcpkhC_cPX9eq8vDWzwMv8y-Jfi6RKp1Tii3swzTsSgppWoXA4y38-b-7GHttVoR2QOEJppK_DI14ytEsSYHrSyaBM47hgsX7hQx4h7VyJTlKRHNjeoN6hhpp-0N-JqFpWp4Mz5AozV6gie9MhtFtZeBULwtm1SmjEqHzeu6fPG3SeiXCN91lMfTcFd-wBH8BhRbwK3o7u_QbhU3jbn2i3WiSZoDVNDo-68wnWKQcQiyx6AW3VygLbkbkMXGs-onPvCgbM"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3-Step Process */}
        <section className="mt-20 py-16 sm:py-24" id="how-it-works">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-poppins">
              A simple 3-step process
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Follow these simple steps to create, share, and analyze your polls.
            </p>
          </div>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Create</h3>
              <p className="mt-2 text-base text-gray-600">
                Design your poll with our intuitive interface, adding questions and answer choices in minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Share</h3>
              <p className="mt-2 text-base text-gray-600">
                Share your poll via a unique link or embed it on your website to reach your audience.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Get Results</h3>
              <p className="mt-2 text-base text-gray-600">
                Analyze responses in real-time with our comprehensive reporting tools and beautiful charts.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}