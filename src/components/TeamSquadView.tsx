import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Flame, 
  Trophy, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Layers, 
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  UserMinus,
  Shuffle,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { StudentProfile, MemberSelectionReason, ProjectDNA } from '../types';
import { generateTeamSynergyOverview } from '../utils/matchingEngine';

interface TeamSquadViewProps {
  team: StudentProfile[];
  projectDNA: ProjectDNA;
  memberReasons: Record<string, MemberSelectionReason>;
  onInspectStudent: (student: StudentProfile) => void;
  onRemoveMember: (student: StudentProfile) => void;
  onSwapMember?: (student: StudentProfile) => void;
}

export const TeamSquadView: React.FC<TeamSquadViewProps> = ({
  team,
  projectDNA,
  memberReasons,
  onInspectStudent,
  onRemoveMember,
  onSwapMember,
}) => {
  const [showTeamRationale, setShowTeamRationale] = useState(true);
  const synergy = generateTeamSynergyOverview(team, projectDNA);

  return (
    <div className="space-y-5">
      
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/15 border border-blue-500/30 backdrop-blur-sm flex items-center justify-center">
            <Users className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <h3 className="text-lg font-extrabold text-white tracking-tight">
            Recommended Complementary Squad ({team.length} Members)
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10 font-mono">
            Synthetic demo profiles — prototype data
          </span>
        </div>

        <button
          id="toggle-team-rationale-btn"
          onClick={() => setShowTeamRationale(!showTeamRationale)}
          className="px-3 py-1.5 rounded-xl text-xs font-bold text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 backdrop-blur-sm flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>Why this team?</span>
          {showTeamRationale ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Holistic Team Synergy Rationale Banner */}
      {showTeamRationale && (
        <div className="rounded-3xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/30 border border-cyan-500/30 backdrop-blur-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/40 backdrop-blur-sm flex items-center justify-center">
                <Zap className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white tracking-tight">
                  {synergy.headline}
                </h4>
                <p className="text-xs text-slate-300">
                  {synergy.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {synergy.pillars.map((pillar, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-sm space-y-1">
                <span className="font-bold text-cyan-300 block text-[11px] uppercase tracking-wider">
                  {pillar?.title}
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {pillar?.description}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300 font-mono">
            {synergy.stats.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-slate-400">{s.label}:</span>
                <span className="font-bold text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Squad Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {team.map((member) => {
          const reason = memberReasons[member.id];
          const matchScore = reason?.individualMatchScore || 90;

          return (
            <div
              key={member.id}
              className="rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/15 hover:border-blue-500/40 p-5 sm:p-6 shadow-xl shadow-black/40 transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Top Profile Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-13 h-13 rounded-2xl object-cover border border-white/20 shadow-md group-hover:border-cyan-400/50 transition-colors"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-white tracking-tight">
                          {member.name}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 backdrop-blur-sm">
                          {matchScore}% Match
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-blue-300 mt-0.5">
                        {member.role}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {member.university} • {member.year}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Experience & Availability Badges */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-[11px]">
                  <div className="p-2 rounded-xl bg-black/30 border border-white/10 backdrop-blur-sm flex items-center gap-2 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{member.availability.hoursPerWeek} hrs/wk ({member.availability.timezone.split(' ')[0]})</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/30 border border-white/10 backdrop-blur-sm flex items-center gap-2 text-slate-300">
                    <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{member.experience.hackathonsWon} Hackathons Won</span>
                  </div>
                </div>

                {/* Core Skills & Proficiency */}
                <div className="mb-4">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Key Skill Ratings
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.slice(0, 4).map((s) => (
                      <span
                        key={s.name}
                        className={`text-xs px-2.5 py-1 rounded-xl font-mono flex items-center gap-1.5 border backdrop-blur-sm ${
                          s.level >= 90
                            ? 'bg-blue-500/15 text-blue-200 border-blue-500/30 font-semibold'
                            : 'bg-white/[0.04] text-slate-300 border-white/10'
                        }`}
                      >
                        <span>{s.name}</span>
                        <span className="text-cyan-300 font-extrabold">{s.level}%</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Why Selected Rationale Box */}
                {reason && (
                  <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/25 text-xs mb-4 backdrop-blur-sm">
                    <div className="flex items-center gap-1.5 font-bold text-blue-200 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Why Selected by AI</span>
                    </div>
                    <p className="text-slate-300 leading-snug">
                      {reason.primaryContribution}
                    </p>
                    {reason.synergyHighlights.length > 0 && (
                      <ul className="mt-2 space-y-0.5 text-[11px] text-slate-400">
                        {reason.synergyHighlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-cyan-400" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Actions: Inspect Profile & Stress Test Remove */}
              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                <button
                  id={`inspect-student-btn-${member.id}`}
                  onClick={() => onInspectStudent(member)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 backdrop-blur-sm flex items-center gap-1 transition-colors"
                >
                  <span>View Profile</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <div className="flex items-center gap-2">
                  {onSwapMember && (
                    <button
                      id={`swap-member-btn-${member.id}`}
                      onClick={() => onSwapMember(member)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 backdrop-blur-sm flex items-center gap-1 transition-all"
                      title="Swap this member with another candidate"
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      <span>Swap</span>
                    </button>
                  )}

                  <button
                    id={`stress-test-remove-btn-${member.id}`}
                    onClick={() => onRemoveMember(member)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 backdrop-blur-sm flex items-center gap-1.5 transition-all active:scale-95"
                    title="Simulate dropout and evaluate replacement"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>Simulate Dropout</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

