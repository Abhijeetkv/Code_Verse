const HowItWorksSection = () => {
  const steps = [
    {
      num: "01",
      title: "Pick a problem",
      desc: "Choose from our curated library of DSA challenges — Easy, Medium, or Hard."
    },
    {
      num: "02",
      title: "Create a session",
      desc: "Spin up a live room with video, chat, and a shared code editor in one click."
    },
    {
      num: "03",
      title: "Code together",
      desc: "A partner joins your session. Discuss approaches, write code, and debug in real time."
    },
    {
      num: "04",
      title: "Submit & grow",
      desc: "Run your solution, get instant feedback, and track your streak and progress."
    }
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-medium text-sm mb-4" style={{ color: 'var(--indigo-500)' }}>HOW IT WORKS</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            From zero to coding in 30 seconds
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%+12px)] w-[calc(100%-24px)] h-px" style={{ background: 'linear-gradient(to right, var(--slate-700), transparent)' }}></div>
              )}
              
              <div className="text-5xl font-bold mb-4" style={{ color: 'var(--slate-800)' }}>{step.num}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--slate-400)' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
