import React from 'react';
import { ProjectDNA, StudentProfile, TeamMetrics } from '../types';
import {
  FileText,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ShieldCheck,
  Trophy,
  Clock,
  Sparkles,
  Users,
  Cpu
} from 'lucide-react';
import {
  calculateSkillCoverage,
  calculateComplementarity,
  calculateProjectInterest,
  calculateAvailability,
  formatScoreCalculation,
  generateMemberSelectionReason,
  calculateProjectRisk,
  generateProjectTasks
} from '../utils/matchingEngine';

interface FinalTeamReportProps {
  projectDNA: ProjectDNA;
  team: StudentProfile[];
  metrics: TeamMetrics;
  onClose?: () => void;
}

export const FinalTeamReport: React.FC<FinalTeamReportProps> = ({
  projectDNA,
  team,
  metrics,
  onClose,
}) => {
  const { breakdown, gaps } = calculateSkillCoverage(team, projectDNA);
  const scoreMath = formatScoreCalculation(metrics);
  const riskInfo = calculateProjectRisk(team, projectDNA, breakdown);
  const tasks = generateProjectTasks(projectDNA, team);

  const totalBandwidth = team.reduce((acc, m) => acc + m.availability.hoursPerWeek, 0);
  const totalWins = team.reduce((acc, m) => acc + m.experience.hackathonsWon, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="final-team-report-container" className="space-y-6 max-w-5xl mx-auto print:p-0 print:m-0">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl print:hidden">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <FileText className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-white">Executive Team Formation Dossier</h3>
            <p className="text-[11px] text-neutral-400">Exportable, audit-ready summary for hackathon judges and startup accelerators.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-print-report"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF Export</span>
          </button>
        </div>
      </div>

      {/* Main Dossier Sheet */}
      <div className="p-8 rounded-3xl bg-neutral-950 border border-white/10 shadow-2xl space-y-8 print:border-0 print:bg-white print:text-black">
        {/* Document Header */}
        <div className="border-b border-white/10 pb-6 space-y-4 print:border-neutral-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                <span>TEAMFORGE AI FORMATION REPORT</span>
                <span>•</span>
                <span>ID: {projectDNA.id}</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight print:text-black">
                {projectDNA.title}
              </h1>
              <p className="text-xs text-neutral-400 print:text-neutral-600 mt-1">
                Category: <strong className="text-neutral-200 print:text-neutral-800">{projectDNA.category}</strong> • Complexity: <strong className="text-neutral-200 print:text-neutral-800">{projectDNA.complexity}</strong> • Squad Size: <strong className="text-neutral-200 print:text-neutral-800">{team.length} Engineers</strong>
              </p>
            </div>

            {/* Composite Match Stamp */}
            <div className="p-4 rounded-2xl bg-cyan-500/[0.08] border border-cyan-500/30 text-center shrink-0">
              <div className="text-3xl font-black text-cyan-300 tracking-tight print:text-cyan-700">
                {metrics.overallScore}%
              </div>
              <div className="text-[10px] text-neutral-400 uppercase font-mono font-semibold">
                Team Match Score
              </div>
            </div>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed print:text-neutral-700">
            {projectDNA.summary}
          </p>
        </div>

        {/* 4-Factor Explainable Calculation */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">
            1. Transparent Formula Breakdown
          </h3>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 print:bg-neutral-50 print:border-neutral-200">
            <div className="text-xs font-mono text-cyan-300 print:text-cyan-800 font-medium">
              {scoreMath.formulaDisplay}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {scoreMath.terms.map(t => (
                <div key={t.label} className="p-2.5 rounded-xl bg-black/40 border border-white/5 print:bg-white print:border-neutral-200">
                  <div className="text-[10px] text-neutral-400">{t.label} ({t.weight})</div>
                  <div className="text-base font-bold text-white print:text-black">{t.score}%</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">+{t.contribution}% added</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Squad Roster */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">
              2. Selected Team Squad Roster ({team.length} Members)
            </h3>
            <div className="text-xs text-neutral-400">
              {totalBandwidth} hrs/wk total bandwidth • {totalWins} hackathon championships
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.map((member) => {
              const reason = generateMemberSelectionReason(member, projectDNA, team);

              return (
                <div
                  key={member.id}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 print:bg-white print:border-neutral-200"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-11 h-11 rounded-xl object-cover border border-cyan-500/30"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white print:text-black truncate">{member.name}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-mono font-semibold">
                          {reason.individualMatchScore}% Match
                        </span>
                      </div>
                      <div className="text-xs text-neutral-400 print:text-neutral-600 truncate">{member.role}</div>
                      <div className="text-[11px] text-neutral-400 print:text-neutral-500 mt-0.5">
                        {member.university} • {member.year} • {member.availability.hoursPerWeek}h/wk
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-cyan-200 print:text-cyan-900 leading-relaxed">
                    {reason.primaryContribution}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {member.primarySkills.map(ps => (
                      <span key={ps} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-neutral-300 print:text-neutral-700 font-mono">
                        {ps}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill Coverage Matrix Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">
            3. Project Skill Coverage Analysis
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {breakdown.map((item) => (
              <div key={item.skill} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center space-y-1">
                <div className="text-[11px] font-bold text-white print:text-black truncate">{item.skill}</div>
                <div className={`text-base font-black ${item.effectiveCoverage >= 85 ? 'text-emerald-400' : item.effectiveCoverage >= 65 ? 'text-cyan-400' : 'text-amber-400'}`}>
                  {item.effectiveCoverage}%
                </div>
                <div className="text-[9px] text-neutral-400 uppercase">Weight: {item.importance}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Single Points of Failure & Risk Statement */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">
            4. Resilience & Key-Person Dependency
          </h3>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs text-neutral-300 print:text-neutral-700">
            <div className="font-semibold text-white print:text-black flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Overall Risk Level: {riskInfo.level} Risk ({riskInfo.headline})</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {riskInfo.recommendation}
            </p>
          </div>
        </div>

        {/* Footer & Disclaimer */}
        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-neutral-500 font-mono">
          <div>Generated by ProjectMatch Deterministic Matching Engine • v2.4</div>
          <div className="text-neutral-400">Synthetic demo profiles — prototype data</div>
        </div>
      </div>
    </div>
  );
};
