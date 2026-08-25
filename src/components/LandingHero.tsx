import React from 'react';
import { 
  Sparkles, 
  Zap, 
  Dna, 
  CheckCircle2, 
  LogIn, 
  UserPlus,
  Crown,
  Layers,
  ShieldCheck,
  Radar
} from 'lucide-react';

interface LandingHeroProps {
  onTryDemo: () => void;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onTryDemo,
  onOpenAuth,
}) => {
  return (
    <div className="relative overflow-hidden py-8 md:py-16">
      
      {/* Ambient Backdrop Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#38BDF8]/15 via-[#8B5CF6]/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 right-10 w-72 h-72 bg-[#22D3EE]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-64 left-10 w-72 h-72 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Main Hero Header Section */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#17213A]/80 border border-[#38BDF8]/30 text-xs font-semibold text-[#38BDF8] shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#22D3EE] animate-pulse" />
            <span>Next-Gen Team Intelligence & Squad Orchestration</span>
          </div>

          {/* Hero Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.08]">
            Don’t assemble people.{' '}
            <span className="block mt-2 bg-gradient-to-r from-[#38BDF8] via-[#818CF8] to-[#22D3EE] bg-clip-text text-transparent">
              Architect winning squads.
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-base sm:text-xl text-[#94A3B8] font-normal leading-relaxed max-w-2xl mx-auto">
            Deconstruct ideas into <strong className="text-[#38BDF8]">Project DNA</strong>, match complementary skillsets with explainable 5-factor synergy, and manage lead-approved squad rosters.
          </p>

          {/* Clean Primary Action Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
            <button
              id="hero-try-demo-btn"
              onClick={onTryDemo}
              className="px-7 py-3.5 rounded-2xl font-black text-sm text-[#0B1020] bg-gradient-to-r from-[#38BDF8] via-[#22D3EE] to-[#818CF8] hover:opacity-95 shadow-xl shadow-[#38BDF8]/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#0B1020]" />
              <span>Launch 10-Min Demo</span>
            </button>

            {onOpenAuth && (
              <>
                <button
                  id="hero-signup-btn"
                  onClick={() => onOpenAuth('signup')}
                  className="px-6 py-3.5 rounded-2xl font-bold text-sm text-[#F8FAFC] bg-[#17213A] hover:bg-[#1D2942] border border-[#263550] hover:border-[#38BDF8]/50 flex items-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <UserPlus className="w-4 h-4 text-[#8B5CF6]" />
                  <span>Create Account</span>
                </button>

                <button
                  id="hero-signin-btn"
                  onClick={() => onOpenAuth('signin')}
                  className="px-5 py-3.5 rounded-2xl font-semibold text-sm text-[#38BDF8] hover:text-[#22D3EE] bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 border border-[#38BDF8]/30 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              </>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-xs border-t border-[#263550]/80">
            <div className="p-2">
              <div className="text-xl font-mono font-bold text-[#F8FAFC]">100+</div>
              <div className="text-[#94A3B8] text-[11px] mt-0.5">Tech Stacks & Tools</div>
            </div>
            <div className="p-2">
              <div className="text-xl font-mono font-bold text-[#38BDF8]">5-Factor</div>
              <div className="text-[#94A3B8] text-[11px] mt-0.5">Explainable Synergy</div>
            </div>
            <div className="p-2">
              <div className="text-xl font-mono font-bold text-emerald-400">94%</div>
              <div className="text-[#94A3B8] text-[11px] mt-0.5">Optimal Squad Fit</div>
            </div>
            <div className="p-2">
              <div className="text-xl font-mono font-bold text-amber-400">Lead Desk</div>
              <div className="text-[#94A3B8] text-[11px] mt-0.5">Join Request Controls</div>
            </div>
          </div>
        </div>

        {/* 3-Step Squad Formation Architecture Workflow */}
        <div className="p-6 md:p-8 rounded-3xl bg-[#11182B]/90 border border-[#263550] shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#263550]">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 text-[10px] font-bold font-mono">
                  SQUAD FORMATION PIPELINE
                </span>
                <h3 className="text-base md:text-lg font-bold text-[#F8FAFC]">
                  How TeamForge AI Builds Resilient Teams
                </h3>
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">
                From project idea deconstruction to verified team chemistry and lead approvals.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Skill Gaps Guarantee</span>
              </span>
            </div>
          </div>

          {/* Non-repeating 3 Step Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#17213A]/60 border border-[#263550] space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
                  <Dna className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold text-[#94A3B8] px-2 py-0.5 rounded bg-[#11182B]">STEP 01</span>
              </div>
              <h4 className="text-xs font-bold text-[#F8FAFC]">1. Define Project DNA</h4>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Deconstruct project architecture into core capability pillars, tech priority weights, and target squad size to define exact hiring requirements.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#17213A]/60 border border-[#263550] space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold text-[#94A3B8] px-2 py-0.5 rounded bg-[#11182B]">STEP 02</span>
              </div>
              <h4 className="text-xs font-bold text-[#F8FAFC]">2. AI Complementary Matching</h4>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                5-factor synergy algorithm matches candidates covering anchor skills without redundant overlaps or single points of failure.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#17213A]/60 border border-[#263550] space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Crown className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold text-[#94A3B8] px-2 py-0.5 rounded bg-[#11182B]">STEP 03</span>
              </div>
              <h4 className="text-xs font-bold text-[#F8FAFC]">3. Team Lead Desk & Requests</h4>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Candidates send pitch notes directly to team heads, while leads review incoming applications with instant 1-click approvals.
              </p>
            </div>
          </div>
        </div>

        {/* Distinct Feature Capabilities (Unique & Non-Repeating) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-3xl bg-[#11182B] border border-[#263550] space-y-3 hover:border-[#38BDF8]/50 transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F8FAFC]">Full-Stack Coverage Matrix</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Verify complete coverage across frontend, backend, AI models, cloud deployment, and UI/UX so your team is never missing critical tech pillars.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#11182B] border border-[#263550] space-y-3 hover:border-[#8B5CF6]/50 transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] group-hover:scale-105 transition-transform">
              <Radar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F8FAFC]">Dropout & Stress Test Studio</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Simulate candidate dropouts or sudden role changes before hackathons start, receiving instant backup recommendations to keep project momentum.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#11182B] border border-[#263550] space-y-3 hover:border-emerald-400/50 transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F8FAFC]">Verified Student Profiles</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Showcase hackathon achievements, verified repositories, communication readiness ratings, and availability timeframes in rich candidate portfolios.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
