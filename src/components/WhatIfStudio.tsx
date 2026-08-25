import React, { useState } from 'react';
import { 
  Sliders, 
  UserPlus, 
  UserMinus, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  RotateCcw, 
  Layers, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck, 
  Users,
  Zap,
  ArrowRight,
  Info
} from 'lucide-react';
import { StudentProfile, ProjectDNA, TeamMetrics, ProjectRiskInfo } from '../types';
import { calculateTeamMetrics, calculateSkillCoverage, calculateProjectRisk, formatScoreCalculation } from '../utils/matchingEngine';
import { MOCK_STUDENTS } from '../data/mockStudents';

interface WhatIfStudioProps {
  currentTeam: StudentProfile[];
  projectDNA: ProjectDNA;
  onApplySquad: (newSquad: StudentProfile[]) => void;
  onResetSquad: () => void;
  onInspectStudent: (student: StudentProfile) => void;
}

export const WhatIfStudio: React.FC<WhatIfStudioProps> = ({
  currentTeam,
  projectDNA,
  onApplySquad,
  onResetSquad,
  onInspectStudent,
}) => {
  const [simulatedSquad, setSimulatedSquad] = useState<StudentProfile[]>(currentTeam);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Metrics for active simulated squad
  const currentMetrics = calculateTeamMetrics(simulatedSquad, projectDNA);
  const baseMetrics = calculateTeamMetrics(currentTeam, projectDNA);
  const { breakdown, gaps } = calculateSkillCoverage(simulatedSquad, projectDNA);
  const riskInfo: ProjectRiskInfo = calculateProjectRisk(simulatedSquad, projectDNA, breakdown);
  const mathFormula = formatScoreCalculation(currentMetrics);

  const scoreDiff = currentMetrics.overallScore - baseMetrics.overallScore;

  // Add a student to the simulated squad
  const handleAddStudent = (student: StudentProfile) => {
    if (simulatedSquad.some((s) => s.id === student.id)) return;
    setSimulatedSquad([...simulatedSquad, student]);
  };

  // Remove a student from simulated squad
  const handleRemoveStudent = (studentId: string) => {
    if (simulatedSquad.length <= 1) return;
    setSimulatedSquad(simulatedSquad.filter((s) => s.id !== studentId));
  };

  // Quick preset team size
  const handleSetTeamSize = (size: number) => {
    if (size > simulatedSquad.length) {
      // Add highest matching non-members
      const nonMembers = MOCK_STUDENTS.filter(s => !simulatedSquad.some(m => m.id === s.id));
      const toAdd = nonMembers.slice(0, size - simulatedSquad.length);
      setSimulatedSquad([...simulatedSquad, ...toAdd]);
    } else if (size < simulatedSquad.length) {
      setSimulatedSquad(simulatedSquad.slice(0, size));
    }
  };

  const handleApplyToMainDashboard = () => {
    onApplySquad(simulatedSquad);
  };

  const availableBenchStudents = MOCK_STUDENTS.filter(
    (s) => !simulatedSquad.some((m) => m.id === s.id)
  ).filter((s) => {
    if (filterRole !== 'all' && !s.role.toLowerCase().includes(filterRole.toLowerCase())) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.skills.some((sk) => sk.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Studio Header Card */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/30 border border-cyan-500/30 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 backdrop-blur-sm flex items-center justify-center">
                <Sliders className="w-3.5 h-3.5 text-cyan-300" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Live 'What-If?' Scenario Studio
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10 font-mono">
                Synthetic demo profiles — prototype data
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Test Squad Variations, Team Sizing & Instant Recalculation
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Add candidates, drop members, or scale team size to see real-time impact on the 4-factor formula and project risk.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="what-if-reset-btn"
              onClick={() => setSimulatedSquad(currentTeam)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Current</span>
            </button>
            <button
              id="what-if-apply-squad-btn"
              onClick={handleApplyToMainDashboard}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-cyan-950 bg-cyan-400 hover:bg-cyan-300 border border-cyan-300 shadow-lg shadow-cyan-400/25 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Apply to Active Squad</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Comparison Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          
          {/* Overall Match Score */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-cyan-500/30 backdrop-blur-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Calculated Score
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black font-mono text-cyan-300">
                {currentMetrics.overallScore}%
              </span>
              {scoreDiff !== 0 && (
                <span className={`text-xs font-bold font-mono ${scoreDiff > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {scoreDiff > 0 ? `+${scoreDiff}%` : `${scoreDiff}%`}
                </span>
              )}
            </div>
          </div>

          {/* Skill Coverage */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Skill Coverage (50%)
            </span>
            <span className="text-xl font-bold font-mono text-blue-300 mt-0.5 block">
              {currentMetrics.skillCoverage}%
            </span>
          </div>

          {/* Complementarity */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Complementarity (20%)
            </span>
            <span className="text-xl font-bold font-mono text-purple-300 mt-0.5 block">
              {currentMetrics.complementarity}%
            </span>
          </div>

          {/* Project Interest */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Interest (15%)
            </span>
            <span className="text-xl font-bold font-mono text-amber-300 mt-0.5 block">
              {currentMetrics.projectInterest}%
            </span>
          </div>

          {/* Availability */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Availability (15%)
            </span>
            <span className="text-xl font-bold font-mono text-emerald-300 mt-0.5 block">
              {currentMetrics.availability}%
            </span>
          </div>

          {/* Risk Level */}
          <div className={`p-3.5 rounded-2xl border backdrop-blur-sm ${
            riskInfo.level === 'High'
              ? 'bg-red-950/40 border-red-500/40'
              : riskInfo.level === 'Medium'
              ? 'bg-amber-950/40 border-amber-500/40'
              : 'bg-emerald-950/40 border-emerald-500/40'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Project Risk
            </span>
            <span className={`text-xl font-extrabold font-mono mt-0.5 block ${
              riskInfo.level === 'High' ? 'text-red-400' : riskInfo.level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {riskInfo.level}
            </span>
          </div>

        </div>

        {/* Live Calculation Formula Box */}
        <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-slate-300 flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-slate-400">Formula Breakdown: </span>
            <span className="text-cyan-300 font-bold">{mathFormula}</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {simulatedSquad.length} Members in Squad
          </span>
        </div>

        {/* Quick Sizing Controls */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-300">Quick Team Size Sizing:</span>
          {[3, 4, 5, 6].map((size) => (
            <button
              key={size}
              id={`what-if-size-btn-${size}`}
              onClick={() => handleSetTeamSize(size)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                simulatedSquad.length === size
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-white/5 text-slate-400 hover:text-white border-white/10'
              }`}
            >
              {size} Members
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Active Simulated Squad vs Available Pool */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Current Simulated Squad (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <h4 className="text-sm font-bold text-white tracking-tight">
                Simulated Active Squad ({simulatedSquad.length} Members)
              </h4>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Click minus to drop member
            </span>
          </div>

          <div className="space-y-3">
            {simulatedSquad.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/15 hover:border-blue-500/40 transition-all flex items-center justify-between gap-3 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-xl object-cover border border-white/20"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-bold text-white tracking-tight">
                        {member.name}
                      </h5>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 font-mono">
                        {member.availability.hoursPerWeek}h/wk
                      </span>
                    </div>
                    <p className="text-xs text-blue-300 font-medium">
                      {member.role}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {member.skills.slice(0, 3).map((s) => (
                        <span key={s.name} className="text-[10px] px-2 py-0.2 rounded-md bg-white/5 text-slate-300 font-mono">
                          {s.name} {s.level}%
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onInspectStudent(member)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    title="View candidate dossier"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <button
                    id={`what-if-remove-student-${member.id}`}
                    onClick={() => handleRemoveStudent(member.id)}
                    disabled={simulatedSquad.length <= 1}
                    className="p-2 rounded-xl text-red-300 hover:text-red-200 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Simulate dropping this member"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Available Candidate Pool to Add (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white tracking-tight">
                Available Candidates from Pool ({availableBenchStudents.length})
              </h4>
            </div>
            
            {/* Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {['all', 'AI', 'Full-Stack', 'Design', 'Data'].map((role) => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                    filterRole === role
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {availableBenchStudents.map((candidate) => (
              <div
                key={candidate.id}
                className="p-4 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 transition-all flex items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={candidate.avatar}
                    alt={candidate.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-xl object-cover border border-white/20"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-bold text-white tracking-tight">
                        {candidate.name}
                      </h5>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono font-bold">
                        {candidate.experience.hackathonsWon} wins
                      </span>
                    </div>
                    <p className="text-xs text-blue-300 font-medium">
                      {candidate.role} • {candidate.university}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {candidate.skills.slice(0, 3).map((s) => (
                        <span key={s.name} className="text-[10px] px-2 py-0.2 rounded-md bg-white/5 text-slate-300 font-mono">
                          {s.name} {s.level}%
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onInspectStudent(candidate)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    title="View candidate dossier"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <button
                    id={`what-if-add-student-${candidate.id}`}
                    onClick={() => handleAddStudent(candidate)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-300 hover:text-white bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                    title="Add to simulated squad"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
