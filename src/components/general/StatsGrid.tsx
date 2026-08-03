import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface StatItem
{
  value: string;
  label: string;
  symbol?: string;
}

const STATS: StatItem[] = [
  { value: "12k+", label: "Teams", symbol: "k+" },
  { value: "98%", label: "Satisfaction", symbol: "%" },
  { value: "4.2", label: "Tasks completed", symbol: "M" },
  { value: "99.9", label: "Uptime SLA", symbol: "%" },
];

const AnimatedStat = ({ value, symbol }: { value: string; symbol?: string }) =>
{
  const ref = useRef<HTMLSpanElement>(null);

  // 1. Parse out raw float/integer value (e.g., "12k+" -> 12, "99.9%" -> 99.9)
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;

  // 2. Check if the value contains decimal places
  const isFloat = value.includes(".");
  const decimals = isFloat ? value.split(".")[1]?.replace(/[^0-9]/g, "").length || 1 : 0;

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });

  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() =>
  {
    if (isInView)
    {
      motionValue.set(numericValue);
    }
  }, [isInView, motionValue, numericValue]);

  useEffect(() =>
  {
    return springValue.on("change", (latest) =>
    {
      if (ref.current)
      {
        ref.current.textContent = latest.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
      }
    });
  }, [springValue, decimals]);

  return (
    <div className="el-flx">
      <span ref={ref}>0</span>
      {symbol && <span>{symbol}</span>}
    </div>
  );
};

export const StatsGrid = () =>
{
  return (
    <div className="stats-grid el-grd">
      {STATS.map((stat, idx) => (
        <div key={`p${String(idx)}`} className="stat-item el-flx">
          <AnimatedStat value={stat.value} symbol={stat.symbol} />
          <span className="stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};