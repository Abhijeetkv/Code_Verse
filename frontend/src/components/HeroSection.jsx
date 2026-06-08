import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import interview from "../assets/interview.mp4";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Code2, Video, MessageSquare } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-28 pb-20 overflow-hidden">
      {/* Background Effects */}
      <div className="hero-gradient"></div>
      <div className="hero-grid"></div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Hero Content */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Announcement */}
          <div className="fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8"
              style={{ background: 'var(--slate-900)', border: '1px solid var(--slate-700)', color: 'var(--slate-300)' }}>
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--emerald)' }}></span>
              Code Together, Grow Together
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 fade-up delay-1">
            <span className="text-white">Solve problems.</span>
            <br />
            <span className="text-gradient">Code live with peers.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg max-w-xl mx-auto mb-10 leading-relaxed fade-up delay-2" style={{ color: 'var(--slate-400)' }}>
            A collaborative coding platform where you practice DSA problems,
            join live video sessions, and build your coding skills together 
            with a partner — in real time.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 fade-up delay-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
              style={{ background: 'rgba(0, 184, 163, 0.08)', border: '1px solid rgba(0, 184, 163, 0.2)', color: 'var(--emerald)' }}>
              <Code2 className="w-3.5 h-3.5" /> LeetCode-style Problems
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
              style={{ background: 'rgba(255, 161, 22, 0.08)', border: '1px solid rgba(255, 161, 22, 0.2)', color: 'var(--indigo-500)' }}>
              <Video className="w-3.5 h-3.5" /> Live Video Calls
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
              style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', color: 'var(--sky)' }}>
              <MessageSquare className="w-3.5 h-3.5" /> Real-time Chat
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-up delay-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn-primary px-6 py-3 text-base">
                  Start Coding Free
                  <ArrowRight className="w-4 h-4" />
                </button>
              </SignInButton>
              <button className="btn-ghost px-6 py-3 text-base">
                <Play className="w-4 h-4" />
                See it in action
              </button>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard">
                <button className="btn-primary px-6 py-3 text-base">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </SignedIn>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 mt-12 text-sm fade-up delay-4" style={{ color: 'var(--slate-500)' }}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--emerald)' }}>
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              100% Free
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--emerald)' }}>
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No setup required
            </div>
          </div>
        </div>

        {/* Video Preview */}
        <div className="mt-20 fade-up delay-4">
          <div className="video-container max-w-4xl mx-auto">
            <video
              className="w-full block"
              src={interview}
              loop
              muted
              autoPlay
              playsInline
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
