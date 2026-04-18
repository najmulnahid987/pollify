import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Lock,
  MessageCircle,
  PlayCircle,
  QrCode,
  ShieldCheck,
  Star,
  Users2,
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { HeroImageCarousel } from "@/components/HeroImageCarousel"

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

  const featureCards = [
    {
      icon: MessageCircle,
      title: "Fast Poll Builder",
      description:
        "Create and edit polls with titles, descriptions, option images, and flexible answer structures in minutes.",
    },
    {
      icon: QrCode,
      title: "Share Anywhere",
      description:
        "Distribute polls with direct links, clipboard copy, native share support, and downloadable QR codes.",
    },
    {
      icon: Lock,
      title: "Visibility Controls",
      description:
        "Choose public or private poll access and manage publish state so only the right audience can respond.",
    },
    {
      icon: Star,
      title: "Feedback + Ratings",
      description:
        "Collect votes with optional text feedback and 1-5 star ratings for richer insight beyond raw counts.",
    },
    {
      icon: BarChart3,
      title: "Live Analytics",
      description:
        "Track total votes, option performance, and average ratings with instant visual reporting.",
    },
    {
      icon: FileText,
      title: "Exportable Reports",
      description:
        "Generate PDF summaries with response details, ratings, and voting breakdowns for sharing and review.",
    },
  ]

  const useCases = [
    {
      title: "Product Discovery",
      description: "Validate ideas, prioritize features, and capture customer sentiment quickly.",
    },
    {
      title: "Team Decision Making",
      description: "Run internal polls for policies, planning, and cross-functional alignment.",
    },
    {
      title: "Event and Program Feedback",
      description: "Collect structured ratings and comments after launches, workshops, and campaigns.",
    },
  ]

  const faqs = [
    {
      question: "Can I keep a poll private?",
      answer:
        "Yes. Pollify supports visibility controls so you can keep polls private or make them public when needed.",
    },
    {
      question: "Do voters need an account to respond?",
      answer:
        "Public poll links are designed for easy participation. You can also collect voter details like name and email when needed.",
    },
    {
      question: "Can I collect qualitative feedback, not just votes?",
      answer:
        "Yes. Feedback mode supports written comments and 1-5 star ratings in addition to option-based voting.",
    },
    {
      question: "What reporting is available?",
      answer:
        "You get live result visualization, response summaries, searchable feedback views, and downloadable PDF exports.",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-2" href="/">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-semibold tracking-tight sm:text-2xl">Pollify</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <a className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600" href="#features">
              Features
            </a>
            <a className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600" href="#how-it-works">
              How It Works
            </a>
            <a className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600" href="#security">
              Security
            </a>
            <a className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600" href="#faq">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button className="hidden sm:inline-flex" size="sm" variant="ghost">
                Log In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-blue-600 text-white hover:bg-blue-700" size="sm">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-100 blur-3xl" />
            <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-sky-100 blur-3xl" />
          </div>

          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div>
              <p className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                Built for fast decisions and real-time feedback.
              </p>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Create professional polls and feedback with real-time insight.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-slate-600">
                Pollify helps product, operations, and research teams collect responses quickly, control visibility,
                and report outcomes with confidence.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/auth/signup">
                  <Button className="bg-blue-600 px-7 py-5 text-base text-white shadow-sm hover:bg-blue-700" size="lg">
                    Start Creating Polls
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a
                  className="inline-flex items-center text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600"
                  href="#video-demo"
                >
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Watch Product Demo
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-2xl font-semibold text-slate-900">Public/Private</p>
                  <p className="mt-1 text-sm text-slate-600">Control poll visibility</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-2xl font-semibold text-slate-900">Live Results</p>
                  <p className="mt-1 text-sm text-slate-600">Track every response instantly</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-2xl font-semibold text-slate-900">PDF Export</p>
                  <p className="mt-1 text-sm text-slate-600">Share clean reports in seconds</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <HeroImageCarousel />
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="features">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Feature Deep Dive</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need to collect decisions and feedback at scale.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              From rapid poll creation to secure sharing and exportable reporting, Pollify gives teams an end-to-end
              workflow in one place.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="inline-flex rounded-xl bg-blue-50 p-3 text-blue-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white" id="how-it-works">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">How It Works</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Launch and learn in three simple steps.
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Build",
                  description: "Create a poll, define options, and configure response settings for your audience.",
                },
                {
                  title: "Share",
                  description: "Distribute with a direct link, QR code, or native share flow across channels.",
                },
                {
                  title: "Analyze",
                  description: "Monitor live results, review feedback, and export reports to align stakeholders.",
                },
              ].map((step, index) => (
                <article key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Use Cases</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Built for modern teams in product, operations, and research.
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Pollify supports both quick pulse checks and deeper feedback loops where qualitative insights matter.
              </p>

              <div className="mt-8 space-y-4">
                {useCases.map((useCase) => (
                  <div key={useCase.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900">{useCase.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{useCase.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div id="video-demo">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <h3 className="text-xl font-semibold text-slate-900">Guided Product Demo</h3>
                <p className="mt-2 text-sm text-slate-600">
                  See how teams create polls, collect responses, and convert raw feedback into actionable decisions.
                </p>
                <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  <div className="aspect-video w-full">
                    <iframe
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="h-full w-full"
                      frameBorder="0"
                      referrerPolicy="strict-origin-when-cross-origin"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=xXzT6z4d8y5yY6z7"
                      title="Pollify product demo"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white" id="security">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Security and Privacy</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Built with ownership controls and data access boundaries.
                </h2>
                <p className="mt-4 text-lg text-slate-600">
                  Pollify uses authenticated ownership checks and database-level policies to protect private polls and
                  response data.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Public and private visibility settings per poll",
                  "Owner-verified update and delete actions",
                  "Row-level security policies for controlled data access",
                  "Optional voter details collection with structured feedback",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <p className="text-sm text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="faq">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">FAQ</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Common questions from teams</h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((item) => (
              <article key={item.question} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="flex items-start gap-3 text-lg font-semibold text-slate-900">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <span>{item.question}</span>
                </h3>
                <p className="mt-3 pl-8 text-sm leading-6 text-slate-600">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-900 text-white">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">Final Call to Action</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Start your next poll in under 5 minutes.</h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                Create your account, publish your poll, and gather reliable insight with a workflow designed for busy
                teams.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/auth/signup">
                <Button className="bg-blue-500 text-white hover:bg-blue-400" size="lg">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button className="border-slate-500 text-white hover:bg-slate-800" size="lg" variant="outline">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p className="inline-flex items-center gap-2">
            <Users2 className="h-4 w-4 text-blue-600" />
            Pollify helps teams turn opinions into clear action.
          </p>
          <div className="flex items-center gap-5">
            <a className="transition-colors hover:text-blue-600" href="#features">
              Features
            </a>
            <a className="transition-colors hover:text-blue-600" href="#security">
              Security
            </a>
            <a className="transition-colors hover:text-blue-600" href="#faq">
              FAQ
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}