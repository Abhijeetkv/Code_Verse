;const StatsSection = () => {
  const stats = [
    { value: "20+", label: "Coding Problems" },
    { value: "5+", label: "Languages" },
    { value: "HD", label: "Video Quality" },
    { value: "∞", label: "Free Sessions" }
  ];

  return (
    <section className="py-16" style={{ borderTop: '1px solid var(--slate-800)', borderBottom: '1px solid var(--slate-800)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="stat-value text-gradient">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
