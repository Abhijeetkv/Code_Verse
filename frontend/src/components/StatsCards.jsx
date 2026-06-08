import { UsersIcon, CheckCircle2Icon } from "lucide-react";

function StatsCards({ activeSessionsCount, solvedCount = 0 }) {
  const cards = [
    {
      icon: UsersIcon,
      value: activeSessionsCount,
      label: "Active Sessions",
      iconBg: "rgba(56, 189, 248, 0.12)",
      iconColor: "var(--sky)",
      badge: { text: "LIVE", color: "var(--emerald)", bg: "rgba(52, 211, 153, 0.1)", border: "rgba(52, 211, 153, 0.2)" },
    },
    {
      icon: CheckCircle2Icon,
      value: solvedCount,
      label: "Problems Solved",
      iconBg: "rgba(52, 211, 153, 0.12)",
      iconColor: "var(--emerald)",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 h-full">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="rounded-xl p-4 transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: "var(--slate-900)",
              border: "1px solid var(--slate-800)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className="p-2 rounded-lg"
                style={{ background: card.iconBg }}
              >
                <Icon className="w-4 h-4" style={{ color: card.iconColor }} />
              </div>
              {card.badge && (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: card.badge.bg,
                    color: card.badge.color,
                    border: `1px solid ${card.badge.border}`,
                  }}
                >
                  ● {card.badge.text}
                </span>
              )}
            </div>
            <div
              className="text-2xl font-black"
              style={{ color: "var(--slate-100)" }}
            >
              {card.value}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--slate-500)" }}>
              {card.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;