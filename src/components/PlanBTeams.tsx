import React, { useState } from 'react';
import { ProjectDNA, StudentProfile, PlanBTeamOption } from '../types';
import { motion } from 'motion/react';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Trophy,
  Clock,
  Flame,
  Star,
  Check
} from 'lucide-react';
import { generatePlanBTeams, formatScoreCalculation } from '../utils/matchingEngine';

interface PlanBTeamsProps {
  projectDNA: ProjectDNA;
  activeSquad: StudentProfile[];
  onAdoptTeam: (newTeam: StudentProfile[]) => void;
  onSelectStudent?: (student: StudentProfile) => void;
}

export const PlanBTeams: React.FC<PlanBTeamsProps> = ({
  projectDNA,
  activeSquad,
  onAdoptTeam,
  onSelectStudent,
}) => {
  const [teamOptions] = useState<PlanBTeamOption[]>(() => generatePlanBTeams(projectDNA));
  const [selectedOptionId, setSelectedOptionId] = useState<string>('squad-champion');
  const [adoptedSuccessId, setAdoptedSuccessId] = useState<string | null>(null);

  const selectedOption = teamOptions.find(opt => opt.id === selectedOptionId) || teamOptions[0];

  const handleAdopt = (option: PlanBTeamOption) => {
    onAdoptTeam(option.team);
    setAdoptedSuccessId(option.id);
    setTimeout(() => {
      setAdoptedSuccessId(null);
    }, 2500);
  };

  // Check if an option matches the currently active squad
  const isCurrentlyActive = (team: StudentProfile[]) => {
    if (team.length !== activeSquad.length) return false;
    const activeIds = new Set(activeSquad.map(s => s.id));
    return team.every(s => activeIds.has(s.id));
  };

  return (
    <div id="plan-b-teams-container" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Users className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-semibold text-white tracking-tight">Plan B Team Formations</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
              3 Strategy Variations
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Compare alternative candidate combinations optimized for different judging priorities (MLOps scalability, rapid UX pitch, or research depth).
          </p>
        </div>

        <div className="text-xs text-neutral-400 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Active Squad: <strong className="text-white">{activeSquad.length} Engineers</strong></span>
        </div>
      </div>

      {/* 3 Alternative Team Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {teamOptions.map((opt) => {
          const isActive = isCurrentlyActive(opt.team);
          const isSelected = selectedOptionId === opt.id;
          const totalHours = opt.team.reduce((acc, m) => acc + m.availability.hoursPerWeek, 0);
          const totalWins = opt.team.reduce((acc, m) => acc + m.experience.hackathonsWon, 0);

          return (
            <motion.div
              key={opt.id}
              id={`plan-b-card-${opt.id}`}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedOptionId(opt.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-cyan-500/[0.08] to-white/[0.02] border-cyan-500/40 shadow-xl shadow-cyan-500/5 ring-1 ring-cyan-500/30'
                  : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-white/20'
              }`}
            >
              {/* Active Badge if currently deployed */}
              {isActive && (
                <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-black font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md shadow-emerald-500/20">
                  <Check className="w-3 h-3 stroke-[3]" /> Currently Active
                </div>
              )}

              <div className="space-y-4">
                {/* Header & Match Score */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-cyan-400 block mb-1">
                      {opt.badge}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {opt.name.split(':')[0]}
                    </h4>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-black text-white tracking-tight">
                      {opt.metrics.overallScore}%
                    </div>
                    <div className="text-[10px] text-neutral-400 uppercase font-mono">Match Score</div>
                  </div>
                </div>

                {/* Focus Theme Tag */}
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-neutral-300">
                  <span className="text-neutral-400 text-[10px] uppercase block font-semibold mb-0.5">Focus Strategy</span>
                  <p className="line-clamp-2 text-[11px]">{opt.focusTheme}</p>
                </div>

                {/* Team Roster Avatars */}
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase">Roster Composition</div>
                  <div className="grid grid-cols-2 gap-2">
                    {opt.team.map((member) => (
                      <div
                        key={member.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectStudent) onSelectStudent(member);
                        }}
                        className="flex items-center gap-2 p-1.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] transition-colors"
                      >
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-7 h-7 rounded-full object-cover border border-white/10 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-[11px] font-medium text-white truncate">{member.name.split(' ')[0]}</div>
                          <div className="text-[10px] text-neutral-400 truncate">{member.role.split('&')[0]}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="p-2 rounded-lg bg-black/30 border border-white/5 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <div>
                      <div className="font-bold text-white">{totalHours} hrs/wk</div>
                      <div className="text-[10px] text-neutral-500">Bandwidth</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-black/30 border border-white/5 flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <div>
                      <div className="font-bold text-white">{totalWins} Wins</div>
                      <div className="text-[10px] text-neutral-500">Pedigree</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adoption CTA Button */}
              <div className="pt-4 mt-4 border-t border-white/10">
                <button
                  id={`btn-adopt-squad-${opt.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdopt(opt);
                  }}
                  disabled={isActive}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-white/[0.05] text-neutral-400 cursor-default border border-white/5'
                      : adoptedSuccessId === opt.id
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                  }`}
                >
                  {isActive ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Active Formation</span>
                    </>
                  ) : adoptedSuccessId === opt.id ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Adopted as Active Squad!</span>
                    </>
                  ) : (
                    <>
                      <span>Adopt This Formation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Deep-Dive Comparison Inspector for Selected Option */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Detailed Tactical Breakdown</span>
            <h4 className="text-base font-bold text-white">
              {selectedOption.name}
            </h4>
            <p className="text-xs text-neutral-300 max-w-3xl leading-relaxed">
              {selectedOption.recommendedReason}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-neutral-300">
            {formatScoreCalculation(selectedOption.metrics).formulaDisplay}
          </div>
        </div>

        {/* 4 Factor Meters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase font-semibold">Skill Coverage (50%)</div>
            <div className="text-lg font-bold text-cyan-400">{selectedOption.metrics.skillCoverage}%</div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${selectedOption.metrics.skillCoverage}%` }} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase font-semibold">Complementarity (20%)</div>
            <div className="text-lg font-bold text-blue-400">{selectedOption.metrics.complementarity}%</div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full" style={{ width: `${selectedOption.metrics.complementarity}%` }} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase font-semibold">Project Interest (15%)</div>
            <div className="text-lg font-bold text-purple-400">{selectedOption.metrics.projectInterest}%</div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-400 h-full rounded-full" style={{ width: `${selectedOption.metrics.projectInterest}%` }} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase font-semibold">Availability (15%)</div>
            <div className="text-lg font-bold text-emerald-400">{selectedOption.metrics.availability}%</div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${selectedOption.metrics.availability}%` }} />
            </div>
          </div>
        </div>

        {/* Strengths & Trade-offs 2-Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/20 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Competitive Advantages</span>
            </div>
            <ul className="space-y-2">
              {selectedOption.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-neutral-300 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/20 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Architectural Trade-offs & Limitations</span>
            </div>
            <ul className="space-y-2">
              {selectedOption.tradeoffs.map((tro, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-neutral-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                  <span>{tro}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
