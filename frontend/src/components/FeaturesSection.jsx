import { Video, Code2, BookOpen, Users, MessageSquare, Zap } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Code2,
      title: "LeetCode-style Problems",
      description: "Practice with curated DSA challenges across Easy, Medium, and Hard — track your progress and build consistency."
    },
    {
      icon: Video,
      title: "Live Video Sessions",
      description: "Pair up with another coder over HD video. Discuss approaches, debug together, and learn from each other."
    },
    {
      icon: MessageSquare,
      title: "Built-in Chat",
      description: "Real-time messaging in every session. Share links, discuss edge cases, and keep the conversation flowing."
    },
    {
      icon: Users,
      title: "Collaborative Coding",
      description: "Shared code editor with syntax highlighting. Both participants see changes instantly — like Google Docs for code."
    },
    {
      icon: BookOpen,
      title: "Multi-language Support",
      description: "Write solutions in JavaScript, Python, Java, C++, and more. Switch languages anytime with built-in starter code."
    },
    {
      icon: Zap,
      title: "Instant Execution",
      description: "Run and submit your code in the browser. Get instant feedback — Accepted, Wrong Answer, or Runtime Error."
    }
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-medium text-sm mb-4" style={{ color: 'var(--indigo-500)' }}>FEATURES</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything you need to level up
          </h2>
          <p className="text-lg" style={{ color: 'var(--slate-400)' }}>
            Practice coding, collaborate over video, and grow your skills — all in one place.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <div key={i} className="feature-card group">
              <div className="feature-icon">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p style={{ color: 'var(--slate-400)' }} className="leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
