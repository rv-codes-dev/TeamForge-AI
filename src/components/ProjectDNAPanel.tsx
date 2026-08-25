import React from 'react';
import { Dna, BarChart3, AlertCircle, Sparkles, Tag, Layers, RefreshCw } from 'lucide-react';
import { ProjectDNA } from '../types';

interface ProjectDNAPanelProps {
  projectDNA: ProjectDNA;
  onEditProject?: () => void;
}

export const ProjectDNAPanel: React.FC<ProjectDNAPanelProps> = ({
  projectDNA,
  onEditProject,
}) => {
  // Sort skills by importance descending
  const sortedSkills = [...projectDNA.requiredSkills].sort((a, b) => b.importance - a.importance);

  const getImportanceColor = (pct: number) => {
    if (pct >= 90) return 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30';
    if (pct >= 80) return 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30';
    if (pct >= 70) return 'text-purple-300 bg-purple-500/15 border-purple-500/30';
    return 'text-slate-300 bg-white/5 border-white/10';
  };

  const getBarGradient = (pct: number) => {
    if (pct >= 90) return 'from-cyan-400 to-indigo-500';
    if (pct >= 80) return 'from-indigo-400 to-purple-500';
    if (pct >= 70) return 'from-purple-400 to-pink-500';
    return 'from-slate-400 to-slate-500';
  };

  return (
    <div className="rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/15 p-6 sm:p-7 shadow-2xl shadow-black/50">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-white/10 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-500/30 backdrop-blur-sm flex items-center justify-center">
              <Dna className="w-3.5 h-3.5 text-cyan-300" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Project DNA & Architectural Breakdown
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            {projectDNA.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-white/[0.04] text-slate-300 border border-white/10 font-mono backdrop-blur-sm">
            {projectDNA.category}
          </span>
          <span className={`px-3 py-1 rounded-xl text-xs font-bold font-mono uppercase tracking-wider border backdrop-blur-sm ${
            projectDNA.complexity === 'Moonshot'
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
              : projectDNA.complexity === 'Advanced'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}>
            {projectDNA.complexity}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <p className="text-sm text-slate-300 leading-relaxed font-normal">
          {projectDNA.summary}
        </p>
      </div>

      {/* Required Skills Importance Distribution Grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
          <span className="flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Required Skills & Target Importance</span>
          </span>
          <span>Target Weight</span>
        </div>

        <div className="space-y-3">
          {sortedSkills.map((skill) => (
            <div
              key={skill.name}
              className="p-3.5 rounded-2xl bg-black/30 border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-tight">
                    {skill.name}
                  </span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold border backdrop-blur-sm ${getImportanceColor(skill.importance)}`}>
                    {skill.category}
                  </span>
                </div>
                <span className="text-sm font-extrabold font-mono text-cyan-300">
                  {skill.importance}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getBarGradient(skill.importance)} transition-all duration-700`}
                  style={{ width: `${skill.importance}%` }}
                />
              </div>

              {skill.description && (
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-1">
                  {skill.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Domain Tags & Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
        
        {/* Domain Tags */}
        <div>
          <span className="block font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Domain Tags
          </span>
          <div className="flex flex-wrap gap-1.5">
            {projectDNA.domainTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-slate-300 border border-white/10 text-[11px] font-medium backdrop-blur-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Key Challenges */}
        <div>
          <span className="block font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Key Architectural Challenges
          </span>
          <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
            {projectDNA.keyChallenges.map((challenge, idx) => (
              <li key={idx} className="line-clamp-1">
                {challenge}
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};
