import React, { useState, useEffect } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  LandingHero 
} from './components/LandingHero';
import { 
  ProjectCreator 
} from './components/ProjectCreator';
import { 
  ProjectDNAPanel 
} from './components/ProjectDNAPanel';
import { 
  TeamScoreGauge 
} from './components/TeamScoreGauge';
import { 
  TeamSquadView 
} from './components/TeamSquadView';
import { 
  TeamBlueprint 
} from './components/TeamBlueprint';
import { 
  TaskDecomposition 
} from './components/TaskDecomposition';
import { 
  PlanBTeams 
} from './components/PlanBTeams';
import { 
  CandidateComparison 
} from './components/CandidateComparison';
import { 
  RiskRadar 
} from './components/RiskRadar';
import { 
  FinalTeamReport 
} from './components/FinalTeamReport';
import { 
  SkillCoverageMatrix 
} from './components/SkillCoverageMatrix';
import { 
  TeamStressTestStudio 
} from './components/TeamStressTestStudio';
import { 
  WhatIfStudio 
} from './components/WhatIfStudio';
import { 
  StudentPoolModal 
} from './components/StudentPoolModal';
import { 
  StudentProfileDrawer 
} from './components/StudentProfileDrawer';

import { ProjectDNA, StudentProfile, TeamMatchResult, TeamMetrics, ProjectRiskInfo } from './types';
import { FLAGSHIP_PROJECT, PRESET_PROJECTS } from './data/exampleProjects';
import { MOCK_STUDENTS } from './data/mockStudents';
import { 
  buildOptimalTeam, 
  calculateTeamMetrics, 
  calculateSkillCoverage,
  calculateProjectRisk,
  generateMemberSelectionReason 
} from './utils/matchingEngine';
import { 
  Dna, 
  Users, 
  Flame, 
  ShieldAlert, 
  Layers, 
  ArrowLeft, 
  Sparkles,
  RefreshCw,
  Award,
  ChevronRight,
  Sliders,
  CheckSquare,
  Scale,
  FileText,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'create' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<
    'squad' | 'blueprint' | 'tasks' | 'planb' | 'compare' | 'stress' | 'risk' | 'whatif' | 'report' | 'skills' | 'dna'
  >('squad');

  // Active Project & Match State
  const [projectDNA, setProjectDNA] = useState<ProjectDNA>(FLAGSHIP_PROJECT);
  const [matchResult, setMatchResult] = useState<TeamMatchResult>(() => buildOptimalTeam(FLAGSHIP_PROJECT, MOCK_STUDENTS, 4));
  const [activeSquad, setActiveSquad] = useState<StudentProfile[]>(matchResult.team);
  const [originalMetrics, setOriginalMetrics] = useState<TeamMetrics>(matchResult.metrics);

  // UI Modals & Drawers
  const [isStudentPoolOpen, setIsStudentPoolOpen] = useState(false);
  const [inspectedStudent, setInspectedStudent] = useState<StudentProfile | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [scoreNotification, setScoreNotification] = useState<string | null>(null);

  // Synchronize result when activeSquad changes
  const currentMetrics = calculateTeamMetrics(activeSquad, projectDNA);
  const { breakdown, gaps } = calculateSkillCoverage(activeSquad, projectDNA);
  const currentRisk: ProjectRiskInfo = calculateProjectRisk(activeSquad, projectDNA, breakdown);

  const memberReasons: Record<string, any> = {};
  for (const member of activeSquad) {
    memberReasons[member.id] = generateMemberSelectionReason(member, projectDNA, activeSquad);
  }

  // Action: Launch Flagship Demo Project
  const handleTryDemo = () => {
    const result = buildOptimalTeam(FLAGSHIP_PROJECT, MOCK_STUDENTS, 4);
    setProjectDNA(FLAGSHIP_PROJECT);
    setMatchResult(result);
    setActiveSquad(result.team);
    setOriginalMetrics(result.metrics);
    setActiveTab('squad');
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Action: Analyze custom project idea with Gemini AI or local heuristic
  const handleAnalyzeProject = async (projectInput: {
    name: string;
    description: string;
    category: string;
    teamSize: number;
    customSkills: string[];
  }) => {
    setIsLoadingAnalysis(true);
    try {
      const response = await fetch('/api/analyze-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectInput),
      });

      let analyzedDNA: ProjectDNA;

      if (response.ok) {
        const json = await response.json();
        analyzedDNA = json.data;
      } else {
        // Fallback DNA
        analyzedDNA = {
          id: `proj-${Date.now()}`,
          title: projectInput.name || 'Custom Innovation Project',
          description: projectInput.description,
          category: projectInput.category || 'AI & Full-Stack Engineering',
          complexity: 'Advanced',
          targetTeamSize: projectInput.teamSize || 4,
          summary: projectInput.description,
          requiredSkills: projectInput.customSkills.map((s, i) => ({
            name: s,
            importance: Math.max(60, 95 - i * 6),
            category: i % 2 === 0 ? 'AI & ML' : 'Backend & Cloud',
            description: `Core execution requirement for ${s}`,
          })),
          domainTags: projectInput.customSkills.slice(0, 4),
          keyChallenges: ['Cross-functional technical coordination and rapid milestone delivery'],
        };
      }

      setProjectDNA(analyzedDNA);
      const result = buildOptimalTeam(analyzedDNA, MOCK_STUDENTS, analyzedDNA.targetTeamSize);
      setMatchResult(result);
      setActiveSquad(result.team);
      setOriginalMetrics(result.metrics);
      setActiveTab('squad');
      setCurrentView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.warn('API call failed, running local engine:', err);
      // Fallback local match
      const fallbackDNA: ProjectDNA = {
        id: `proj-${Date.now()}`,
        title: projectInput.name || 'AgriVision AI Project',
        description: projectInput.description,
        category: projectInput.category || 'Applied AI',
        complexity: 'Advanced',
        targetTeamSize: projectInput.teamSize || 4,
        summary: projectInput.description,
        requiredSkills: FLAGSHIP_PROJECT.requiredSkills,
        domainTags: ['Applied AI', 'Prototyping'],
        keyChallenges: ['Rapid MVP development'],
      };

      setProjectDNA(fallbackDNA);
      const result = buildOptimalTeam(fallbackDNA, MOCK_STUDENTS, fallbackDNA.targetTeamSize);
      setMatchResult(result);
      setActiveSquad(result.team);
      setOriginalMetrics(result.metrics);
      setActiveTab('squad');
      setCurrentView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  // Action: Replace member in stress test
  const handleApplyReplacement = (oldMemberId: string, newMember: StudentProfile) => {
    const updated = activeSquad.map(m => m.id === oldMemberId ? newMember : m);
    setActiveSquad(updated);
    
    // Recalculate metrics
    const newMetrics = calculateTeamMetrics(updated, projectDNA);
    setScoreNotification(`Team Score updated to ${newMetrics.overallScore}%!`);
    setTimeout(() => setScoreNotification(null), 4000);
  };

  // Action: Adopt a Plan B Alternative Squad
  const handleAdoptPlanBTeam = (newTeam: StudentProfile[]) => {
    setActiveSquad(newTeam);
    const newMetrics = calculateTeamMetrics(newTeam, projectDNA);
    setScoreNotification(`Adopted alternative formation! Team Score is ${newMetrics.overallScore}%.`);
    setTimeout(() => setScoreNotification(null), 4000);
  };

  // Action: Reset squad to original optimal recommendation
  const handleResetSquad = () => {
    const result = buildOptimalTeam(projectDNA, MOCK_STUDENTS, projectDNA.targetTeamSize || 4);
    setActiveSquad(result.team);
    setOriginalMetrics(result.metrics);
    setScoreNotification(`Squad reset to original recommendation (${result.metrics.overallScore}%)`);
    setTimeout(() => setScoreNotification(null), 4000);
  };

  // Action: Add specialist to active squad
  const handleAddBenchMember = (student: StudentProfile) => {
    if (activeSquad.some(m => m.id === student.id)) return;
    const updated = [...activeSquad, student];
    setActiveSquad(updated);
    const newMetrics = calculateTeamMetrics(updated, projectDNA);
    setScoreNotification(`Added ${student.name} to active squad! Team Score is now ${newMetrics.overallScore}%.`);
    setTimeout(() => setScoreNotification(null), 4000);
  };

  // Action: Swap candidate into squad
  const handleSwapCandidate = (newCandidate: StudentProfile, oldMemberId?: string) => {
    if (activeSquad.some(m => m.id === newCandidate.id)) return;
    
    let updated: StudentProfile[];
    if (oldMemberId) {
      updated = activeSquad.map(m => m.id === oldMemberId ? newCandidate : m);
    } else if (activeSquad.length >= (projectDNA.targetTeamSize || 4)) {
      // Replace the last member by default
      updated = [...activeSquad.slice(0, -1), newCandidate];
    } else {
      updated = [...activeSquad, newCandidate];
    }

    setActiveSquad(updated);
    const newMetrics = calculateTeamMetrics(updated, projectDNA);
    setScoreNotification(`Swapped in ${newCandidate.name}! Team Score is ${newMetrics.overallScore}%.`);
    setTimeout(() => setScoreNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      
      {/* Frosted Glass Background Ambient Lighting Orbs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Top Sticky Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenPool={() => setIsStudentPoolOpen(true)}
        onTryDemo={handleTryDemo}
        onReset={handleResetSquad}
        hasActiveProject={Boolean(projectDNA)}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingHero
            onBuildTeam={() => setCurrentView('create')}
            onTryDemo={handleTryDemo}
            onSelectStudentProfile={(student) => setInspectedStudent(student)}
          />
        )}

        {currentView === 'create' && (
          <ProjectCreator
            onAnalyzeProject={handleAnalyzeProject}
            isLoading={isLoadingAnalysis}
            onSelectPreset={(preset) => {
              setProjectDNA(preset);
              const res = buildOptimalTeam(preset, MOCK_STUDENTS, preset.targetTeamSize);
              setMatchResult(res);
              setActiveSquad(res.team);
              setOriginalMetrics(res.metrics);
            }}
          />
        )}

        {currentView === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            
            {/* Top Project Breadcrumb & Quick Info Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-xl shadow-black/40">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView('create')}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 backdrop-blur-md transition-colors"
                  title="Edit or create new project"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      Active Project
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">• {projectDNA.category}</span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    {projectDNA.title}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="dashboard-new-idea-btn"
                  onClick={() => setCurrentView('create')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 backdrop-blur-md transition-colors"
                >
                  Change Idea
                </button>
                <button
                  id="dashboard-open-pool-btn"
                  onClick={() => setIsStudentPoolOpen(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 backdrop-blur-md flex items-center gap-1.5 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Student Pool</span>
                </button>
              </div>
            </div>

            {/* Score Notification Toast */}
            {scoreNotification && (
              <div className="p-3.5 rounded-2xl bg-cyan-950/60 backdrop-blur-xl border border-cyan-400/40 text-cyan-200 text-xs font-semibold flex items-center gap-2 shadow-xl animate-in fade-in slide-in-from-top-2">
                <Sparkles className="w-4 h-4 text-cyan-300 shrink-0" />
                <span>{scoreNotification}</span>
              </div>
            )}

            {/* Top Row: Circular Score Gauge (4-Factor Formula) + Project DNA Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <TeamScoreGauge
                  metrics={currentMetrics}
                  isStressTested={activeSquad.length < (projectDNA.targetTeamSize || 4)}
                />
              </div>
              <div className="lg:col-span-6">
                <ProjectDNAPanel
                  projectDNA={projectDNA}
                  onEditProject={() => setCurrentView('create')}
                />
              </div>
            </div>

            {/* Primary Dashboard Navigation Tabs */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
                <button
                  id="tab-squad-view-btn"
                  onClick={() => setActiveTab('squad')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border whitespace-nowrap ${
                    activeTab === 'squad'
                      ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-white/[0.03] text-neutral-300 hover:text-white border-white/10'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Active Squad ({activeSquad.length})</span>
                </button>

                <button
                  id="tab-blueprint-btn"
                  onClick={() => setActiveTab('blueprint')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border whitespace-nowrap ${
                    activeTab === 'blueprint'
                      ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-white/[0.03] text-neutral-300 hover:text-white border-white/10'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Team Blueprint</span>
                </button>

                <button
                  id="tab-tasks-btn"
                  onClick={() => setActiveTab('tasks')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border whitespace-nowrap ${
                    activeTab === 'tasks'
                      ? 'bg-purple-500 text-white border-purple-400 shadow-md shadow-purple-500/20'
                      : 'bg-white/[0.03] text-neutral-300 hover:text-white border-white/10'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5 text-purple-300" />
                  <span>Task Pipeline</span>
                </button>

                <button
                  id="tab-plan-b-btn"
                  onClick={() => setActiveTab('planb')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border whitespace-nowrap ${
                    activeTab === 'planb'
                      ? 'bg-blue-500 text-white border-blue-400 shadow-md shadow-blue-500/20'
                      : 'bg-white/[0.03] text-neutral-300 hover:text-white border-white/10'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                  <span>Plan B Teams</span>
                </button>

                <button
                  id="tab-candidate-compare-btn"
                  onClick={() => setActiveTab('compare')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border whitespace-nowrap ${
                    activeTab === 'compare'
                      ? 'bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-white/[0.03] text-neutral-300 hover:text-white border-white/10'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Compare Candidates</span>
                </button>

                <button
                  id="tab-stress-test-btn"
                  onClick={() => setActiveTab('stress')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border whitespace-nowrap ${
                    activeTab === 'stress'
                      ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-white/[0.03] text-neutral-300 hover:text-white border-white/10'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Stress Test</span>
                </button>

                <button
                  id="tab-risk-radar-btn"
                  onClick={() => setActiveTab('risk')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border whitespace-nowrap ${
                    activeTab === 'risk'
                      ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20'
                      : 'bg-white/[0.03] text-neutral-300 hover:text-white border-white/10'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Risk Radar & SPOF</span>
                </button>

                <button
                  id="tab-what-if-btn"
                  onClick={() => setActiveTab('whatif')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border whitespace-nowrap ${
                    activeTab === 'whatif'
                      ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-white/[0.03] text-neutral-300 hover:text-white border-white/10'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-300" />
                  <span>What-If?</span>
                </button>

                <button
                  id="tab-final-report-btn"
                  onClick={() => setActiveTab('report')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border whitespace-nowrap ${
                    activeTab === 'report'
                      ? 'bg-indigo-500 text-white border-indigo-400 shadow-md shadow-indigo-500/20'
                      : 'bg-white/[0.03] text-neutral-300 hover:text-white border-white/10'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Executive Dossier</span>
                </button>
              </div>
            </div>

            {/* Active Tab Views */}
            {activeTab === 'squad' && (
              <div className="space-y-8">
                <TeamSquadView
                  team={activeSquad}
                  projectDNA={projectDNA}
                  memberReasons={memberReasons}
                  onInspectStudent={(s) => setInspectedStudent(s)}
                  onRemoveMember={(s) => {
                    setActiveTab('stress');
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  onSwapMember={(s) => {
                    setActiveTab('stress');
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                />

                {/* Embedded Stress Test Preview Banner */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/20 to-black/40 backdrop-blur-2xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                      <Flame className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        Simulate Team Dropout & Resilience
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Test what happens if a core engineer leaves, review immediate score degradation, and deploy optimal replacements.
                      </p>
                    </div>
                  </div>

                  <button
                    id="trigger-stress-tab-from-squad-btn"
                    onClick={() => setActiveTab('stress')}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-amber-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-400/20 transition-all shrink-0 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <span>Launch Stress Test Studio</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'blueprint' && (
              <TeamBlueprint
                projectDNA={projectDNA}
                team={activeSquad}
                onSelectStudent={(s) => setInspectedStudent(s)}
              />
            )}

            {activeTab === 'tasks' && (
              <TaskDecomposition
                projectDNA={projectDNA}
                team={activeSquad}
                onFindSpecialist={(skill) => {
                  setIsStudentPoolOpen(true);
                }}
              />
            )}

            {activeTab === 'planb' && (
              <PlanBTeams
                projectDNA={projectDNA}
                activeSquad={activeSquad}
                onAdoptTeam={handleAdoptPlanBTeam}
                onSelectStudent={(s) => setInspectedStudent(s)}
              />
            )}

            {activeTab === 'compare' && (
              <CandidateComparison
                projectDNA={projectDNA}
                activeSquad={activeSquad}
                onSwapCandidate={handleSwapCandidate}
                onSelectStudent={(s) => setInspectedStudent(s)}
              />
            )}

            {activeTab === 'stress' && (
              <TeamStressTestStudio
                currentTeam={activeSquad}
                projectDNA={projectDNA}
                originalMetrics={originalMetrics}
                onApplyReplacement={handleApplyReplacement}
                onResetSquad={handleResetSquad}
                onInspectStudent={(s) => setInspectedStudent(s)}
              />
            )}

            {activeTab === 'risk' && (
              <RiskRadar
                projectDNA={projectDNA}
                team={activeSquad}
                onSelectStudent={(s) => setInspectedStudent(s)}
                onSimulateDropout={(studentId) => {
                  setActiveTab('stress');
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'whatif' && (
              <WhatIfStudio
                currentTeam={activeSquad}
                projectDNA={projectDNA}
                onApplySquad={(newSquad) => {
                  setActiveSquad(newSquad);
                  const newMetrics = calculateTeamMetrics(newSquad, projectDNA);
                  setScoreNotification(`Applied new squad composition! Team Score is now ${newMetrics.overallScore}%.`);
                  setTimeout(() => setScoreNotification(null), 4000);
                  setActiveTab('squad');
                }}
                onResetSquad={handleResetSquad}
                onInspectStudent={(s) => setInspectedStudent(s)}
              />
            )}

            {activeTab === 'report' && (
              <FinalTeamReport
                projectDNA={projectDNA}
                team={activeSquad}
                metrics={currentMetrics}
              />
            )}

            {activeTab === 'skills' && (
              <SkillCoverageMatrix
                breakdown={breakdown}
                gaps={gaps}
                riskInfo={currentRisk}
                onAddBenchMember={handleAddBenchMember}
                onInspectStudent={(s) => setInspectedStudent(s)}
              />
            )}

            {activeTab === 'dna' && (
              <ProjectDNAPanel
                projectDNA={projectDNA}
                onEditProject={() => setCurrentView('create')}
              />
            )}

          </div>
        )}
      </main>

      {/* Student Pool Directory Modal */}
      <StudentPoolModal
        isOpen={isStudentPoolOpen}
        onClose={() => setIsStudentPoolOpen(false)}
        onSelectStudent={(student) => {
          setInspectedStudent(student);
          setIsStudentPoolOpen(false);
        }}
        activeProjectDNA={projectDNA}
        activeTeam={activeSquad}
      />

      {/* Student Candidate Dossier Drawer */}
      <StudentProfileDrawer
        student={inspectedStudent}
        onClose={() => setInspectedStudent(null)}
        activeProjectDNA={projectDNA}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-neutral-400 bg-black/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-200">ProjectMatch</span>
            <span>— AI Team Formation Platform</span>
          </div>
          <div className="font-mono text-[11px] text-neutral-500">
            "Don't find the best people. Build the best team." • Synthetic demo profiles — prototype data
          </div>
        </div>
      </footer>

    </div>
  );
}
