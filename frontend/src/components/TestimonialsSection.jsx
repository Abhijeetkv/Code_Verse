import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "CodeVerse makes pair programming so easy. I joined a session, solved a problem with a stranger, and learned a new approach — all in 20 minutes.",
      name: "Arjun Mehta",
      role: "Full-Stack Developer",
      company: "",
      initials: "AM"
    },
    {
      quote: "The video + code editor combo is seamless. It's like being in the same room. Way better than screen-sharing on Zoom.",
      name: "Priya Sharma",
      role: "CS Student",
      company: "",
      initials: "PS"
    },
    {
      quote: "I use this daily to practice DSA. The streak tracking keeps me motivated, and the live sessions are a game-changer for learning.",
      name: "Rahul Verma",
      role: "Software Engineer",
      company: "",
      initials: "RV"
    }
  ];

  return (
    <section id="testimonials" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-medium text-sm mb-4" style={{ color: 'var(--indigo-500)' }}>TESTIMONIALS</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Loved by developers
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4" style={{ fill: 'var(--amber)', color: 'var(--amber)' }} />
                ))}
              </div>

              {/* Quote */}
              <p className="leading-relaxed mb-6" style={{ color: 'var(--slate-200)' }}>
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="avatar">{t.initials}</div>
                <div>
                  <div className="font-medium text-white text-sm">{t.name}</div>
                  <div className="text-xs" style={{ color: 'var(--slate-500)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
