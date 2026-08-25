import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Cpu, 
  Info,
  Calculator,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ShieldAlert,
  Shield
} from 'lucide-react';
import { TeamMetrics, ProjectRiskInfo } from '../types';
import { formatScoreCalculation } from '../utils/matchingEngine';

interface TeamScoreGaugeProps {
  metrics: TeamMetrics;
  isStressTested?: boolean;
  scoreDelta?: number;
  riskInfo?: ProjectRiskInfo;
}

export const TeamScoreGauge: React.FC<TeamScoreGaugeProps> = ({
  metrics,
  isStressTested = false,
  scoreDelta = 0,
  riskInfo,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const calculation = formatScoreCalculation(metrics);

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - metrics.overallScore / 100);

  const getScoreStatus = (score: number) => {
    if (score >= 90) return { label: 'Optimal Synergy', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' };
    if (score >= 80) return { label: 'Strong Fit', color: 'text-cyan-300', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' };
    if (score >= 70) return { label: 'Degraded / Deficit', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' };
    return { label: 'Critical Gap', color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10' };
  };

  const getRiskBadge = (level?: 'Low' | 'Medium' | 'High') => {
    if (level === 'High') {
      return {
        icon: <ShieldAlert className="w-3.5 h-3.5 text-red-400" />,
        text: 'High Risk',
        cls: 'bg-red-500/15 text-red-300 border-red-500/30',
      };
    }
    if (level === 'Medium') {
      return {
        icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
        text: 'Medium Risk',
        cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      };
    }
    return {
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
      text: 'Low Risk',
      cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    };
  };

  const status = getScoreStatus(metrics.overallScore);
  const riskBadge = getRiskBadge(riskInfo?.level);

  return (
    <div className="rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/15 p-6 sm:p-7 shadow-2xl shadow-black/50 relative overflow-hidden flex flex-col justify-between">
      
      {/* Background glow */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none -z-10 ${
        metrics.overallScore >= 85 ? 'bg-cyan-500/10' : 'bg-amber-500/10'
      }`} />

      <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-white/10 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-500/15 border border-blue-500/30 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Composite Team Match Score
            </span>
          </div>

          <div className="flex items-center gap-2">
            {riskInfo && (
              <div className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border backdrop-blur-sm ${riskBadge.cls}`}>
                {riskBadge.icon}
                <span>{riskBadge.text}</span>
              </div>
            )}

            <div className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border backdrop-blur-sm ${status.bg} ${status.color} ${status.border}`}>
              {status.label}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Animated Radial Gauge */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                {/* Track */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-white/10"
                  strokeWidth="11"
                  fill="transparent"
                />
                {/* Progress */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className={`transition-all duration-700 ease-out ${
                    metrics.overallScore >= 85 ? 'stroke-cyan-400' : 'stroke-amber-400'
                  }`}
                  strokeWidth="11"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Score in middle */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="flex items-baseline">
                  <span className="text-5xl font-black font-mono text-white tracking-tight">
                    {metrics.overallScore}
                  </span>
                  <span className="text-2xl font-bold font-mono text-cyan-300">%</span>
                </div>
                
                {scoreDelta !== 0 && (
                  <span className={`text-xs font-mono font-bold mt-1 px-2 py-0.5 rounded-full backdrop-blur-sm ${
                    scoreDelta > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {scoreDelta > 0 ? `+${scoreDelta}% restored` : `${scoreDelta}% lost`}
                  </span>
                )}
              </div>
            </div>

            {/* Explain Score Button */}
            <button
              id="explain-score-btn"
              onClick={() => setShowExplanation(!showExplanation)}
              className="mt-3 px-3 py-1 rounded-xl text-xs font-bold text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 backdrop-blur-sm flex items-center gap-1.5 transition-all"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{showExplanation ? 'Hide Calculation' : 'Explain Score'}</span>
              {showExplanation ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Explainable 4-Factor Breakdown */}
          <div className="md:col-span-7 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 pb-1">
              <span>Formula Components</span>
              <span className="text-[11px] font-mono text-cyan-300">Weighted Multi-Factor Composite</span>
            </div>

            {/* Skill Coverage 50% */}
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white">Skill Coverage</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30">50% Weight</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">× 0.50 =</span>
                  <span className="font-mono font-extrabold text-cyan-300 text-sm">
                    {metrics.skillCoverage}%
                  </span>
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${metrics.skillCoverage}%` }}
                />
              </div>
            </div>

            {/* Complementarity 20% */}
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white">Complementarity</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold border border-blue-500/30">20% Weight</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">× 0.20 =</span>
                  <span className="font-mono font-extrabold text-blue-300 text-sm">
                    {metrics.complementarity}%
                  </span>
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-400 transition-all duration-500"
                  style={{ width: `${metrics.complementarity}%` }}
                />
              </div>
            </div>

            {/* Project Interest 15% */}
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white">Project Interest</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">15% Weight</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">× 0.15 =</span>
                  <span className="font-mono font-extrabold text-purple-300 text-sm">
                    {metrics.projectInterest}%
                  </span>
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-400 transition-all duration-500"
                  style={{ width: `${metrics.projectInterest}%` }}
                />
              </div>
            </div>

            {/* Availability 15% */}
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white">Availability Commitment</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">15% Weight</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">× 0.15 =</span>
                  <span className="font-mono font-extrabold text-emerald-300 text-sm">
                    {metrics.availability}%
                  </span>
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${metrics.availability}%` }}
                />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Transparent Calculation Breakdown Expanded Card */}
      {showExplanation && (
        <div className="mt-5 pt-4 border-t border-white/10 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-300" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Exact Mathematical Proof & Calculation
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Verified Algorithm Output
            </span>
          </div>

          {/* Formula Callout */}
          <div className="p-3 rounded-2xl bg-black/40 border border-cyan-500/30 text-xs font-mono backdrop-blur-sm space-y-1">
            <div className="text-slate-300 font-bold">
              {calculation.formulaDisplay}
            </div>
            <div className="text-cyan-300 font-semibold text-[11px]">
              = {calculation.terms[0].contribution} (Coverage) + {calculation.terms[1].contribution} (Complementarity) + {calculation.terms[2].contribution} (Interest) + {calculation.terms[3].contribution} (Availability)
            </div>
            <div className="text-emerald-400 font-extrabold text-[11px]">
              = {calculation.rawSum}% → Rounded: {calculation.roundedScore}%
            </div>
          </div>

          {/* Term grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            {calculation.terms.map((t) => (
              <div key={t.label} className={`p-2 rounded-xl border backdrop-blur-sm ${t.bg} ${t.border}`}>
                <span className="text-slate-300 block font-medium truncate">{t.label} ({t.weight})</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono text-slate-400">{t.score}% × {t.factor}</span>
                  <span className={`font-mono font-bold ${t.color}`}>+{t.contribution}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

