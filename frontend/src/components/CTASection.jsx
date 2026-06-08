import { SignInButton, SignedOut, SignedIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, var(--slate-950), var(--slate-900), var(--slate-950))' }}></div>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255, 161, 22, 0.06), transparent)"
      }}></div>

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
          Ready to code with a partner?
        </h2>
        <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'var(--slate-400)' }}>
          Join HireVerse and start solving problems together. 
          Practice DSA, join live sessions, and level up your skills — for free.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-primary px-8 py-3.5 text-base">
                Get started — it's free
                <ArrowRight className="w-4 h-4" />
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard">
              <button className="btn-primary px-8 py-3.5 text-base">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </SignedIn>
        </div>

        <p className="text-sm mt-8" style={{ color: 'var(--slate-500)' }}>
          No credit card required. Start coding in seconds.
        </p>
      </div>
    </section>
  );
};

export default CTASection;
