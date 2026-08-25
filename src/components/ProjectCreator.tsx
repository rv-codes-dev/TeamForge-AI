import React, { useState } from 'react';
import { 
  Sparkles, 
  Dna, 
  Users, 
  Tag, 
  ArrowRight, 
  Lightbulb, 
  Plus, 
  X, 
  Loader2, 
  Layers, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { FLAGSHIP_PROJECT, PRESET_PROJECTS } from '../data/exampleProjects';
import { ProjectDNA } from '../types';

interface ProjectCreatorProps {
  onAnalyzeProject: (projectData: {
    name: string;
    description: string;
    category: string;
    teamSize: number;
    customSkills: string[];
  }) => Promise<void>;
  isLoading: boolean;
  onSelectPreset: (preset: ProjectDNA) => void;
}

export const ProjectCreator: React.FC<ProjectCreatorProps> = ({
  onAnalyzeProject,
  isLoading,
  onSelectPreset,
}) => {
  const [projectName, setProjectName] = useState('AgriVision AI — Crop Disease Detector');
  const [projectDescription, setProjectDescription] = useState(
    'Build an AI-powered crop disease detection platform where farmers upload crop images and the system identifies diseases early.'
  );
  const [category, setCategory] = useState('Agriculture & Computer Vision');
  const [teamSize, setTeamSize] = useState<number>(4);
  const [skillInput, setSkillInput] = useState('');
  const [customSkills, setCustomSkills] = useState<string[]>([
    'Computer Vision',
    'Machine Learning',
    'Python',
    'Agriculture',
    'Backend',
    'UI/UX',
  ]);

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !customSkills.includes(trimmed)) {
      setCustomSkills([...customSkills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCustomSkills(customSkills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectDescription.trim()) return;

    await onAnalyzeProject({
      name: projectName.trim() || 'Untitled Project',
      description: projectDescription.trim(),
      category: category.trim() || 'General AI / Tech',
      teamSize,
      customSkills,
    });
  };

  const handleApplyPreset = (preset: ProjectDNA) => {
    setProjectName(preset.title);
    setProjectDescription(preset.description);
    setCategory(preset.category);
    setTeamSize(preset.targetTeamSize || 4);
    setCustomSkills(preset.requiredSkills.map(s => s.name));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-300 mb-3 backdrop-blur-md">
          <Dna className="w-3.5 h-3.5 text-cyan-300" />
          <span>Step 1 of 2: Define Project Requirements</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Create & Analyze Project
        </h2>
        <p className="text-sm text-slate-300 mt-1">
          Enter your hackathon or startup concept. Our AI extracts required skill importance weightings and matches the ideal complementary squad.
        </p>
      </div>

      {/* Preset Quick-Pills */}
      <div className="mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Try Flagship or Preset Project Concepts</span>
          </div>
          <span className="text-[11px] text-slate-400">Click to autofill</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PRESET_PROJECTS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              id={`preset-btn-${preset.id}`}
              onClick={() => handleApplyPreset(preset)}
              className="text-left p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-blue-500/40 backdrop-blur-md transition-all group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {preset.title.split('—')[0]}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 font-mono border border-white/5">
                  {preset.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/60 space-y-6">
        
        {/* Project Name */}
        <div>
          <label htmlFor="project-name-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Project Name
          </label>
          <input
            id="project-name-input"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g. AgriVision AI, CyberShield, HealthTracker..."
            required
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium backdrop-blur-sm"
          />
        </div>

        {/* Project Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="project-description-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Project Description / Idea
            </label>
            <button
              type="button"
              id="try-example-project-btn"
              onClick={() => handleApplyPreset(FLAGSHIP_PROJECT)}
              className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition-colors"
            >
              Try Example Project
            </button>
          </div>
          <textarea
            id="project-description-input"
            rows={4}
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Describe what you want to build, who it is for, and key technical challenges..."
            required
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-normal leading-relaxed resize-none backdrop-blur-sm"
          />
          <p className="text-[11px] text-slate-400 mt-1.5">
            Example: "Build an AI-powered crop disease detection platform where farmers upload crop images and the system identifies diseases early."
          </p>
        </div>

        {/* Category and Team Size Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Category */}
          <div>
            <label htmlFor="project-category-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Category / Domain
            </label>
            <input
              id="project-category-input"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Agriculture & Computer Vision, Fintech, HealthTech..."
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all backdrop-blur-sm"
            />
          </div>

          {/* Team Size */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Target Team Size
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 4, 5, 6].map((size) => (
                <button
                  key={size}
                  type="button"
                  id={`team-size-btn-${size}`}
                  onClick={() => setTeamSize(size)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border backdrop-blur-sm ${
                    teamSize === size
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/20'
                      : 'bg-white/[0.04] text-slate-300 hover:text-white border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  {size} Members
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Initial Skills Tag Manager */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Target Required Skills (Auto-balanced by AI)
          </label>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {customSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/15 text-blue-200 border border-blue-500/30 text-xs font-medium backdrop-blur-sm"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-blue-400 hover:text-blue-100 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              id="skill-tag-input"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              placeholder="Add skill (e.g. PyTorch, Figma, SQL, Cybersecurity, Biology)..."
              className="flex-1 px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm"
            />
            <button
              type="button"
              id="add-skill-tag-btn"
              onClick={() => handleAddSkill()}
              className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-semibold text-slate-200 border border-white/10 backdrop-blur-sm flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Generates weighted Project DNA & tests 2,400+ team permutations</span>
          </div>

          <button
            type="submit"
            id="analyze-project-submit-btn"
            disabled={isLoading || !projectDescription.trim()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border border-blue-400/40 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none backdrop-blur-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
                <span>Deconstructing Project DNA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Analyze Project & Form Team</span>
                <ArrowRight className="w-4 h-4 text-blue-200" />
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
