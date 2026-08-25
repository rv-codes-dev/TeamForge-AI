import React from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  UserPlus, 
  Sparkles,
  Users,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { SkillCoverageStatus, SkillGap, StudentProfile, ProjectRiskInfo } from '../types';
import { MOCK_STUDENTS } from '../data/mockStudents';

interface SkillCoverageMatrixProps {
  breakdown: SkillCoverageStatus[];
  gaps: SkillGap[];
  riskInfo?: ProjectRiskInfo;
  onAddBenchMember?: (student: StudentProfile) => void;
  onInspectStudent?: (student: StudentProfile) => void;
}

export const SkillCoverageMatrix: React.FC<SkillCoverageMatrixProps> = ({
  breakdown,
  gaps,
  riskInfo,
  onAddBenchMember,
  onInspectStudent,
}) => {
  const getStatusBadge = (status: SkillCoverageStatus['status'], effective: number) => {
    switch (status) {
      case 'optimal':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'Covered (Optimal)',
          bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          barColor: 'bg-emerald-400',
        };
      case 'sufficient':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />,
          label: 'Sufficient',
          bg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
          barColor: 'bg-cyan-400',
        };
      case 'weak':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
          label: 'Weak / Partial',
          bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          barColor: 'bg-amber-400',
        };
      case 'missing':
        return {
          icon: <XCircle className="w-3.5 h-3.5 text-red-400" />,
          label: 'Deficit / Missing',
          bg: 'bg-red-500/10 text-red-300 border-red-500/30',
          barColor: 'bg-red-500',
        };
    }
  };

  return (
    <div className="rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/15 p-6 sm:p-7 shadow-2xl shadow-black/50 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-purple-500/15 border border-purple-500/30 backdrop-blur-sm flex items-center justify-center">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-300" />
          </div>
          <h3 className="text-lg font-extrabold text-white tracking-tight">
            Skill Coverage Matrix & Capability Diagnosis
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {riskInfo && (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border backdrop-blur-sm ${
              riskInfo.level === 'High' 
                ? 'bg-red-500/15 text-red-300 border-red-500/30'
                : riskInfo.level === 'Medium'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
            }`}>
              Risk: {riskInfo.level}
            </span>
          )}
          <span className="text-xs font-mono text-slate-400">
            DNA Requirements vs Active Squad
          </span>
        </div>
      </div>

      {/* Structured Matrix Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="pb-3 pr-4">Required Skill</th>
              <th className="pb-3 px-3">Project Weight</th>
              <th className="pb-3 px-3">Team Coverage</th>
              <th className="pb-3 px-3">Status</th>
              <th className="pb-3 pl-3">Contributing Specialists</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {breakdown.map((item) => {
              const badge = getStatusBadge(item.status, item.effectiveCoverage);

              return (
                <tr key={item.skill} className="hover:bg-white/[0.02] transition-colors">
                  
                  {/* Skill Name */}
                  <td className="py-3.5 pr-4 font-bold text-white tracking-tight">
                    <div className="flex items-center gap-2">
                      <span>{item.skill}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({item.category})</span>
                    </div>
                  </td>

                  {/* Weight */}
                  <td className="py-3.5 px-3 font-mono text-slate-300">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 font-bold">
                      {item.importance}%
                    </span>
                  </td>

                  {/* Coverage with Progress Bar */}
                  <td className="py-3.5 px-3 min-w-[140px]">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="font-extrabold text-cyan-300">{item.effectiveCoverage}%</span>
                        <span className="text-[10px] text-slate-400">of 100%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${badge.barColor} transition-all duration-500`}
                          style={{ width: `${item.effectiveCoverage}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border backdrop-blur-sm ${badge.bg}`}>
                      {badge.icon}
                      <span>{badge.label}</span>
                    </div>
                  </td>

                  {/* Covered By Chips */}
                  <td className="py-3.5 pl-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.coveredBy.length > 0 ? (
                        item.coveredBy.map((c) => (
                          <span
                            key={c.studentId}
                            className="px-2 py-0.5 rounded-lg bg-blue-500/15 text-blue-200 border border-blue-500/30 text-[11px] font-mono font-medium backdrop-blur-sm"
                          >
                            {c.studentName} <span className="text-cyan-300 font-bold">({c.level}%)</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-red-400 font-semibold text-[11px] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-400" />
                          <span>No active team member covers this requirement</span>
                        </span>
                      )}
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Identified Deficits & Bench Solutions */}
      {gaps.length > 0 && (
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Identified Skill Deficits & Recommended Hot-Swap Solutions
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Synthetic Candidate Recommendations
            </span>
          </div>

          <div className="space-y-3">
            {gaps.map((gap, index) => {
              const recommendedStudent = gap.recommendedStudentId
                ? MOCK_STUDENTS.find((s) => s.id === gap.recommendedStudentId)
                : MOCK_STUDENTS.find((s) => s.skills.some((sk) => sk.name.toLowerCase().includes(gap.skill.toLowerCase().split(' ')[0])));

              return (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-300 font-mono">
                        {gap.skill} — Deficit Alert
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                        gap.severity === 'critical'
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {gap.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      {gap.deficitDescription}
                    </p>
                  </div>

                  {recommendedStudent && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        id={`inspect-bench-student-${recommendedStudent.id}`}
                        onClick={() => onInspectStudent && onInspectStudent(recommendedStudent)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 backdrop-blur-sm flex items-center gap-1.5 transition-colors"
                        title="View profile"
                      >
                        <img
                          src={recommendedStudent.avatar}
                          alt={recommendedStudent.name}
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span>{recommendedStudent.name}</span>
                      </button>

                      {onAddBenchMember && (
                        <button
                          id={`add-bench-student-${recommendedStudent.id}`}
                          onClick={() => onAddBenchMember(recommendedStudent)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-300 hover:text-white bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 backdrop-blur-sm flex items-center gap-1 transition-all active:scale-95"
                          title="Add this specialist to the squad"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Add to Squad</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

