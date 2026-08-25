import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Bell, 
  Check, 
  ChevronDown, 
  Layers, 
  User, 
  ShieldCheck, 
  Zap,
  Menu,
  X,
  Clock,
  Timer,
  AlertTriangle
} from 'lucide-react';
import { UserProfile, ProjectDNA } from '../types';

interface TopbarProps {
  currentUser: UserProfile | null;
  activeProject: ProjectDNA;
  allProjects: ProjectDNA[];
  onSelectProject: (proj: ProjectDNA) => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onFastTrackDemo: () => void;
  onSearchChange?: (q: string) => void;
  onToggleMobileMenu?: () => void;
  demoSecondsRemaining?: number | null;
  isDemoSession?: boolean;
  onRestartDemo?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentUser,
  activeProject,
  allProjects,
  onSelectProject,
  onOpenAuth,
  onOpenProfile,
  onFastTrackDemo,
  onSearchChange,
  onToggleMobileMenu,
  demoSecondsRemaining,
  isDemoSession,
  onRestartDemo,
}) => {
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    {
      id: 1,
      title: 'Flagship Match Completed',
      desc: 'Aarav, Priya, Rohan & Meera formed 94% synergistic AgriVision squad.',
      time: 'Just now',
      unread: true,
    },
    {
      id: 2,
      title: 'Resilience Index Updated',
      desc: 'Single Point of Failure (SPOF) mitigated with secondary PyTorch coverage.',
      time: '12m ago',
      unread: false,
    },
    {
      id: 3,
      title: 'Candidate Pool Synced',
      desc: '25 high-performing synthetic engineering profiles ready for match testing.',
      time: '1h ago',
      unread: false,
    },
  ];

  return (
    <header className="h-16 bg-[#11182B] border-b border-[#263550] px-4 md:px-6 flex items-center justify-between shrink-0 z-20">
      
      {/* Left: Mobile Menu Toggle & Project Switcher */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg bg-[#17213A] text-[#94A3B8] hover:text-[#F8FAFC]"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            id="topbar-project-select-btn"
            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#17213A] hover:bg-[#1D2942] border border-[#263550] text-xs font-semibold text-[#F8FAFC] transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="max-w-[140px] md:max-w-[200px] truncate">{activeProject.title}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
          </button>

          {showProjectDropdown && (
            <div className="absolute left-0 top-full mt-1.5 w-64 bg-[#11182B] border border-[#263550] rounded-xl shadow-2xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Switch Project DNA
              </div>
              {allProjects.map(proj => (
                <button
                  key={proj.id}
                  onClick={() => {
                    onSelectProject(proj);
                    setShowProjectDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#17213A] transition-colors ${
                    proj.id === activeProject.id ? 'text-[#38BDF8] font-bold bg-[#38BDF8]/10' : 'text-[#CBD5E1]'
                  }`}
                >
                  <span className="truncate">{proj.title}</span>
                  {proj.id === activeProject.id && <Check className="w-3.5 h-3.5 text-[#38BDF8]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Target Team Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#17213A] border border-[#263550] text-[11px] text-[#CBD5E1]">
          <span className="text-[#94A3B8]">Target Size:</span>
          <span className="font-mono text-[#38BDF8] font-bold">{activeProject.targetTeamSize} Members</span>
        </div>
      </div>

      {/* Middle: Search Input */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearchChange?.(e.target.value);
            }}
            placeholder="Search candidates, skills, domain expertise..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#38BDF8] transition-colors"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        
        {/* Live Demo Session 10-Minute Countdown Timer */}
        {isDemoSession && typeof demoSecondsRemaining === 'number' && (
          <div 
            title="10-Minute Demo Sandbox Timer. Create an account to remove the time limit."
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
              demoSecondsRemaining <= 60 
                ? 'bg-rose-500/15 border-rose-500/50 text-rose-400 animate-pulse'
                : demoSecondsRemaining <= 180
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-[#17213A] border-[#38BDF8]/40 text-[#38BDF8]'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${demoSecondsRemaining <= 60 ? 'text-rose-400' : demoSecondsRemaining <= 180 ? 'text-amber-400' : 'text-[#38BDF8]'}`} />
            <div className="flex items-center gap-1 text-xs">
              <span className="font-bold hidden sm:inline text-[11px] uppercase tracking-wider text-[#94A3B8]">
                Demo Limit:
              </span>
              <span className="font-mono font-black tracking-tight text-xs">
                {String(Math.floor(demoSecondsRemaining / 60)).padStart(2, '0')}:{String(demoSecondsRemaining % 60).padStart(2, '0')}
              </span>
            </div>
            {demoSecondsRemaining <= 180 && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="hidden md:inline-block ml-1 px-1.5 py-0.5 rounded bg-[#38BDF8] text-[#0B1020] font-black text-[10px] uppercase hover:bg-white transition-colors cursor-pointer"
              >
                Save
              </button>
            )}
          </div>
        )}

        {/* Fast-Track Demo Button (if not in demo or want to reload) */}
        {!isDemoSession && (
          <button
            id="topbar-fast-track-demo-btn"
            onClick={onFastTrackDemo}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#38BDF8]/20 to-[#22D3EE]/20 hover:from-[#38BDF8]/30 hover:to-[#22D3EE]/30 border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-[#38BDF8]/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span className="hidden sm:inline">Try 10-Min Demo</span>
            <span className="sm:hidden">Demo</span>
          </button>
        )}

        {/* Notifications Popover */}
        <div className="relative">
          <button
            id="topbar-notifications-btn"
            onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
            className="p-2 rounded-xl bg-[#17213A] border border-[#263550] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1D2942] transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#38BDF8] ring-2 ring-[#11182B]" />
          </button>

          {showNotificationDropdown && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#11182B] border border-[#263550] rounded-2xl shadow-2xl p-3 z-30 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#263550] mb-2">
                <span className="text-xs font-bold text-[#F8FAFC]">Live Team Events</span>
                <span className="text-[10px] text-[#38BDF8] font-semibold">1 Unread</span>
              </div>
              <div className="space-y-2">
                {notifications.map(n => (
                  <div 
                    key={n.id}
                    className={`p-2 rounded-xl text-xs space-y-1 transition-colors ${
                      n.unread ? 'bg-[#17213A] border border-[#38BDF8]/30' : 'bg-[#0B1020]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#F8FAFC]">{n.title}</span>
                      <span className="text-[10px] text-[#94A3B8]">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#CBD5E1] leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar / Sign In */}
        {currentUser ? (
          <button
            id="topbar-user-avatar-btn"
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-[#17213A] hover:bg-[#1D2942] border border-[#263550] transition-colors"
          >
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.fullName}
              className="w-6 h-6 rounded-lg object-cover border border-[#38BDF8]/40"
            />
            <span className="text-xs font-semibold text-[#F8FAFC] hidden sm:inline">
              {currentUser.fullName.split(' ')[0]}
            </span>
          </button>
        ) : (
          <button
            id="topbar-signin-btn"
            onClick={onOpenAuth}
            className="px-3 py-1.5 rounded-xl bg-[#38BDF8] hover:bg-[#22D3EE] text-[#0B1020] text-xs font-bold transition-colors"
          >
            Sign In
          </button>
        )}

      </div>
    </header>
  );
};
