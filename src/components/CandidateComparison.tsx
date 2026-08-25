import React, { useState } from 'react';
import { ProjectDNA, StudentProfile } from '../types';
import { motion } from 'motion/react';
import {
  Scale,
  Sparkles,
  CheckCircle2,
  Trophy,
  Clock,
  ArrowRight,
  UserCheck,
  Zap,
  Shield,
  HelpCircle,
  X
} from 'lucide-react';
import { MOCK_STUDENTS } from '../data/mockStudents';
import { compareCandidates } from '../utils/matchingEngine';

interface CandidateComparisonProps {
  projectDNA: ProjectDNA;
  activeSquad: StudentProfile[];
  onSwapCandidate?: (newMember: StudentProfile, oldMemberId?: string) => void;
  onSelectStudent?: (student: StudentProfile) => void;
}

export const CandidateComparison: React.FC<CandidateComparisonProps> = ({
  projectDNA,
  activeSquad,
  onSwapCandidate,
  onSelectStudent,
}) => {
  const [candidateAId, setCandidateAId] = useState<string>('aarav-sharma');
  const [candidateBId, setCandidateBId] = useState<string>('elena-rostova');
  const [candidateCId, setCandidateCId] = useState<string | 'none'>('kai-nakamura');

  const candidateA = MOCK_STUDENTS.find(s => s.id === candidateAId) || MOCK_STUDENTS[0];
  const candidateB = MOCK_STUDENTS.find(s => s.id === candidateBId) || MOCK_STUDENTS[1];
  const candidateC = candidateCId !== 'none' ? MOCK_STUDENTS.find(s => s.id === candidateCId) : undefined;

  const comparisonData = compareCandidates(candidateA, candidateB, candidateC, projectDNA, activeSquad);

  const isMemberOfActiveSquad = (id: string) => activeSquad.some(m => m.id === id);

  return (
    <div id="candidate-comparison-container" className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Scale className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-semibold text-white tracking-tight">Candidate Comparison Studio</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
              Multi-Vector Head-to-Head
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Compare 2 or 3 candidates from the 22-student pool to evaluate skill depth, bandwidth trade-offs, and project suitability.
          </p>
        </div>

        {/* Candidate Pickers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Candidate A Picker */}
          <div className="space-y-0.5">
            <span className="text-[10px] text-cyan-400 uppercase font-semibold block">Candidate A</span>
            <select
              value={candidateAId}
              onChange={e => setCandidateAId(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-cyan-500/40 text-xs text-white focus:outline-none"
            >
              {MOCK_STUDENTS.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.role.split('&')[0]})</option>
              ))}
            </select>
          </div>

          {/* Candidate B Picker */}
          <div className="space-y-0.5">
            <span className="text-[10px] text-purple-400 uppercase font-semibold block">Candidate B</span>
            <select
              value={candidateBId}
              onChange={e => setCandidateBId(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-purple-500/40 text-xs text-white focus:outline-none"
            >
              {MOCK_STUDENTS.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.role.split('&')[0]})</option>
              ))}
            </select>
          </div>

          {/* Candidate C Picker (Optional) */}
          <div className="space-y-0.5">
            <span className="text-[10px] text-amber-400 uppercase font-semibold block">Candidate C</span>
            <select
              value={candidateCId}
              onChange={e => setCandidateCId(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-amber-500/40 text-xs text-white focus:outline-none"
            >
              <option value="none">None (2-Way Compare)</option>
              {MOCK_STUDENTS.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.role.split('&')[0]})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* AI Comparative Verdict Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-transparent border border-cyan-500/20 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
                AI Optimization Verdict
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                Project Fit Verified
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">
              {comparisonData.verdict.headline}
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-3xl">
              {comparisonData.verdict.rationale}
            </p>
          </div>
        </div>
      </div>

      {/* Candidate Profile Cards Grid */}
      <div className={`grid grid-cols-1 ${candidateC ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-5`}>
        {/* Candidate A Card */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-cyan-500/30 backdrop-blur-xl space-y-4 relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={candidateA.avatar}
                alt={candidateA.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-cyan-500/40"
              />
              <div className="min-w-0">
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase font-mono">
                  Candidate A
                </span>
                <h4 className="text-sm font-bold text-white truncate mt-0.5">{candidateA.name}</h4>
                <div className="text-xs text-neutral-400 truncate">{candidateA.role}</div>
              </div>
            </div>

            {isMemberOfActiveSquad(candidateA.id) && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                Active Member
              </span>
            )}
          </div>

          <div className="text-xs text-neutral-300 bg-white/[0.03] p-3 rounded-xl border border-white/5 space-y-1">
            <div className="text-[11px] text-neutral-400">{candidateA.university} • {candidateA.year}</div>
            <p className="line-clamp-2 text-[11px] text-neutral-300">{candidateA.bio}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-black/30 border border-white/5 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <div>
                <div className="font-bold text-white">{candidateA.availability.hoursPerWeek} hrs/wk</div>
                <div className="text-[10px] text-neutral-500">{candidateA.availability.timezone}</div>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-black/30 border border-white/5 flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <div>
                <div className="font-bold text-white">{candidateA.experience.hackathonsWon} Hackathons</div>
                <div className="text-[10px] text-neutral-500">{candidateA.experience.years} yrs exp</div>
              </div>
            </div>
          </div>

          {/* Primary Skills */}
          <div className="space-y-1.5">
            <div className="text-[10px] text-neutral-400 uppercase font-semibold">Primary Specializations</div>
            <div className="flex flex-wrap gap-1.5">
              {candidateA.skills.slice(0, 4).map(s => (
                <span key={s.name} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.03] text-neutral-200 border border-white/10 font-mono">
                  {s.name} <strong className="text-cyan-300">{s.level}%</strong>
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-white/10">
            {onSelectStudent && (
              <button
                onClick={() => onSelectStudent(candidateA)}
                className="flex-1 py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white transition-all text-center"
              >
                Inspect Profile
              </button>
            )}
            {!isMemberOfActiveSquad(candidateA.id) && onSwapCandidate && (
              <button
                onClick={() => onSwapCandidate(candidateA)}
                className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all text-center"
              >
                Swap to Team
              </button>
            )}
          </div>
        </div>

        {/* Candidate B Card */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-purple-500/30 backdrop-blur-xl space-y-4 relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={candidateB.avatar}
                alt={candidateB.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-purple-500/40"
              />
              <div className="min-w-0">
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold uppercase font-mono">
                  Candidate B
                </span>
                <h4 className="text-sm font-bold text-white truncate mt-0.5">{candidateB.name}</h4>
                <div className="text-xs text-neutral-400 truncate">{candidateB.role}</div>
              </div>
            </div>

            {isMemberOfActiveSquad(candidateB.id) && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                Active Member
              </span>
            )}
          </div>

          <div className="text-xs text-neutral-300 bg-white/[0.03] p-3 rounded-xl border border-white/5 space-y-1">
            <div className="text-[11px] text-neutral-400">{candidateB.university} • {candidateB.year}</div>
            <p className="line-clamp-2 text-[11px] text-neutral-300">{candidateB.bio}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-black/30 border border-white/5 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <div>
                <div className="font-bold text-white">{candidateB.availability.hoursPerWeek} hrs/wk</div>
                <div className="text-[10px] text-neutral-500">{candidateB.availability.timezone}</div>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-black/30 border border-white/5 flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <div>
                <div className="font-bold text-white">{candidateB.experience.hackathonsWon} Hackathons</div>
                <div className="text-[10px] text-neutral-500">{candidateB.experience.years} yrs exp</div>
              </div>
            </div>
          </div>

          {/* Primary Skills */}
          <div className="space-y-1.5">
            <div className="text-[10px] text-neutral-400 uppercase font-semibold">Primary Specializations</div>
            <div className="flex flex-wrap gap-1.5">
              {candidateB.skills.slice(0, 4).map(s => (
                <span key={s.name} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.03] text-neutral-200 border border-white/10 font-mono">
                  {s.name} <strong className="text-purple-300">{s.level}%</strong>
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-white/10">
            {onSelectStudent && (
              <button
                onClick={() => onSelectStudent(candidateB)}
                className="flex-1 py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white transition-all text-center"
              >
                Inspect Profile
              </button>
            )}
            {!isMemberOfActiveSquad(candidateB.id) && onSwapCandidate && (
              <button
                onClick={() => onSwapCandidate(candidateB)}
                className="flex-1 py-2 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all text-center"
              >
                Swap to Team
              </button>
            )}
          </div>
        </div>

        {/* Candidate C Card (If Selected) */}
        {candidateC && (
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-amber-500/30 backdrop-blur-xl space-y-4 relative">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={candidateC.avatar}
                  alt={candidateC.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-500/40"
                />
                <div className="min-w-0">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase font-mono">
                    Candidate C
                  </span>
                  <h4 className="text-sm font-bold text-white truncate mt-0.5">{candidateC.name}</h4>
                  <div className="text-xs text-neutral-400 truncate">{candidateC.role}</div>
                </div>
              </div>

              {isMemberOfActiveSquad(candidateC.id) && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  Active Member
                </span>
              )}
            </div>

            <div className="text-xs text-neutral-300 bg-white/[0.03] p-3 rounded-xl border border-white/5 space-y-1">
              <div className="text-[11px] text-neutral-400">{candidateC.university} • {candidateC.year}</div>
              <p className="line-clamp-2 text-[11px] text-neutral-300">{candidateC.bio}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-black/30 border border-white/5 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <div>
                  <div className="font-bold text-white">{candidateC.availability.hoursPerWeek} hrs/wk</div>
                  <div className="text-[10px] text-neutral-500">{candidateC.availability.timezone}</div>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-black/30 border border-white/5 flex items-center gap-2">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <div>
                  <div className="font-bold text-white">{candidateC.experience.hackathonsWon} Hackathons</div>
                  <div className="text-[10px] text-neutral-500">{candidateC.experience.years} yrs exp</div>
                </div>
              </div>
            </div>

            {/* Primary Skills */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-neutral-400 uppercase font-semibold">Primary Specializations</div>
              <div className="flex flex-wrap gap-1.5">
                {candidateC.skills.slice(0, 4).map(s => (
                  <span key={s.name} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.03] text-neutral-200 border border-white/10 font-mono">
                    {s.name} <strong className="text-amber-300">{s.level}%</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-white/10">
              {onSelectStudent && (
                <button
                  onClick={() => onSelectStudent(candidateC)}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white transition-all text-center"
                >
                  Inspect Profile
                </button>
              )}
              {!isMemberOfActiveSquad(candidateC.id) && onSwapCandidate && (
                <button
                  onClick={() => onSwapCandidate(candidateC)}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all text-center"
                >
                  Swap to Team
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Direct Vector Comparison Table */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl space-y-4">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <Scale className="w-4 h-4 text-cyan-400" />
          <span>Vector-by-Vector Comparative Matrix</span>
        </h4>

        <div className="space-y-2">
          {comparisonData.skillDeltas.map((row) => (
            <div
              key={row.category}
              className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="w-48 text-xs font-semibold text-neutral-200">
                {row.category}
              </div>

              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 items-center">
                {/* Score A Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-cyan-300 font-medium">{candidateA.name.split(' ')[0]}</span>
                    <span className="text-neutral-400 font-mono">{row.scoreA}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${row.scoreA}%` }} />
                  </div>
                </div>

                {/* Score B Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-purple-300 font-medium">{candidateB.name.split(' ')[0]}</span>
                    <span className="text-neutral-400 font-mono">{row.scoreB}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-400 h-full rounded-full" style={{ width: `${row.scoreB}%` }} />
                  </div>
                </div>

                {/* Score C Bar (if active) */}
                {row.scoreC !== undefined && candidateC && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-amber-300 font-medium">{candidateC.name.split(' ')[0]}</span>
                      <span className="text-neutral-400 font-mono">{row.scoreC}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: `${row.scoreC}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Advantage Tag */}
              <div className="text-right shrink-0">
                {row.advantage === 'A' && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold font-mono">
                    +{Math.abs(row.scoreA - row.scoreB)}% {candidateA.name.split(' ')[0]} Leads
                  </span>
                )}
                {row.advantage === 'B' && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold font-mono">
                    +{Math.abs(row.scoreB - row.scoreA)}% {candidateB.name.split(' ')[0]} Leads
                  </span>
                )}
                {row.advantage === 'C' && candidateC && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold font-mono">
                    {candidateC.name.split(' ')[0]} Leads
                  </span>
                )}
                {row.advantage === 'Equal' && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] text-neutral-400 font-mono">
                    Even Match
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
