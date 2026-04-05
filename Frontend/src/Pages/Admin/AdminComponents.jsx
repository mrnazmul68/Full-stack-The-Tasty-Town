import React, { useEffect, useState } from "react";
import { FiTrendingUp } from "react-icons/fi";

export const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    if (start === end) return;

    let totalMiliseconds = duration;
    let incrementTime = (totalMiliseconds / end) > 10 ? (totalMiliseconds / end) : 10;
    
    let timer = setInterval(() => {
      start += Math.ceil(end / (duration / incrementTime));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export const StatCard = ({ label, value, icon: Icon, trend, colorClass }) => (
  <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/30 hover:bg-white/[0.08] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
    <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${colorClass} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`}></div>
    <div className="flex items-start justify-between">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-black/20 text-xl text-white shadow-inner transition-transform group-hover:scale-110`}>
        <Icon />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${trend.isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          <FiTrendingUp className={trend.isUp ? "" : "rotate-180"} />
          {trend.value}%
        </div>
      )}
    </div>
    <div className="mt-6">
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-white">
          <AnimatedCounter value={value} />
        </h3>
      </div>
    </div>
  </div>
);

export const SectionHeader = ({ title, subtitle, actions }) => (
  <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
  </div>
);

export const QuickAction = ({ label, icon: Icon, onClick, color }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 ${color}`}
  >
    <Icon className="text-lg" />
    {label}
  </button>
);

export const SimpleChart = ({ data, color = "#f97316" }) => {
  if (!data || data.length === 0) return null;
  
  const max = Math.max(...data) || 1;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (val / max) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="relative h-32 w-full pt-4">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M 0,100 L ${points} L 100,100 Z`}
          fill="url(#gradient)"
        />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="transition-all duration-1000"
        />
      </svg>
    </div>
  );
};
