import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Zap, 
  Award, 
  Clock, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  ShieldCheck, 
  Sliders, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  HelpCircle
} from 'lucide-react';
import { StudentProfile, MemberSelectionReason, ProjectDNA } from '../types';
import { WhyThisMatchModal } from './WhyThisMatchModal';

interface TeamSquadViewProps {
  team: StudentProfile[];
  projectDNA: ProjectDNA;
  memberReasons: Record<string, MemberSelectionReason>;
  onInspectStudent: (student: StudentProfile) => void;
  onRemoveMember: (student: StudentProfile) => void;
  onSwapMember?: (student: StudentProfile) => void;
  onTargetSizeChange?: (size: number) => void;
  onNavigateTab?: (tab: string) => void;
}

export const TeamSquadView: React.FC<TeamSquadViewProps> = ({
  team,
  projectDNA,
  memberReasons,
  onInspectStudent,
  onRemoveMember,
  onSwapMember,
  onTargetSizeChange,
  onNavigateTab,
}) => {
  const [selectedStudentForWhyModal, setSelectedStudentForWhyModal] = useState<StudentProfile | null>(null);
  const [showTeamRationale, setShowTeamRationale] = useState(true);

  const teamSizeTrajectory = [
    { size: 3, score: 78, status: 'Deficit Risk', note: 'Leaves domain research or cloud pipeline understaffed.' },
    { size: 4, score: 94, status: 'Optimal Equilibrium', note: 'Perfect balance of AI/ML, Frontend, Backend, and Agri Research.', recommended: true },
    { size: 5, score: 96, status: 'High Redundancy', note: 'Adds dedicated DevOps specialist; minor coordination overhead.' },
    { size: 6, score: 97, status: 'Maximum Coverage', note: 'Full specialized coverage with increased synchronization cost.' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Team Size Optimizer Bar */}
      <div className="p-4 bg-[#11182B] border border-[#263550] rounded-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#38BDF8]" />
            <span className="text-xs font-bold text-[#F8FAFC]">
              Team Size Optimizer & Trajectory
            </span>
          </div>
          <span className="text-[11px] text-[#94A3B8]">
            Optimal Size Recommendation: <strong className="text-emerald-400">4 Members (94%)</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {teamSizeTrajectory.map(item => {
            const isCurrent = projectDNA.targetTeamSize === item.size;
            return (
              <button
                key={item.size}
                id={`team-size-opt-${item.size}-btn`}
                onClick={() => onTargetSizeChange?.(item.size)}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isCurrent
                    ? 'bg-[#17213A] border-[#38BDF8] shadow-md shadow-[#38BDF8]/10'
                    : 'bg-[#0B1020] border-[#263550] hover:border-[#38BDF8]/40 hover:bg-[#17213A]/50'
                }`}
              >
                {item.recommended && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#38BDF8]/20 text-[#38BDF8]">
                    RECOMMENDED
                  </span>
                )}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-[#F8FAFC]">{item.size} Members</span>
                  <span className="font-mono text-xs font-bold text-emerald-400">({item.score}%)</span>
                </div>
                <div className="text-[10px] text-[#38BDF8] font-medium mt-0.5">{item.status}</div>
                <p className="text-[10px] text-[#94A3B8] mt-1 leading-snug">{item.note}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prominent AI Insight Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#17213A] via-[#1D2942] to-[#17213A] border border-[#38BDF8]/40 shadow-lg space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#38BDF8]/20 border border-[#38BDF8]/40 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            </div>
            <span className="text-xs font-bold text-[#F8FAFC]">AI Team Formation Insight</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            PROJECTED READINESS: 94%
          </span>
        </div>
        <p className="text-xs text-[#CBD5E1] leading-relaxed">
          Your team has outstanding core AI/ML, Frontend, and Agri-domain depth. Cloud deployment and API security have minor single-person dependency on Rohan. Adding 1 DevOps contributor or cross-training will elevate team resilience from <strong>87/100 → 96/100</strong>.
        </p>
      </div>

      {/* Recommended Squad Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-[#F8FAFC]">
            Active Complementary Squad ({team.length} Members)
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#17213A] text-[#94A3B8] border border-[#263550]">
            Synthetic Demo Profiles
          </span>
        </div>

        <button
          onClick={() => setShowTeamRationale(!showTeamRationale)}
          className="text-xs text-[#38BDF8] hover:underline flex items-center gap-1 font-semibold"
        >
          <span>Team Synergy Architecture</span>
          {showTeamRationale ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Team Architecture Synergy Rationale */}
      {showTeamRationale && (
        <div className="p-4 bg-[#11182B] border border-[#263550] rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#0B1020] border border-[#263550] rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider block">
              1. AI / ML Anchor
            </span>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
              Aarav anchors lightweight CNN models & 45 FPS edge CV inference.
            </p>
          </div>

          <div className="p-3 bg-[#0B1020] border border-[#263550] rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider block">
              2. Design & Polish
            </span>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
              Priya drives responsive mobile-first UI and farmer-accessible workflows.
            </p>
          </div>

          <div className="p-3 bg-[#0B1020] border border-[#263550] rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-[#22D3EE] uppercase tracking-wider block">
              3. Cloud & Ingest
            </span>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
              Rohan guarantees scalable PostgreSQL schema and REST API throughput.
            </p>
          </div>

          <div className="p-3 bg-[#0B1020] border border-[#263550] rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              4. Domain Validation
            </span>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
              Meera validates plant pathology taxonomy & realistic agronomy datasets.
            </p>
          </div>
        </div>
      )}

      {/* Squad Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {team.map((member) => {
          const reason = memberReasons[member.id];
          const fitScore = reason?.individualMatchScore || 92;

          return (
            <div
              key={member.id}
              className="p-5 bg-[#11182B] border border-[#263550] hover:border-[#38BDF8]/50 rounded-2xl shadow-xl transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* Member Top Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-[#38BDF8]/40 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#F8FAFC]">{member.name}</h4>
                        <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                          {fitScore}% FIT
                        </span>
                      </div>
                      <p className="text-xs text-[#38BDF8] font-medium mt-0.5">{member.role}</p>
                      <p className="text-[11px] text-[#94A3B8]">{member.university} • {member.year}</p>
                    </div>
                  </div>
                </div>

                {/* Primary Contribution Rationale */}
                <div className="p-2.5 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#CBD5E1]">
                  <span className="text-[#38BDF8] font-semibold block text-[11px] mb-0.5">Primary Contribution:</span>
                  {reason?.primaryContribution || 'Core engineering execution & system delivery.'}
                </div>

                {/* Skills with Dual Vector (Level & Interest) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-[#94A3B8]">
                    <span>Top Capabilities:</span>
                    <span>Proficiency / Interest</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.slice(0, 4).map(s => (
                      <span
                        key={s.name}
                        className="px-2.5 py-1 rounded-lg bg-[#17213A] border border-[#263550] text-[11px] text-[#CBD5E1] flex items-center gap-1.5"
                      >
                        <span className="font-medium text-[#F8FAFC]">{s.name}</span>
                        <span className="font-mono text-[#38BDF8] font-bold">{s.level}%</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Availability & Hackathon Stats */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="p-2 bg-[#17213A]/50 border border-[#263550] rounded-xl flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <div>
                      <div className="text-[10px] text-[#94A3B8]">Availability</div>
                      <div className="font-mono font-bold text-emerald-400">{member.availability.hoursPerWeek} hrs/wk</div>
                    </div>
                  </div>

                  <div className="p-2 bg-[#17213A]/50 border border-[#263550] rounded-xl flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <div>
                      <div className="text-[10px] text-[#94A3B8]">Hackathons</div>
                      <div className="font-mono font-bold text-amber-400">{member.experience.hackathonsWon} Won</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#263550] flex items-center justify-between gap-2">
                <button
                  id={`squad-why-match-${member.id}-btn`}
                  onClick={() => setSelectedStudentForWhyModal(member)}
                  className="px-3 py-1.5 rounded-xl bg-[#38BDF8]/15 hover:bg-[#38BDF8]/25 text-[#38BDF8] text-xs font-semibold border border-[#38BDF8]/30 flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span>Why This Match?</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onInspectStudent(member)}
                    className="px-3 py-1.5 rounded-xl bg-[#17213A] hover:bg-[#1D2942] text-[#CBD5E1] text-xs font-medium border border-[#263550] transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => onRemoveMember(member)}
                    className="px-2.5 py-1.5 rounded-xl bg-[#17213A] hover:bg-rose-500/20 text-[#94A3B8] hover:text-rose-400 text-xs font-medium border border-[#263550] transition-colors"
                    title="Remove from squad"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Studio Action Shortcuts */}
      <div className="p-4 bg-[#11182B] border border-[#263550] rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-[#CBD5E1]">
          Ready to test this team? Run resilience stress testing or inspect the full executive blueprint.
        </div>
        <div className="flex items-center gap-2">
          {onNavigateTab && (
            <>
              <button
                onClick={() => onNavigateTab('stress')}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Stress Test Studio</span>
              </button>

              <button
                onClick={() => onNavigateTab('blueprint')}
                className="px-3.5 py-1.5 rounded-xl bg-[#38BDF8] text-[#0B1020] text-xs font-bold hover:bg-[#22D3EE] flex items-center gap-1.5 transition-colors"
              >
                <span>View Team Blueprint</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Why This Match Modal */}
      {selectedStudentForWhyModal && (
        <WhyThisMatchModal
          isOpen={Boolean(selectedStudentForWhyModal)}
          onClose={() => setSelectedStudentForWhyModal(null)}
          student={selectedStudentForWhyModal}
          projectDNA={projectDNA}
          reason={memberReasons[selectedStudentForWhyModal.id]}
          team={team}
        />
      )}

    </div>
  );
};
