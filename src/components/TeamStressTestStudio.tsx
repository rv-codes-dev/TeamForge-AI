import React, { useState } from 'react';
import { 
  Flame, 
  UserMinus, 
  RefreshCw, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  Shuffle, 
  RotateCcw,
  Check,
  AlertTriangle,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { StudentProfile, ProjectDNA, TeamMetrics, TeamMatchResult } from '../types';
import { simulateTeamStressTest, calculateTeamMetrics, calculateProjectRisk, calculateSkillCoverage } from '../utils/matchingEngine';
import { MOCK_STUDENTS } from '../data/mockStudents';
import { AnimatedNumber } from '../hooks/useCountUp';

interface TeamStressTestStudioProps {
  currentTeam: StudentProfile[];
  projectDNA: ProjectDNA;
  originalMetrics: TeamMetrics;
  onApplyReplacement: (oldMemberId: string, newMember: StudentProfile) => void;
  onResetSquad: () => void;
  onInspectStudent: (student: StudentProfile) => void;
}

export const TeamStressTestStudio: React.FC<TeamStressTestStudioProps> = ({
  currentTeam,
  projectDNA,
  originalMetrics,
  onApplyReplacement,
  onResetSquad,
  onInspectStudent,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(currentTeam[0]?.id || '');
  const [isSimulatingRemoval, setIsSimulatingRemoval] = useState<boolean>(false);
  const [stressResult, setStressResult] = useState<ReturnType<typeof simulateTeamStressTest> | null>(null);
  const [selectedReplacement, setSelectedReplacement] = useState<StudentProfile | null>(null);
  const [replacementSuccessMessage, setReplacementSuccessMessage] = useState<string | null>(null);

  // Trigger member removal stress test
  const handleRemoveMember = (memberId?: string) => {
    const targetId = memberId || selectedMemberId;
    if (!targetId) return;

    try {
      const result = simulateTeamStressTest(currentTeam, targetId, projectDNA, MOCK_STUDENTS);
      setStressResult(result);
      setIsSimulatingRemoval(true);
      setSelectedMemberId(targetId);
      setSelectedReplacement(result.replacementCandidates[0]?.student || null);
      setReplacementSuccessMessage(null);
    } catch (err) {
      console.error('Failed to simulate stress test:', err);
    }
  };

  // Perform the replacement
  const handleExecuteReplacement = () => {
    if (!stressResult || !selectedReplacement) return;

    const candidateInfo = stressResult.replacementCandidates.find(
      c => c.student.id === selectedReplacement.id
    );

    const oldName = stressResult.removedMember.name;
    const newName = selectedReplacement.name;
    const newScore = candidateInfo?.projectedTeamScore || 92;

    onApplyReplacement(stressResult.removedMember.id, selectedReplacement);

    setReplacementSuccessMessage(
      `Replaced ${oldName} with ${newName}! Team Score restored to ${newScore}%.`
    );

    setIsSimulatingRemoval(false);
    setStressResult(null);
    setSelectedReplacement(null);
  };

  const handleCancelStressTest = () => {
    setIsSimulatingRemoval(false);
    setStressResult(null);
    setSelectedReplacement(null);
  };

  // Calculate degraded risk if active
  const degradedCoverage = stressResult ? calculateSkillCoverage(stressResult.degradedTeam, projectDNA) : null;
  const degradedRisk = degradedCoverage && stressResult ? calculateProjectRisk(stressResult.degradedTeam, projectDNA, degradedCoverage.breakdown) : null;

  return (
    <div className="rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-amber-500/30 p-6 sm:p-8 shadow-2xl shadow-black/50 relative overflow-hidden">
      
      {/* Ambient background stress flare */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-white/10 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 backdrop-blur-sm flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Interactive Team Stress Test
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10 font-mono">
              Synthetic demo profiles — prototype data
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            Single-Point-of-Failure & Resilience Simulator
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Simulate a teammate dropping out mid-hackathon, measure real-time capability loss, and hot-swap optimal replacements.
          </p>
        </div>

        {/* Action button to reset squad */}
        <button
          id="stress-reset-squad-btn"
          onClick={onResetSquad}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 backdrop-blur-sm flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Original Squad</span>
        </button>
      </div>

      {/* Success Notification if replaced */}
      {replacementSuccessMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 backdrop-blur-xl flex items-center gap-3 text-emerald-200 text-sm shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{replacementSuccessMessage}</span>
        </div>
      )}

      {/* Step 1: Select Member to Stress Test */}
      {!isSimulatingRemoval ? (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Step 1: Choose a Squad Member to Simulate Removal
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {currentTeam.map((member) => {
                const isSelected = selectedMemberId === member.id;

                return (
                  <button
                    key={member.id}
                    type="button"
                    id={`select-stress-member-${member.id}`}
                    onClick={() => setSelectedMemberId(member.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all relative backdrop-blur-md ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/60 shadow-lg shadow-amber-500/15'
                        : 'bg-black/30 hover:bg-black/40 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover border border-white/20 shadow-sm"
                      />
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-bold text-white tracking-tight truncate">
                          {member.name}
                        </h4>
                        <p className="text-[11px] text-blue-300 truncate font-medium">
                          {member.role.split('&')[0]}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-white/[0.06]">
                      <span>{member.availability.hoursPerWeek}h/wk</span>
                      <span className="text-slate-200 font-semibold">{member.skills[0]?.name} {member.skills[0]?.level}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trigger Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-black font-mono text-white">
                {originalMetrics.overallScore}%
              </div>
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-emerald-400">Current Stable Score</span>
                <p className="text-[11px] text-slate-400">Ready to simulate single-point-of-failure stress test</p>
              </div>
            </div>

            <button
              id="simulate-removal-trigger-btn"
              onClick={() => handleRemoveMember()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-amber-950 bg-amber-400 hover:bg-amber-300 border border-amber-300 shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <UserMinus className="w-4 h-4" />
              <span>Remove Selected Member & Recalculate</span>
            </button>
          </div>
        </div>
      ) : (
        /* Step 2 & 3: Active Stress Simulation Mode */
        stressResult && (
          <div className="space-y-6">
            
            {/* Score Degradation Banner: e.g. 94% -> 76% */}
            <div className="p-5 rounded-3xl bg-red-950/30 border border-red-500/40 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="flex items-center gap-4">
                  <div className="flex items-baseline gap-2 font-mono">
                    <span className="text-2xl sm:text-3xl font-bold text-slate-400 line-through">
                      {originalMetrics.overallScore}%
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold text-slate-400">→</span>
                    <span className="text-4xl sm:text-5xl font-black text-red-400">
                      <AnimatedNumber value={stressResult.degradedMetrics.overallScore} duration={800} />%
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-300">
                      <TrendingDown className="w-4 h-4" />
                      <span>-{originalMetrics.overallScore - stressResult.degradedMetrics.overallScore}% Score Degradation</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      Removed: <span className="font-bold text-white">{stressResult.removedMember.name}</span> ({stressResult.removedMember.role})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {degradedRisk && (
                    <div className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono font-bold flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                      <span>Project Risk: {degradedRisk.level}</span>
                    </div>
                  )}

                  <button
                    id="cancel-stress-test-btn"
                    onClick={handleCancelStressTest}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-sm transition-colors self-start sm:self-auto"
                  >
                    Cancel Simulation
                  </button>
                </div>
              </div>

              {/* Exact Lost Capabilities Explanation */}
              <div className="pt-3 border-t border-red-500/25">
                <div className="flex items-center gap-2 text-xs font-bold text-red-300 mb-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Critical Capability Impact & Lost Deficits:</span>
                </div>
                <div className="space-y-1.5 text-xs text-red-200">
                  {stressResult.lostCapabilities.map((cap, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Find Replacement Recommendations */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    Recommended Replacement Candidates (Ranked by Restored Synergy)
                  </h4>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Top Alternatives from 22-Student Pool
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {stressResult.replacementCandidates.map((candidateInfo) => {
                  const candidate = candidateInfo.student;
                  const isSelected = selectedReplacement?.id === candidate.id;

                  return (
                    <div
                      key={candidate.id}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-400 shadow-xl shadow-cyan-500/15 ring-1 ring-cyan-400/40'
                          : 'bg-black/30 hover:bg-black/40 border-white/10 hover:border-white/20'
                      }`}
                      onClick={() => setSelectedReplacement(candidate)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={candidate.avatar}
                            alt={candidate.name}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded-xl object-cover border border-white/20 shadow-sm"
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="text-sm font-bold text-white tracking-tight">
                                {candidate.name}
                              </h5>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                                Match: {candidateInfo.replacementMatch}%
                              </span>
                            </div>
                            <p className="text-xs text-blue-300 font-medium">
                              {candidate.role}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {candidate.university} • {candidate.availability.hoursPerWeek}h/wk
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Projected Score
                          </span>
                          <span className="text-lg font-black font-mono text-emerald-400">
                            {candidateInfo.projectedTeamScore}%
                          </span>
                        </div>
                      </div>

                      {/* Capabilities Restored */}
                      <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px] space-y-1">
                        <div className="text-emerald-300 font-semibold flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Restores: {candidateInfo.restoredCapabilities.join(', ')}</span>
                        </div>
                        <div className="text-slate-400">
                          {candidateInfo.tradeoffSummary}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onInspectStudent(candidate);
                          }}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect Profile</span>
                        </button>
                        <span className="text-[10px] font-bold text-cyan-300">
                          {isSelected ? '✓ Selected for Swap' : 'Click card to select'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Execute Replacement Action Bar: 76% -> 92% */}
            {selectedReplacement && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-black/40 border border-cyan-500/30 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">
                      Swap <span className="text-red-400 line-through">{stressResult.removedMember.name}</span> with <span className="text-cyan-300">{selectedReplacement.name}</span>
                    </div>
                    <div className="text-xs font-mono font-bold text-emerald-300 mt-0.5">
                      Score Recovery: {stressResult.degradedMetrics.overallScore}% → {stressResult.replacementCandidates.find(c => c.student.id === selectedReplacement.id)?.projectedTeamScore || 92}%
                    </div>
                  </div>
                </div>

                <button
                  id="execute-replace-member-btn"
                  onClick={handleExecuteReplacement}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/40 shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept Replacement & Update Squad</span>
                </button>
              </div>
            )}

          </div>
        )
      )}

    </div>
  );
};

