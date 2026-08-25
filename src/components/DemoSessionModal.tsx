import React from 'react';
import { 
  Clock, 
  Sparkles, 
  UserPlus, 
  LogIn, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Home
} from 'lucide-react';

interface DemoSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignUp: () => void;
  onOpenSignIn: () => void;
  onRestartDemo: () => void;
  onGoToLanding: () => void;
}

export const DemoSessionModal: React.FC<DemoSessionModalProps> = ({
  isOpen,
  onClose,
  onOpenSignUp,
  onOpenSignIn,
  onRestartDemo,
  onGoToLanding,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#11182B] border-2 border-[#38BDF8]/40 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Glow Header Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-[#38BDF8]" />

        {/* Content Area */}
        <div className="p-6 sm:p-8 space-y-6 text-center">
          
          {/* Icon Badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-400/30 text-amber-400 shadow-lg shadow-amber-500/10 mx-auto">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide uppercase">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Time Limit Reached</span>
            </div>
            
            <h2 className="text-2xl font-black text-[#F8FAFC] tracking-tight">
              10-Minute Demo Session Ended
            </h2>
            
            <p className="text-xs sm:text-sm text-[#CBD5E1] max-w-md mx-auto leading-relaxed">
              Your 10-minute preview of <span className="text-[#38BDF8] font-bold">TeamForge AI</span> has completed. 
              Create your free student account or sign in to permanently save projects, manage squad rosters, and join hackathon teams.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="p-4 rounded-2xl bg-[#0B1020] border border-[#263550] text-left space-y-2.5 text-xs text-[#CBD5E1]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
              Unlock with a Free Account:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Unlimited Squad Formations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Permanent Team DNA Stats</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Real-time Join Requests</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Custom Avatar & Profile</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              id="demo-modal-signup-btn"
              onClick={() => {
                onClose();
                onOpenSignUp();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#38BDF8] via-[#22D3EE] to-[#8B5CF6] hover:opacity-95 text-[#0B1020] font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#38BDF8]/20 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Free Account (No Time Limit)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                id="demo-modal-signin-btn"
                onClick={() => {
                  onClose();
                  onOpenSignIn();
                }}
                className="py-2.5 px-3 rounded-xl bg-[#17213A] hover:bg-[#1D2942] border border-[#263550] text-[#CBD5E1] hover:text-[#F8FAFC] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Sign In</span>
              </button>

              <button
                id="demo-modal-restart-btn"
                onClick={() => {
                  onClose();
                  onRestartDemo();
                }}
                className="py-2.5 px-3 rounded-xl bg-[#17213A] hover:bg-[#1D2942] border border-[#38BDF8]/30 text-[#38BDF8] hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart 10-Min Demo</span>
              </button>
            </div>

            <button
              id="demo-modal-landing-btn"
              onClick={() => {
                onClose();
                onGoToLanding();
              }}
              className="pt-2 text-xs text-[#94A3B8] hover:text-[#CBD5E1] transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <Home className="w-3 h-3" />
              <span>Return to TeamForge Home</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
