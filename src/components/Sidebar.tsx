import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Sparkles, 
  Network, 
  CheckSquare, 
  ShieldAlert, 
  Activity, 
  AlertTriangle, 
  CopyCheck, 
  FileText, 
  Layers, 
  UserCheck, 
  Compass, 
  LogOut,
  LogIn,
  Sliders,
  ChevronRight,
  Radar,
  Crown,
  Clock
} from 'lucide-react';
import { UserProfile, ProjectDNA } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile | null;
  activeProject: ProjectDNA;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  demoSecondsRemaining?: number | null;
  isDemoSession?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  activeProject,
  onOpenAuth,
  onOpenProfile,
  onLogout,
  demoSecondsRemaining,
  isDemoSession,
}) => {
  const mainNavItems = [
    ...(currentUser ? [
      { id: 'member-hub', label: 'Member Hub', icon: Compass, badge: 'Home' },
      { id: 'edit-profile', label: 'Edit Profile & DNA', icon: Sliders, badge: 'Active' },
    ] : []),
    { id: 'groups', label: 'Open Squads & Leads', icon: Crown, badge: 'Requests' },
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'projects', label: 'Project DNA', icon: Layers, badge: 'Active' },
    { id: 'pool', label: 'Student Pool', icon: Users, badge: '25 Pool' },
  ];

  const intelligenceNavItems = [
    { id: 'squad', label: 'Match Analysis', icon: Sparkles, badge: '94%' },
    { id: 'blueprint', label: 'Team Blueprint', icon: Network, badge: null },
    { id: 'tasks', label: 'Task Pipeline', icon: CheckSquare, badge: '7 Tasks' },
    { id: 'skills', label: 'Skill Gaps & AI', icon: ShieldAlert, badge: 'Insights' },
    { id: 'health', label: 'Team Health & SPOF', icon: Activity, badge: '87/100' },
  ];

  const decisionNavItems = [
    { id: 'stress', label: 'Stress Test Studio', icon: AlertTriangle, badge: 'Simulate' },
    { id: 'planb', label: 'Plan B Formations', icon: CopyCheck, badge: '3 Squads' },
    { id: 'compare', label: 'Candidate Compare', icon: Sliders, badge: '3-Way' },
    { id: 'risk', label: 'Risk Radar', icon: Radar, badge: '5 Vectors' },
    { id: 'report', label: 'Executive Dossier', icon: FileText, badge: 'Export' },
  ];

  return (
    <aside className="w-64 bg-[#11182B] border-r border-[#263550] flex flex-col h-screen shrink-0 select-none">
      
      {/* Brand Header */}
      <div className="p-4 border-b border-[#263550] bg-[#0B1020]/40">
        <button
          id="sidebar-brand-btn"
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 w-full text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#38BDF8] via-[#8B5CF6] to-[#22D3EE] p-[1.5px] shadow-md shadow-[#38BDF8]/20 transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#11182B] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-[#F8FAFC]">
                TeamForge <span className="text-[#38BDF8]">AI</span>
              </span>
            </div>
            <p className="text-[10px] text-[#94A3B8] font-medium leading-none mt-0.5">
              Team Intelligence OS
            </p>
          </div>
        </button>
      </div>

      {/* Active Project Pill Indicator */}
      <div className="px-3.5 py-2.5 border-b border-[#263550]/60 bg-[#17213A]/40">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
            Active Project
          </span>
          <button
            onClick={() => setActiveTab('projects')}
            className="text-[10px] text-[#38BDF8] hover:underline flex items-center gap-0.5"
          >
            Switch
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs font-semibold text-[#F8FAFC] truncate">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="truncate">{activeProject.title}</span>
        </div>
      </div>

      {/* Navigation Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        
        {/* Section 1: Core */}
        <div>
          <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]/70">
            Workspace
          </span>
          <div className="mt-1 space-y-0.5">
            {mainNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}-btn`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#38BDF8]/15 text-[#38BDF8] font-semibold border border-[#38BDF8]/30 shadow-sm'
                      : 'text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#17213A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#38BDF8]' : 'text-[#94A3B8]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive ? 'bg-[#38BDF8] text-[#0B1020] font-bold' : 'bg-[#1D2942] text-[#94A3B8]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Team Intelligence */}
        <div>
          <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]/70">
            Team Intelligence
          </span>
          <div className="mt-1 space-y-0.5">
            {intelligenceNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}-btn`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#38BDF8]/15 text-[#38BDF8] font-semibold border border-[#38BDF8]/30 shadow-sm'
                      : 'text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#17213A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#38BDF8]' : 'text-[#94A3B8]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive ? 'bg-[#38BDF8] text-[#0B1020] font-bold' : 'bg-[#1D2942] text-[#94A3B8]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Resilience & Decisions */}
        <div>
          <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]/70">
            Resilience & Audit
          </span>
          <div className="mt-1 space-y-0.5">
            {decisionNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}-btn`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#38BDF8]/15 text-[#38BDF8] font-semibold border border-[#38BDF8]/30 shadow-sm'
                      : 'text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#17213A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#38BDF8]' : 'text-[#94A3B8]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive ? 'bg-[#38BDF8] text-[#0B1020] font-bold' : 'bg-[#1D2942] text-[#94A3B8]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* User Profile Card (Pinned Bottom) */}
      <div className="p-3 border-t border-[#263550] bg-[#0B1020]/60">
        {currentUser ? (
          <div className="p-2.5 rounded-xl bg-[#17213A] border border-[#263550] space-y-2">
            <div className="flex items-center justify-between">
              <button
                id="sidebar-profile-card-btn"
                onClick={onOpenProfile}
                className="flex items-center gap-2.5 text-left flex-1 min-w-0"
              >
                <div className="relative shrink-0">
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={currentUser.fullName}
                    className="w-8 h-8 rounded-lg object-cover border border-[#38BDF8]/40"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#11182B]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#F8FAFC] truncate">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] text-[#38BDF8] truncate font-medium">
                    {currentUser.teamDNA ? `DNA: ${currentUser.teamDNA.technicalStrength}% Tech` : 'Team Member'}
                  </div>
                </div>
              </button>
              
              <button
                id="sidebar-logout-btn"
                onClick={onLogout}
                title="Sign Out"
                className="p-1 rounded-lg text-[#94A3B8] hover:text-rose-400 hover:bg-[#1D2942] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* If in Demo Session, show sandbox badge */}
            {isDemoSession && typeof demoSecondsRemaining === 'number' && (
              <div className="px-2 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Clock className="w-3 h-3 animate-pulse" />
                  <span>Demo Sandbox</span>
                </div>
                <span className="font-mono font-bold text-amber-300">
                  {String(Math.floor(demoSecondsRemaining / 60)).padStart(2, '0')}:{String(demoSecondsRemaining % 60).padStart(2, '0')}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-[10px] text-[#94A3B8] pt-1 border-t border-[#263550]/60">
              <span>Readiness: <strong className="text-emerald-400 font-mono">{currentUser.completionPercentage || 94}%</strong></span>
              <button
                type="button"
                onClick={() => setActiveTab('edit-profile')}
                className="text-[10px] text-[#38BDF8] hover:underline font-semibold cursor-pointer"
              >
                Edit DNA →
              </button>
            </div>
          </div>
        ) : (
          <button
            id="sidebar-signin-btn"
            onClick={onOpenAuth}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#22D3EE] text-[#0B1020] text-xs font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md shadow-[#38BDF8]/10"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Create Account</span>
          </button>
        )}
      </div>

    </aside>
  );
};
