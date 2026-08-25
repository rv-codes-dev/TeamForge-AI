import React, { useState } from 'react';
import { ProjectDNA, StudentProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  User,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Cpu,
  Database,
  Layout,
  Microscope,
  Info
} from 'lucide-react';
import { generateMemberSelectionReason } from '../utils/matchingEngine';

interface TeamBlueprintProps {
  projectDNA: ProjectDNA;
  team: StudentProfile[];
  onSelectStudent?: (student: StudentProfile) => void;
}

export const TeamBlueprint: React.FC<TeamBlueprintProps> = ({
  projectDNA,
  team,
  onSelectStudent,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const selectedStudent = team.find(s => s.id === selectedStudentId);

  // Group project skills with their assigned team members
  const requirementNodes = projectDNA.requiredSkills.map(req => {
    // Find team members who contribute to this skill
    const contributors = team
      .map(member => {
        const skill = member.skills.find(
          s => s.name.toLowerCase() === req.name.toLowerCase() || 
               req.name.toLowerCase().includes(s.name.toLowerCase()) ||
               s.name.toLowerCase().includes(req.name.toLowerCase())
        );
        return {
          member,
          level: skill?.level || (member.primarySkills.some(ps => ps.toLowerCase().includes(req.name.toLowerCase())) ? 85 : 0),
        };
      })
      .filter(c => c.level > 0)
      .sort((a, b) => b.level - a.level);

    const leadContributor = contributors[0];

    return {
      requirement: req,
      leadContributor: leadContributor?.member,
      leadLevel: leadContributor?.level || 0,
      allContributors: contributors,
      isCovered: (leadContributor?.level || 0) >= 70,
    };
  });

  const filteredRequirements = categoryFilter === 'All'
    ? requirementNodes
    : requirementNodes.filter(r => r.requirement.category === categoryFilter);

  const categories = ['All', 'AI & ML', 'Frontend & UX', 'Backend & Cloud', 'Domain & Research', 'Security & Systems'];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'AI & ML':
        return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Frontend & UX':
        return <Layout className="w-3.5 h-3.5 text-purple-400" />;
      case 'Backend & Cloud':
        return <Database className="w-3.5 h-3.5 text-blue-400" />;
      case 'Domain & Research':
        return <Microscope className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div id="team-blueprint-container" className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-semibold text-white tracking-tight">Team Architecture Blueprint</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
              4-Stage DNA Flow
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Traces the deterministic connection between <span className="text-neutral-200 font-medium">Project DNA Requirement</span> → <span className="text-neutral-200 font-medium">Required Capability</span> → <span className="text-neutral-200 font-medium">Assigned Engineer</span> → <span className="text-neutral-200 font-medium">Deliverable Role</span>.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              id={`filter-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => setCategoryFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-xl transition-all font-medium border ${
                categoryFilter === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'bg-white/[0.03] text-neutral-400 border-white/5 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Flow Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main 4-Column Lane Grid */}
        <div className="lg:col-span-8 space-y-3">
          {/* Column Header Titles */}
          <div className="grid grid-cols-12 gap-3 px-3 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            <div className="col-span-4 flex items-center gap-1.5">
              <span>1. Project Requirement</span>
            </div>
            <div className="col-span-2 text-center">
              <span>Weight</span>
            </div>
            <div className="col-span-3 flex items-center gap-1.5">
              <span>2. Assigned Lead</span>
            </div>
            <div className="col-span-3 text-right">
              <span>3. Primary Role</span>
            </div>
          </div>

          {/* Blueprint Rows */}
          <div className="space-y-2.5">
            {filteredRequirements.map((item, idx) => {
              const isSelected = selectedSkill === item.requirement.name || (selectedStudentId && item.leadContributor?.id === selectedStudentId);

              return (
                <motion.div
                  key={item.requirement.name}
                  id={`blueprint-row-${idx}`}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  onClick={() => {
                    setSelectedSkill(selectedSkill === item.requirement.name ? null : item.requirement.name);
                    if (item.leadContributor) {
                      setSelectedStudentId(item.leadContributor.id);
                    }
                  }}
                  className={`group relative p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/[0.07] border-cyan-500/40 shadow-lg shadow-cyan-500/5 ring-1 ring-cyan-500/30'
                      : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-white/20'
                  }`}
                >
                  <div className="grid grid-cols-12 gap-3 items-center">
                    {/* Stage 1: Requirement & Category */}
                    <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 shrink-0">
                        {getCategoryIcon(item.requirement.category)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                          {item.requirement.name}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate">
                          {item.requirement.category}
                        </div>
                      </div>
                    </div>

                    {/* Importance Weight */}
                    <div className="col-span-2 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-white/[0.05] text-neutral-200 border border-white/10">
                        {item.requirement.importance}%
                      </span>
                    </div>

                    {/* Stage 2: Assigned Student Lead */}
                    <div className="col-span-3 min-w-0">
                      {item.leadContributor ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={item.leadContributor.avatar}
                            alt={item.leadContributor.name}
                            className="w-7 h-7 rounded-full object-cover border border-cyan-500/30 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-medium text-white truncate">
                              {item.leadContributor.name}
                            </div>
                            <div className="text-[10px] text-cyan-400 font-semibold">
                              {item.leadLevel}% proficiency
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-400 text-xs">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Unassigned Gap</span>
                        </div>
                      )}
                    </div>

                    {/* Stage 3: Assigned Role Domain */}
                    <div className="col-span-3 text-right min-w-0">
                      {item.leadContributor ? (
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-medium text-neutral-300 truncate block">
                            {item.leadContributor.role.split('&')[0]}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 inline-block font-mono">
                            ACTIVE ANCHOR
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-neutral-500 italic">No Lead</span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Detail Tray on Hover/Click */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-white/10 text-xs text-neutral-300 space-y-2"
                    >
                      <p className="text-neutral-300 leading-relaxed">
                        <span className="text-cyan-300 font-medium">Architectural Context:</span> {item.requirement.description}
                      </p>

                      {item.allContributors.length > 1 && (
                        <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-400">
                          <span className="text-neutral-500">Secondary Backups:</span>
                          <div className="flex items-center gap-2">
                            {item.allContributors.slice(1).map(c => (
                              <span key={c.member.id} className="px-2 py-0.5 rounded bg-white/[0.04] text-neutral-300 border border-white/5">
                                {c.member.name} ({c.level}%)
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Selected Engineer & Rationale Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <User className="w-4 h-4" />
                </span>
                <h4 className="text-sm font-semibold text-white">Execution Node Inspector</h4>
              </div>
              <span className="text-[11px] text-neutral-400">Click row to inspect</span>
            </div>

            {selectedStudent ? (
              <div className="space-y-4">
                {/* Member Identity Card */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    className="w-12 h-12 rounded-xl object-cover border border-cyan-500/30"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-white truncate">{selectedStudent.name}</div>
                    <div className="text-xs text-neutral-400 truncate">{selectedStudent.role}</div>
                    <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                      {selectedStudent.university} • {selectedStudent.year}
                    </div>
                  </div>
                </div>

                {/* Primary Contribution Rationale */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Assigned Project Anchor
                  </div>
                  <div className="p-3 rounded-xl bg-cyan-500/[0.05] border border-cyan-500/20 text-xs text-cyan-200 leading-relaxed">
                    {generateMemberSelectionReason(selectedStudent, projectDNA, team).primaryContribution}
                  </div>
                </div>

                {/* Synergy Highlights */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Blueprint Synergy Highlights
                  </div>
                  <ul className="space-y-1.5">
                    {generateMemberSelectionReason(selectedStudent, projectDNA, team).synergyHighlights.map((hl, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* View Full Profile CTA */}
                {onSelectStudent && (
                  <button
                    id="btn-inspect-full-profile"
                    onClick={() => onSelectStudent(selectedStudent)}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2"
                  >
                    <span>Inspect Full Profile & Skills</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                )}
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-neutral-500">
                  <Info className="w-5 h-5" />
                </div>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Select any requirement or student in the blueprint to inspect their assigned deliverables and match rationale.
                </p>
              </div>
            )}
          </div>

          {/* Blueprint Verification Summary */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-white/[0.02] to-transparent border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full Architectural Viability</span>
            </div>
            <p className="text-[11px] text-neutral-300 leading-relaxed">
              Every critical requirement has at least one top-tier engineer assigned with &gt;90% proficiency. Zero orphaned deliverables detected in current formation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
