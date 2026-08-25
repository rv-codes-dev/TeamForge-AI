import React from 'react';
import { 
  User, 
  Sparkles, 
  Layers, 
  Users, 
  Sliders, 
  ShieldCheck, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  Award, 
  Clock, 
  Zap, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FolderGit2,
  Camera
} from 'lucide-react';
import { UserProfile, ProjectDNA, StudentProfile } from '../types';

interface MemberHubViewProps {
  currentUser: UserProfile;
  activeProject: ProjectDNA;
  activeSquad: StudentProfile[];
  onNavigateTab: (tab: string) => void;
  onSelectProject: (proj: ProjectDNA) => void;
  allProjects: ProjectDNA[];
}

export const MemberHubView: React.FC<MemberHubViewProps> = ({
  currentUser,
  activeProject,
  activeSquad,
  onNavigateTab,
  onSelectProject,
  allProjects,
}) => {
  const dna = currentUser.teamDNA || {
    technicalStrength: 92,
    design: 70,
    research: 86,
    leadership: 84,
    collaboration: 90
  };

  const readiness = currentUser.completionPercentage || 94;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Hero Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#17213A] via-[#11182B] to-[#1E293B] border border-[#263550] shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#8B5CF6]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <button 
              type="button"
              onClick={() => onNavigateTab('edit-profile')}
              className="relative shrink-0 group cursor-pointer text-left focus:outline-none"
              title="Click to change profile picture in Edit Profile"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.fullName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#38BDF8] shadow-lg shadow-[#38BDF8]/20 group-hover:opacity-85 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-[#38BDF8] text-[#0B1020] shadow">
                <Camera className="w-3 h-3" />
              </div>
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] tracking-tight">
                  Welcome, {currentUser.fullName}!
                </h1>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                  {currentUser.isRealUser ? 'VERIFIED MEMBER' : 'DEMO ARCHITECT'}
                </span>
              </div>
              
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                {currentUser.department} • {currentUser.university} ({currentUser.year})
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#CBD5E1]">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Profile Calibrated ({readiness}%)
                </span>
                <span className="flex items-center gap-1.5 text-[#38BDF8]">
                  <Clock className="w-4 h-4 text-[#38BDF8]" />
                  {currentUser.availability?.hoursPerWeek || 25} hrs/wk Available
                </span>
                <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                  <Award className="w-4 h-4 text-amber-400" />
                  {currentUser.hackathonsWon || 0} Hackathon Podiums
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="memberhub-edit-profile-btn"
              onClick={() => onNavigateTab('edit-profile')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#F8FAFC] bg-[#1D2942] hover:bg-[#263550] border border-[#38BDF8]/30 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Sliders className="w-4 h-4 text-[#38BDF8]" />
              <span>Edit Profile & Team DNA</span>
            </button>
            <button
              onClick={() => onNavigateTab('squad')}
              className="px-5 py-2.5 rounded-xl text-xs font-black text-[#0B1020] bg-gradient-to-r from-[#38BDF8] to-[#22D3EE] hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-[#38BDF8]/20 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enter Match Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Active Squad Synergy */}
        <div className="p-6 rounded-2xl bg-[#11182B] border border-[#263550] space-y-4 hover:border-[#38BDF8]/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              {activeSquad.length} Teammates Selected
            </span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">Active Squad Formation</h3>
            <p className="text-xs text-[#94A3B8] mt-1">
              Currently matched for <span className="text-[#38BDF8] font-semibold">{activeProject.title}</span>.
            </p>
          </div>

          <div className="flex items-center -space-x-2 pt-1">
            {activeSquad.map((member, i) => (
              <img
                key={member.id}
                src={member.avatar}
                alt={member.name}
                title={`${member.name} (${member.role})`}
                className="w-9 h-9 rounded-xl object-cover border-2 border-[#11182B] shadow"
              />
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('squad')}
            className="w-full py-2 rounded-xl bg-[#17213A] hover:bg-[#1D2942] text-xs font-bold text-[#38BDF8] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Inspect Team Synergy</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: 5-Vector AI Team DNA */}
        <div className="p-6 rounded-2xl bg-[#11182B] border border-[#263550] space-y-4 hover:border-[#8B5CF6]/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center">
              <Sliders className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <span className="text-[10px] font-mono text-[#8B5CF6] font-bold px-2 py-0.5 rounded bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
              Tech: {dna.technicalStrength}%
            </span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">AI Team DNA Profile</h3>
            <p className="text-xs text-[#94A3B8] mt-1">
              Your multidimensional capability vector calibrated for maximum squad balance.
            </p>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] text-[#CBD5E1]">
              <span>Technical & Backend</span>
              <span className="font-mono font-bold text-[#38BDF8]">{dna.technicalStrength}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#0B1020] rounded-full overflow-hidden">
              <div className="h-full bg-[#38BDF8] rounded-full" style={{ width: `${dna.technicalStrength}%` }} />
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('edit-profile')}
            className="w-full py-2 rounded-xl bg-[#17213A] hover:bg-[#1D2942] text-xs font-bold text-[#8B5CF6] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Calibrate 5 Vectors</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Resilience & Stress Test */}
        <div className="p-6 rounded-2xl bg-[#11182B] border border-[#263550] space-y-4 hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-[10px] font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              Dropout Simulator
            </span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">Stress Test & Plan B</h3>
            <p className="text-xs text-[#94A3B8] mt-1">
              Test what happens if a core teammate drops out mid-hackathon.
            </p>
          </div>

          <p className="text-xs text-[#CBD5E1] pt-1">
            Simulate member departures and find instant 1-click bench replacements without dropping below target score.
          </p>

          <button
            onClick={() => onNavigateTab('stress')}
            className="w-full py-2 rounded-xl bg-[#17213A] hover:bg-[#1D2942] text-xs font-bold text-amber-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Launch Stress Studio</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Recommended Projects & Available Challenges */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#11182B] border border-[#263550] space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#38BDF8]" />
              Project DNA Architecture Catalog
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Select or decompose projects to assemble optimal multi-student teams.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('projects')}
            className="text-xs font-bold text-[#38BDF8] hover:underline cursor-pointer"
          >
            View All Projects →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allProjects.slice(0, 3).map(proj => {
            const isCurrent = proj.id === activeProject.id;
            return (
              <div
                key={proj.id}
                className={`p-5 rounded-2xl bg-[#0B1020] border transition-all space-y-3 relative flex flex-col justify-between ${
                  isCurrent 
                    ? 'border-[#38BDF8] shadow-md shadow-[#38BDF8]/10 ring-1 ring-[#38BDF8]/40' 
                    : 'border-[#263550] hover:border-[#38BDF8]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#17213A] text-[#38BDF8] border border-[#38BDF8]/20">
                      {proj.category}
                    </span>
                    <span className="text-[10px] text-[#94A3B8] font-mono">
                      Target: {proj.targetTeamSize} Members
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#F8FAFC] line-clamp-1">{proj.title}</h3>
                  <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">{proj.description}</p>
                </div>

                <div className="pt-2 border-t border-[#263550] flex items-center justify-between">
                  {isCurrent ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Match Project
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectProject(proj)}
                      className="text-xs font-bold text-[#38BDF8] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Match This Project</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
