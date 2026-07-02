import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-glass">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="CodeVerse" className="h-8 w-8" />
            <span className="text-lg font-semibold text-white">CodeVerse</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <a href="#features" className="nav-item">Features</a>
            <a href="#how-it-works" className="nav-item">How it works</a>
            <a href="#testimonials" className="nav-item">Testimonials</a>
          </div>

          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="nav-item hidden sm:block">Sign in</button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="btn-primary text-sm">Get started</button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link to="/dashboard">
                <button className="btn-primary text-sm">Dashboard</button>
              </Link>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-lg"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
