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
  Shield,
  Activity
} from 'lucide-react';
import { TeamMetrics, ProjectRiskInfo } from '../types';
import { formatScoreCalculation } from '../utils/matchingEngine';
import { useCountUp } from '../hooks/useCountUp';

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

  // Smooth counting animation hooks for numeric values
  const animatedOverallScore = useCountUp(metrics.overallScore, 750);
  const animatedResilience = useCountUp(metrics.resilienceScore || 87, 750);
  const animatedSkillCoverage = useCountUp(metrics.skillCoverage, 650);
  const animatedComplementarity = useCountUp(metrics.complementarity, 650);
  const animatedProjectInterest = useCountUp(metrics.projectInterest, 650);
  const animatedAvailability = useCountUp(metrics.availability, 650);
  const animatedExperience = useCountUp(metrics.experience || 90, 650);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - animatedOverallScore / 100);

  const getScoreStatus = (score: number) => {
    if (score >= 90) return { label: 'Optimal Synergy', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' };
    if (score >= 80) return { label: 'Strong Fit', color: 'text-[#38BDF8]', border: 'border-[#38BDF8]/30', bg: 'bg-[#38BDF8]/10' };
    if (score >= 70) return { label: 'Degraded / Deficit', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' };
    return { label: 'Critical Gap', color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' };
  };

  const status = getScoreStatus(animatedOverallScore);

  return (
    <div className="p-6 bg-[#11182B] border border-[#263550] rounded-2xl shadow-xl space-y-5 transition-all duration-300">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#263550] gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#CBD5E1]">
            Explainable 5-Factor Team Match
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border border-[#263550] bg-[#0B1020] text-emerald-400 transition-colors duration-500">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Resilience: {animatedResilience}/100</span>
          </div>

          <div className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border transition-colors duration-500 ${status.bg} ${status.color} ${status.border}`}>
            {status.label}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Radial Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-[#1D2942]"
                strokeWidth="11"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                className={`transition-[stroke,stroke-dashoffset] duration-700 ease-out ${
                  animatedOverallScore >= 85 
                    ? 'stroke-[#38BDF8]' 
                    : animatedOverallScore >= 75 
                    ? 'stroke-amber-400' 
                    : 'stroke-rose-400'
                }`}
                strokeWidth="11"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Score Centered */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex items-baseline">
                <span className="text-4xl font-black font-mono text-[#F8FAFC] tracking-tight transition-transform duration-300">
                  {animatedOverallScore}
                </span>
                <span className="text-xl font-bold font-mono text-[#38BDF8]">%</span>
              </div>
              
              {scoreDelta !== 0 && (
                <span className={`text-[10px] font-mono font-bold mt-0.5 px-2 py-0.5 rounded-full transition-all duration-300 ${
                  scoreDelta > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {scoreDelta > 0 ? `+${scoreDelta}% restored` : `${scoreDelta}% lost`}
                </span>
              )}
            </div>
          </div>

          <button
            id="explain-score-btn"
            onClick={() => setShowExplanation(!showExplanation)}
            className="mt-2 px-3 py-1 rounded-xl text-xs font-semibold text-[#38BDF8] hover:text-[#F8FAFC] bg-[#17213A] hover:bg-[#1D2942] border border-[#263550] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{showExplanation ? 'Hide Formula' : 'Explain 5-Factor Math'}</span>
            {showExplanation ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* 5-Factor Formula Progress Bars */}
        <div className="md:col-span-7 space-y-2 text-xs">
          
          {/* Skill Coverage 40% */}
          <div className="p-2 bg-[#0B1020] border border-[#263550] rounded-xl">
            <div className="flex items-center justify-between mb-1 text-[#CBD5E1]">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#F8FAFC]">Skill Coverage</span>
                <span className="px-1.5 py-0.2 rounded bg-[#38BDF8]/20 text-[#38BDF8] text-[9px] font-bold">40% Weight</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[#38BDF8] font-bold">
                <span>{animatedSkillCoverage}%</span>
              </div>
            </div>
            <div className="w-full h-1 bg-[#17213A] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#38BDF8] transition-[width] duration-700 ease-out" 
                style={{ width: `${animatedSkillCoverage}%` }} 
              />
            </div>
          </div>

          {/* Complementarity 25% */}
          <div className="p-2 bg-[#0B1020] border border-[#263550] rounded-xl">
            <div className="flex items-center justify-between mb-1 text-[#CBD5E1]">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#F8FAFC]">Complementarity</span>
                <span className="px-1.5 py-0.2 rounded bg-[#8B5CF6]/20 text-[#8B5CF6] text-[9px] font-bold">25% Weight</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[#8B5CF6] font-bold">
                <span>{animatedComplementarity}%</span>
              </div>
            </div>
            <div className="w-full h-1 bg-[#17213A] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#8B5CF6] transition-[width] duration-700 ease-out" 
                style={{ width: `${animatedComplementarity}%` }} 
              />
            </div>
          </div>

          {/* Project Interest 15% */}
          <div className="p-2 bg-[#0B1020] border border-[#263550] rounded-xl">
            <div className="flex items-center justify-between mb-1 text-[#CBD5E1]">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#F8FAFC]">Project Interest</span>
                <span className="px-1.5 py-0.2 rounded bg-[#22D3EE]/20 text-[#22D3EE] text-[9px] font-bold">15% Weight</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[#22D3EE] font-bold">
                <span>{animatedProjectInterest}%</span>
              </div>
            </div>
            <div className="w-full h-1 bg-[#17213A] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#22D3EE] transition-[width] duration-700 ease-out" 
                style={{ width: `${animatedProjectInterest}%` }} 
              />
            </div>
          </div>

          {/* Availability 10% */}
          <div className="p-2 bg-[#0B1020] border border-[#263550] rounded-xl">
            <div className="flex items-center justify-between mb-1 text-[#CBD5E1]">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#F8FAFC]">Bandwidth & Availability</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">10% Weight</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-emerald-400 font-bold">
                <span>{animatedAvailability}%</span>
              </div>
            </div>
            <div className="w-full h-1 bg-[#17213A] rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 transition-[width] duration-700 ease-out" 
                style={{ width: `${animatedAvailability}%` }} 
              />
            </div>
          </div>

          {/* Experience 10% */}
          <div className="p-2 bg-[#0B1020] border border-[#263550] rounded-xl">
            <div className="flex items-center justify-between mb-1 text-[#CBD5E1]">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#F8FAFC]">Experience & Hackathons</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[9px] font-bold">10% Weight</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-amber-400 font-bold">
                <span>{animatedExperience}%</span>
              </div>
            </div>
            <div className="w-full h-1 bg-[#17213A] rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-400 transition-[width] duration-700 ease-out" 
                style={{ width: `${animatedExperience}%` }} 
              />
            </div>
          </div>

        </div>

      </div>

      {/* Expanded Math Calculation Breakdown */}
      {showExplanation && (
        <div className="p-4 bg-[#0B1020] border border-[#263550] rounded-xl space-y-2 text-xs animate-in fade-in duration-150">
          <span className="font-bold text-[#F8FAFC] block">Exact Mathematical Formula Output:</span>
          <div className="font-mono text-emerald-400 text-xs">
            ({animatedSkillCoverage} × 0.40) + ({animatedComplementarity} × 0.25) + ({animatedProjectInterest} × 0.15) + ({animatedAvailability} × 0.10) + ({animatedExperience} × 0.10) = <strong className="text-white text-sm">{animatedOverallScore}%</strong>
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            This deterministic 5-factor calculation ensures full explainability without opaque algorithmic black-boxes. Numbers increment smoothly during active squad recalculation.
          </p>
        </div>
      )}

    </div>
  );
};
