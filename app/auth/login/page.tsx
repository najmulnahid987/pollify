"use client"

import { useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Check if user is logged in and redirect
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      console.log("✅ Login successful!")
      console.log("👤 User name:", session.user.name)
      console.log("📧 User email:", session.user.email)
      console.log("🎉 Welcome to Pollify!", session.user)
      
      // Redirect to dashboard
      router.push("/dashboard")
    }
  }, [status, session, router])

  const handleGithubLogin = async () => {
    try {
      console.log("🔄 Starting GitHub login...")
      const result = await signIn("github", { 
        callbackUrl: "/dashboard",
        redirect: false
      })
      
      if (result?.error) {
        console.error("❌ Login error:", result.error)
      } else if (result?.ok) {
        console.log("✅ GitHub login successful!")
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      console.log("🔄 Starting Google login...")
      const result = await signIn("google", { 
        callbackUrl: "/dashboard",
        redirect: false
      })
      
      if (result?.error) {
        console.error("❌ Login error:", result.error)
      } else if (result?.ok) {
        console.log("✅ Google login successful!")
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6">
        <div className="container mx-auto flex items-center justify-start">
          <Link className="flex items-center gap-2" href="/">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Pollify</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Heading */}
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Get started with Pollify
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Create an account to continue
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            {/* Google Button */}
            <Button
              onClick={handleGoogleLogin}
              size="lg"
              className="w-full flex items-center justify-center gap-3 py-6 px-4 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
                <path d="M1 1h22v22H1z" fill="none"></path>
              </svg>
              Continue with Google
            </Button>

            {/* GitHub Button */}
            <Button
              onClick={handleGithubLogin}
              size="lg"
              className="w-full flex items-center justify-center gap-3 py-6 px-4 text-sm font-semibold rounded-lg border border-transparent bg-gray-900 hover:bg-gray-800 text-white shadow-sm"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.23 1.838 1.23 1.07 1.835 2.809 1.305 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.118-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.56 21.796 24 17.307 24 12c0-6.627-5.373-12-12-12z"></path>
              </svg>
              Continue with GitHub
            </Button>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm gap-2">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-700">
                Log in
              </Link>
            </p>
            <Link
              href="#"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}