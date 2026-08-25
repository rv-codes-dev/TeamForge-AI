import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Users, 
  Zap, 
  ShieldAlert, 
  Cpu, 
  Dna, 
  BarChart3, 
  CheckCircle2, 
  Flame, 
  Shuffle, 
  Target,
  Award
} from 'lucide-react';
import { StudentProfile } from '../types';
import { MOCK_STUDENTS } from '../data/mockStudents';

interface LandingHeroProps {
  onBuildTeam: () => void;
  onTryDemo: () => void;
  onSelectStudentProfile: (student: StudentProfile) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onBuildTeam,
  onTryDemo,
  onSelectStudentProfile,
}) => {
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'match' | 'stress' | 'dna'>('match');
  const [interactiveMemberState, setInteractiveMemberState] = useState<'full' | 'removed'>('full');

  // Preview squad
  const previewMembers = [
    MOCK_STUDENTS.find(s => s.id === 'aarav-sharma')!,
    MOCK_STUDENTS.find(s => s.id === 'priya-nair')!,
    MOCK_STUDENTS.find(s => s.id === 'rohan-gupta')!,
    MOCK_STUDENTS.find(s => s.id === 'meera-patel')!,
  ].filter(Boolean);

  const replacementMember = MOCK_STUDENTS.find(s => s.id === 'elena-rostova')!;

  return (
    <div className="relative overflow-hidden pt-6 pb-16 lg:pt-12 lg:pb-24">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/15 via-indigo-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-60 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/15 text-xs font-semibold text-blue-300 mb-6 backdrop-blur-xl shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>Next-Generation Team Intelligence Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
            Don't find the best people.{' '}
            <span className="block mt-1 bg-gradient-to-r from-blue-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
              Build the best team.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto mb-8">
            AI-powered team intelligence for hackathons, projects, research and startups. 
            Deconstruct ideas into <span className="text-cyan-300 font-semibold">Project DNA</span>, match complementary skillsets, and stress-test your squad before writing a line of code.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              id="hero-build-team-btn"
              onClick={onBuildTeam}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-400/40 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 backdrop-blur-sm"
            >
              <span>Build My Team</span>
              <ArrowRight className="w-4 h-4 text-blue-200" />
            </button>

            <button
              id="hero-try-demo-btn"
              onClick={onTryDemo}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm text-slate-200 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 backdrop-blur-xl flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Try Flagship Demo</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md mx-auto pt-6 border-t border-white/10 text-slate-400 text-xs">
            <div>
              <div className="text-base font-bold text-white font-mono">22+</div>
              <div>Student Profiles</div>
            </div>
            <div>
              <div className="text-base font-bold text-cyan-300 font-mono">4-Factor</div>
              <div>Explainable Formula</div>
            </div>
            <div>
              <div className="text-base font-bold text-blue-300 font-mono">1-Click</div>
              <div>Stress Testing</div>
            </div>
          </div>
        </div>

        {/* Interactive Visual Team Matching Sandbox */}
        <div className="relative rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/15 p-5 sm:p-8 shadow-2xl shadow-black/60 mb-16">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-white/10 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Live Synergy Graph Simulation
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[11px] font-mono border border-cyan-500/25 backdrop-blur-sm">
                  AgriVision AI Project
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Visualizing complementary skill matrix & interactive stress test dynamics
              </p>
            </div>

            {/* Simulation controls */}
            <div className="flex items-center gap-2">
              <button
                id="sandbox-full-team-tab"
                onClick={() => setInteractiveMemberState('full')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all backdrop-blur-md ${
                  interactiveMemberState === 'full'
                    ? 'bg-blue-600 text-white border border-blue-400/50 shadow-md shadow-blue-600/20'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                Optimal Team (94%)
              </button>
              <button
                id="sandbox-stress-test-tab"
                onClick={() => setInteractiveMemberState('removed')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 backdrop-blur-md ${
                  interactiveMemberState === 'removed'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md shadow-amber-500/15'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate Dropout (76%)</span>
              </button>
            </div>
          </div>

          {/* Interactive Network Node Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Center Gauge & Synergy Score */}
            <div className="lg:col-span-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Team Match Score
              </div>

              {/* Dynamic Score Ring */}
              <div className="relative w-36 h-36 flex items-center justify-center my-2">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    className="stroke-white/10"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    className={`transition-all duration-700 ease-out ${
                      interactiveMemberState === 'full' ? 'stroke-cyan-400' : 'stroke-amber-400'
                    }`}
                    strokeWidth="8"
                    strokeDasharray={301.6}
                    strokeDashoffset={interactiveMemberState === 'full' ? 301.6 * (1 - 0.94) : 301.6 * (1 - 0.76)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
                    {interactiveMemberState === 'full' ? '94%' : '76%'}
                  </span>
                  <span className={`text-[10px] uppercase font-semibold tracking-wider ${
                    interactiveMemberState === 'full' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {interactiveMemberState === 'full' ? 'High Synergy' : 'Degraded (Lost ML)'}
                  </span>
                </div>
              </div>

              {/* Metrics Formula Breakdown */}
              <div className="w-full space-y-1.5 mt-4 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Skill Coverage (50%)</span>
                  <span className="text-slate-200 font-semibold">{interactiveMemberState === 'full' ? '96%' : '68%'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Complementarity (20%)</span>
                  <span className="text-slate-200 font-semibold">{interactiveMemberState === 'full' ? '92%' : '78%'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Project Interest (15%)</span>
                  <span className="text-slate-200 font-semibold">{interactiveMemberState === 'full' ? '95%' : '88%'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Availability (15%)</span>
                  <span className="text-slate-200 font-semibold">{interactiveMemberState === 'full' ? '93%' : '84%'}</span>
                </div>
              </div>

              {interactiveMemberState === 'removed' && (
                <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-left text-[11px] text-amber-200 backdrop-blur-sm">
                  <div className="font-semibold flex items-center gap-1 text-amber-300">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Critical Capability Lost</span>
                  </div>
                  <div>Aarav's departure removed Computer Vision (96%) and PyTorch pipelines.</div>
                </div>
              )}
            </div>

            {/* Team Nodes Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {previewMembers.map((member, idx) => {
                const isRemovedInSimulation = interactiveMemberState === 'removed' && member.id === 'aarav-sharma';

                return (
                  <div
                    key={member.id}
                    className={`rounded-2xl p-4 border transition-all duration-300 relative backdrop-blur-xl ${
                      isRemovedInSimulation
                        ? 'bg-red-950/25 border-red-500/30 opacity-60'
                        : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 hover:border-white/20 shadow-lg'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-xl object-cover border border-white/20 shadow-sm"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white tracking-tight">{member.name}</h4>
                            {isRemovedInSimulation ? (
                              <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                                Removed
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                                {idx === 0 ? '96% Match' : idx === 1 ? '95% Match' : idx === 2 ? '94% Match' : '92% Match'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-blue-300 font-medium">{member.role}</p>
                          <p className="text-[11px] text-slate-400">{member.university} • {member.year}</p>
                        </div>
                      </div>
                    </div>

                    {/* Skill chips */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {member.skills.slice(0, 3).map(skill => (
                        <span
                          key={skill.name}
                          className={`text-[10px] px-2 py-0.5 rounded-lg font-mono ${
                            skill.level >= 90
                              ? 'bg-blue-500/15 text-blue-200 border border-blue-500/30 font-medium'
                              : 'bg-white/5 text-slate-300 border border-white/10'
                          }`}
                        >
                          {skill.name} <span className="text-slate-400 font-bold">{skill.level}%</span>
                        </span>
                      ))}
                    </div>

                    {/* Selection Rationale pill */}
                    <div className="mt-2.5 text-[11px] text-slate-400 leading-snug line-clamp-1 border-t border-white/[0.06] pt-2">
                      <span className="text-slate-300 font-semibold">Synergy: </span>
                      {idx === 0 ? 'CV & Leaf Pathology classification' : idx === 1 ? 'Mobile UI & accessible farmer upload flow' : idx === 2 ? 'High-throughput image ingest API & DB' : 'Agronomic validation & botanical research'}
                    </div>

                    {isRemovedInSimulation && (
                      <div className="mt-2 text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                        <Shuffle className="w-3 h-3" />
                        <span>Recommended Replacement: Elena Rostova (94%)</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Quick Demo CTA inside sandbox */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full explainable math • Zero black-box ranking • Dynamic instant stress testing</span>
            </div>

            <button
              id="sandbox-launch-agrivision-btn"
              onClick={onTryDemo}
              className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 transition-colors"
            >
              <span>Explore Complete AgriVision AI Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* 4-Step Core Architecture Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-blue-500/40 transition-all shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-center mb-3">
              <Dna className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">1. Project DNA Extraction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deconstructs raw ideas into exact technical & domain skill requirements with importance weightings (e.g. CV 94%, Python 88%).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-blue-500/40 transition-all shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 flex items-center justify-center mb-3">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">2. Explainable 4-Factor Matching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates Skill Coverage (50%), Complementarity (20%), Project Interest (15%), and Availability (15%) with zero black-box bias.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-blue-500/40 transition-all shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 flex items-center justify-center mb-3">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">3. Skill Gap Diagnosis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identifies weak or missing capabilities (e.g. Cybersecurity deficit) and recommends instant 5th specialist bench recruits.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-amber-500/40 transition-all shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center mb-3">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">4. Team Stress Testing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simulate member dropout in 1 click, inspect lost capabilities, and hot-swap optimal replacements with real-time score recovery.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
