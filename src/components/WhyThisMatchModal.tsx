import React from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Clock, 
  Award, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { StudentProfile, ProjectDNA, MemberSelectionReason } from '../types';

interface WhyThisMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile | null;
  projectDNA: ProjectDNA;
  reason?: MemberSelectionReason;
  team: StudentProfile[];
}

export const WhyThisMatchModal: React.FC<WhyThisMatchModalProps> = ({
  isOpen,
  onClose,
  student,
  projectDNA,
  reason,
  team,
}) => {
  if (!isOpen || !student) return null;

  const scoreBreakdown = reason?.scoreBreakdown || {
    skillCoverage: 96,
    complementarity: 92,
    projectInterest: 95,
    availability: 93,
    experience: 90,
  };

  const finalScore = reason?.individualMatchScore || Math.round(
    scoreBreakdown.skillCoverage * 0.40 +
    scoreBreakdown.complementarity * 0.25 +
    scoreBreakdown.projectInterest * 0.15 +
    scoreBreakdown.availability * 0.10 +
    scoreBreakdown.experience * 0.10
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#11182B] border border-[#263550] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-[#17213A] border-b border-[#263550] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-[#38BDF8]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#F8FAFC]">Why {student.name}?</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                  {finalScore}% SQUAD FIT
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                {student.role} • {student.university}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1D2942] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Primary Contribution Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#38BDF8]/10 via-[#8B5CF6]/10 to-transparent border border-[#38BDF8]/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#38BDF8]">
              <Sparkles className="w-4 h-4 text-[#22D3EE]" />
              <span>AI Synergy & Match Rationale</span>
            </div>
            <p className="text-xs text-[#F8FAFC] leading-relaxed">
              {reason?.primaryContribution || `Selected to lead mission-critical AI/ML execution and cross-functional technical synchronization for ${projectDNA.title}.`}
            </p>
          </div>

          {/* Explainable 5-Factor Math Formula */}
          <div className="p-4 bg-[#0B1020] border border-[#263550] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F8FAFC]">
                Explainable 5-Factor Mathematical Formula
              </span>
              <span className="text-[10px] font-mono text-[#38BDF8] font-semibold">
                No Black-Box Scoring
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#CBD5E1]">Skill Coverage (40% weight)</span>
                <span className="font-mono text-[#38BDF8] font-bold">{scoreBreakdown.skillCoverage}%</span>
              </div>
              <div className="w-full h-1 bg-[#17213A] rounded-full overflow-hidden">
                <div className="h-full bg-[#38BDF8]" style={{ width: `${scoreBreakdown.skillCoverage}%` }} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#CBD5E1]">Team Complementarity (25% weight)</span>
                <span className="font-mono text-[#8B5CF6] font-bold">{scoreBreakdown.complementarity}%</span>
              </div>
              <div className="w-full h-1 bg-[#17213A] rounded-full overflow-hidden">
                <div className="h-full bg-[#8B5CF6]" style={{ width: `${scoreBreakdown.complementarity}%` }} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#CBD5E1]">Project Interest (15% weight)</span>
                <span className="font-mono text-[#22D3EE] font-bold">{scoreBreakdown.projectInterest}%</span>
              </div>
              <div className="w-full h-1 bg-[#17213A] rounded-full overflow-hidden">
                <div className="h-full bg-[#22D3EE]" style={{ width: `${scoreBreakdown.projectInterest}%` }} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#CBD5E1]">Availability & Bandwidth (10% weight)</span>
                <span className="font-mono text-emerald-400 font-bold">{scoreBreakdown.availability}%</span>
              </div>
              <div className="w-full h-1 bg-[#17213A] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: `${scoreBreakdown.availability}%` }} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#CBD5E1]">Experience & Hackathons (10% weight)</span>
                <span className="font-mono text-amber-400 font-bold">{scoreBreakdown.experience}%</span>
              </div>
              <div className="w-full h-1 bg-[#17213A] rounded-full overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: `${scoreBreakdown.experience}%` }} />
              </div>
            </div>

            <div className="pt-2 border-t border-[#263550] flex items-center justify-between text-xs font-semibold">
              <span className="text-[#94A3B8]">Composite Score Calculation:</span>
              <span className="font-mono text-emerald-400 text-sm font-bold">
                ({scoreBreakdown.skillCoverage} × 0.40) + ({scoreBreakdown.complementarity} × 0.25) + ({scoreBreakdown.projectInterest} × 0.15) + ({scoreBreakdown.availability} × 0.10) + ({scoreBreakdown.experience} × 0.10) = {finalScore}%
              </span>
            </div>
          </div>

          {/* Project Needs vs Candidate Provides */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#F8FAFC]">
                Project DNA Needs vs. Candidate Provides
              </span>
              <span className="text-[10px] text-[#94A3B8]">Direct Capability Mapping</span>
            </div>

            <div className="space-y-2">
              {projectDNA.requiredSkills.slice(0, 4).map(req => {
                const sSkill = student.skills.find(s => s.name.toLowerCase().includes(req.name.toLowerCase()) || req.name.toLowerCase().includes(s.name.toLowerCase()));
                const candidateLevel = sSkill ? sSkill.level : (student.primarySkills.some(ps => ps.toLowerCase().includes(req.name.toLowerCase())) ? 85 : 45);
                const isHighMatch = candidateLevel >= req.importance - 10;

                return (
                  <div key={req.name} className="p-3 bg-[#17213A]/60 border border-[#263550] rounded-xl flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#F8FAFC]">{req.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0B1020] text-[#94A3B8]">
                          {req.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#94A3B8]">
                        Project Target: <span className="text-[#CBD5E1] font-medium">{req.importance}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <div className="text-[10px] text-[#94A3B8]">Candidate Level</div>
                        <div className={`font-mono font-bold ${isHighMatch ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {candidateLevel}%
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isHighMatch ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Squad Synergy Bullets */}
          {reason?.synergyHighlights && (
            <div className="p-4 bg-[#17213A]/40 border border-[#263550] rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#F8FAFC]">Synergy Highlights with Squad:</span>
              <ul className="space-y-1.5 text-xs text-[#CBD5E1]">
                {reason.synergyHighlights.map((syn, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] mt-1.5 shrink-0" />
                    <span>{syn}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
