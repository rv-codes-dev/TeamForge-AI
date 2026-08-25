import React from 'react';
import { ProjectDNA, StudentProfile, SkillCoverageStatus } from '../types';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Activity,
  CheckCircle2,
  Users,
  ArrowRight,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { calculateProjectRisk, calculateSkillCoverage } from '../utils/matchingEngine';

interface RiskRadarProps {
  projectDNA: ProjectDNA;
  team: StudentProfile[];
  onSelectStudent?: (student: StudentProfile) => void;
  onSimulateDropout?: (studentId: string) => void;
}

export const RiskRadar: React.FC<RiskRadarProps> = ({
  projectDNA,
  team,
  onSelectStudent,
  onSimulateDropout,
}) => {
  const { breakdown } = calculateSkillCoverage(team, projectDNA);
  const riskInfo = calculateProjectRisk(team, projectDNA, breakdown);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'Medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div id="risk-radar-container" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-semibold text-white tracking-tight">Project Risk Radar & Single Points of Failure</h3>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${getRiskColor(riskInfo.level)}`}>
              {riskInfo.level} Risk Overall
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Monitors 6 architectural vulnerability vectors and identifies individual skill bottlenecks that could halt development.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
          <span className="text-neutral-400">SPOF Dependencies:</span>
          <span className="font-bold text-rose-400">
            {riskInfo.spofItems?.length || 0} Key-Person Bottlenecks
          </span>
        </div>
      </div>

      {/* 6-Vector Risk Radar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {riskInfo.riskVectors?.map((vec, idx) => (
          <motion.div
            key={vec.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.03 }}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 relative"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="text-xs font-bold text-white leading-snug">{vec.name}</div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${getRiskColor(vec.riskLevel)}`}>
                {vec.riskLevel}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400 text-[11px]">Resilience Index</span>
                <span className="font-bold text-white font-mono">{vec.score}/100</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    vec.score >= 80 ? 'bg-emerald-400' : vec.score >= 60 ? 'bg-amber-400' : 'bg-rose-400'
                  }`}
                  style={{ width: `${vec.score}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              {vec.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Single Points of Failure (SPOF) Section */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <h4 className="text-sm font-bold text-white">
              Single Point of Failure (SPOF) Vulnerability Analysis
            </h4>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">
            {riskInfo.spofItems?.length || 0} Identified
          </span>
        </div>

        {riskInfo.spofItems && riskInfo.spofItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskInfo.spofItems.map((spof, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-gradient-to-b from-rose-500/[0.04] to-white/[0.01] border border-rose-500/20 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={spof.dependentMember.avatar}
                      alt={spof.dependentMember.name}
                      className="w-9 h-9 rounded-full object-cover border border-rose-500/40"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{spof.skill}</div>
                      <div className="text-[11px] text-neutral-400">
                        Anchored by <strong className="text-white">{spof.dependentMember.name}</strong> ({spof.memberSkillLevel}%)
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${getRiskColor(spof.riskSeverity)}`}>
                    {spof.riskSeverity} SPOF
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-xs text-neutral-300 space-y-1">
                  <div className="text-[10px] text-rose-300 font-semibold uppercase">Impact if Member Drops Out</div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed">{spof.impactDescription}</p>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-[10px] text-cyan-400 font-semibold uppercase">Mitigation Action</div>
                  <p className="text-[11px] text-neutral-300">{spof.mitigationRecommendation}</p>
                </div>

                {onSimulateDropout && (
                  <button
                    onClick={() => onSimulateDropout(spof.dependentMember.id)}
                    className="w-full py-2 px-3 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Simulate {spof.dependentMember.name.split(' ')[0]}'s Dropout in Stress Studio</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/20 text-center space-y-2">
            <ShieldCheck className="w-8 h-8 mx-auto text-emerald-400" />
            <h5 className="text-sm font-semibold text-white">No Critical Single Points of Failure</h5>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              All project deliverables have sufficient multi-member cross-coverage or secondary backups in the current squad formation.
            </p>
          </div>
        )}
      </div>

      {/* Strategic Risk Mitigation Action Checklist */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl space-y-3">
        <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Strategic Squad Hardening Recommendations</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
            <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>1. Cross-Training Pairings</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Pair backend engineers with vision leads during inference containerization to avoid single-point deployment blockers.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
            <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>2. Shared Spec Validation</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Ensure agronomic/domain researcher defines clear JSON acceptance schemas before model training begins.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
            <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>3. Standby Bench Roster</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Pre-identify top 2 replacement candidates in the student pool who can be dropped in with zero team score degradation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
