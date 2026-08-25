import React from 'react';
import { Users, Sparkles, Shield, RefreshCw, Cpu, Layers, FileText, Scale } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'create' | 'dashboard';
  setCurrentView: (view: 'landing' | 'create' | 'dashboard') => void;
  onOpenPool: () => void;
  onTryDemo: () => void;
  onReset: () => void;
  hasActiveProject: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenPool,
  onTryDemo,
  onReset,
  hasActiveProject,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/75 backdrop-blur-2xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <button
            id="nav-logo-btn"
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 text-left group transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/30 to-purple-500/20 border border-white/15 backdrop-blur-md flex items-center justify-center shadow-lg shadow-cyan-500/10 group-hover:border-cyan-400/50 transition-colors">
              <Sparkles className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-cyan-200 transition-colors">
                  ProjectMatch
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 backdrop-blur-sm font-mono">
                  AI Synergy
                </span>
              </div>
            </div>
          </button>

          <span className="hidden lg:inline-block text-xs text-neutral-400 pl-3 border-l border-white/10 font-medium">
            Don't find the best people. <span className="text-neutral-200 font-semibold">Build the best team.</span>
          </span>
        </div>

        {/* View Navigation & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="nav-student-pool-btn"
            onClick={onOpenPool}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 backdrop-blur-md flex items-center gap-1.5 transition-all"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Student Pool</span>
            <span className="px-1.5 py-0.2 bg-white/10 rounded-full text-[10px] text-neutral-300 font-mono">22</span>
          </button>

          {currentView !== 'landing' && (
            <button
              id="nav-landing-link"
              onClick={() => setCurrentView('landing')}
              className="hidden sm:inline-flex px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Home
            </button>
          )}

          {hasActiveProject && currentView !== 'dashboard' && (
            <button
              id="nav-view-dashboard-btn"
              onClick={() => setCurrentView('dashboard')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 backdrop-blur-md flex items-center gap-1.5 transition-all"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Active Team</span>
            </button>
          )}

          <button
            id="nav-try-demo-btn"
            onClick={onTryDemo}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-black bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 border border-cyan-300/40 shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all active:scale-95 backdrop-blur-sm"
          >
            <Cpu className="w-3.5 h-3.5 text-black" />
            <span className="hidden xs:inline">Demo:</span>
            <span>AgriVision AI</span>
          </button>

          {hasActiveProject && (
            <button
              id="nav-new-project-btn"
              onClick={() => setCurrentView('create')}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 backdrop-blur-md transition-all"
              title="Create New Project"
            >
              New Project
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
