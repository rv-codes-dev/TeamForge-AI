import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { LandingHero } from './components/LandingHero';
import { ProjectCreator } from './components/ProjectCreator';
import { ProjectDNAPanel } from './components/ProjectDNAPanel';
import { TeamScoreGauge } from './components/TeamScoreGauge';
import { TeamSquadView } from './components/TeamSquadView';
import { TeamBlueprint } from './components/TeamBlueprint';
import { TaskDecomposition } from './components/TaskDecomposition';
import { PlanBTeams } from './components/PlanBTeams';
import { CandidateComparison } from './components/CandidateComparison';
import { RiskRadar } from './components/RiskRadar';
import { FinalTeamReport } from './components/FinalTeamReport';
import { SkillCoverageMatrix } from './components/SkillCoverageMatrix';
import { TeamStressTestStudio } from './components/TeamStressTestStudio';
import { WhatIfStudio } from './components/WhatIfStudio';
import { TalentPoolView } from './components/TalentPoolView';
import { StudentPoolModal } from './components/StudentPoolModal';
import { StudentProfileDrawer } from './components/StudentProfileDrawer';
import { AuthModal } from './components/AuthModal';
import { ProfileOnboardingModal } from './components/ProfileOnboardingModal';
import { UserProfileView } from './components/UserProfileView';
import { EditProfileView } from './components/EditProfileView';
import { MemberHubView } from './components/MemberHubView';
import { GroupsView } from './components/GroupsView';
import { DemoSessionModal } from './components/DemoSessionModal';

import { ProjectDNA, StudentProfile, TeamMatchResult, TeamMetrics, ProjectRiskInfo, UserProfile, TeamGroup, TeamGroupRequest } from './types';
import { FLAGSHIP_PROJECT, PRESET_PROJECTS } from './data/exampleProjects';
import { MOCK_STUDENTS } from './data/mockStudents';
import { INITIAL_TEAM_GROUPS } from './data/mockGroups';
import { 
  buildOptimalTeam, 
  calculateTeamMetrics, 
  calculateSkillCoverage,
  calculateProjectRisk,
  generateMemberSelectionReason 
} from './utils/matchingEngine';
import { Sparkles, Layers, ArrowLeft } from 'lucide-react';

const DEMO_USER: UserProfile = {
  id: 'demo-user-1',
  email: 'alex.chen@stanford.edu',
  fullName: 'Alex Chen',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  university: 'Stanford University',
  department: 'Computer Science (AI Track)',
  year: 'Senior (Year 4)',
  bio: 'Passionate about edge computer vision, federated learning, and full-stack AI deployment in resource-constrained environments.',
  skills: [
    { name: 'PyTorch', category: 'AI & ML', level: 94, interest: 96, verified: true },
    { name: 'Computer Vision', category: 'AI & ML', level: 92, interest: 95, verified: true },
    { name: 'TypeScript / React', category: 'Frontend & UX', level: 88, interest: 85, verified: true },
    { name: 'FastAPI & Python', category: 'Backend & Cloud', level: 90, interest: 90, verified: true },
    { name: 'PostgreSQL', category: 'Backend & Cloud', level: 82, interest: 78, verified: true },
  ],
  availability: {
    hoursPerWeek: 30,
    preferredTimezone: 'UTC-8 (PST)',
    weekendAvailability: true,
    customHoursPerWeek: 30,
  },
  hackathonsWon: 3,
  isRealUser: true,
  isDemo: true,
  completionPercentage: 96,
  teamDNA: {
    technicalStrength: 94,
    design: 72,
    research: 88,
    leadership: 86,
    collaboration: 92,
  },
  githubUrl: 'https://github.com/alexchen-ai',
  linkedinUrl: 'https://linkedin.com/in/alexchen-ai',
  portfolioUrl: 'https://alexchen.dev',
};

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'create' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<string>('groups');

  // User Auth & Profile State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('projectmatch_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEMO_USER;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isUserProfileViewOpen, setIsUserProfileViewOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDemoExpiredModalOpen, setIsDemoExpiredModalOpen] = useState(false);

  // 10-Minute Demo Sandbox Timer (600 seconds)
  const isDemoSession = Boolean(
    currentUser && (currentUser.isDemo || currentUser.id === 'demo-user-1' || currentUser.id === 'user-alex-rivera')
  );

  const [demoExpiresAt, setDemoExpiresAt] = useState<number | null>(() => {
    const savedExpires = localStorage.getItem('teamforge_demo_expires_at');
    if (savedExpires) {
      const num = parseInt(savedExpires, 10);
      if (!isNaN(num) && num > Date.now()) {
        return num;
      }
    }
    // If starting with default demo user
    const newExpires = Date.now() + 10 * 60 * 1000;
    localStorage.setItem('teamforge_demo_expires_at', newExpires.toString());
    return newExpires;
  });

  const [demoSecondsRemaining, setDemoSecondsRemaining] = useState<number | null>(() => {
    if (!localStorage.getItem('teamforge_demo_expires_at')) return 600;
    const exp = parseInt(localStorage.getItem('teamforge_demo_expires_at') || '0', 10);
    return Math.max(0, Math.ceil((exp - Date.now()) / 1000));
  });

  // Countdown timer effect
  useEffect(() => {
    if (!isDemoSession) {
      setDemoSecondsRemaining(null);
      return;
    }

    let targetExpires = demoExpiresAt;
    if (!targetExpires || targetExpires <= Date.now()) {
      targetExpires = Date.now() + 10 * 60 * 1000;
      setDemoExpiresAt(targetExpires);
      localStorage.setItem('teamforge_demo_expires_at', targetExpires.toString());
    }

    const updateRemaining = () => {
      const remainingMs = targetExpires! - Date.now();
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
      setDemoSecondsRemaining(remainingSec);

      if (remainingSec <= 0) {
        // Expire demo session!
        localStorage.removeItem('teamforge_demo_expires_at');
        localStorage.removeItem('projectmatch_user');
        setCurrentUser(null);
        setDemoExpiresAt(null);
        setDemoSecondsRemaining(0);
        setIsDemoExpiredModalOpen(true);
        setCurrentView('landing');
        setScoreNotification('Demo session has ended. Your 10-minute preview has expired.');
        setTimeout(() => setScoreNotification(null), 6000);
      }
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [isDemoSession, demoExpiresAt]);

  const handleRestartDemo = () => {
    const newExpires = Date.now() + 10 * 60 * 1000;
    setDemoExpiresAt(newExpires);
    localStorage.setItem('teamforge_demo_expires_at', newExpires.toString());
    const freshDemo = { ...DEMO_USER, isDemo: true };
    setCurrentUser(freshDemo);
    localStorage.setItem('projectmatch_user', JSON.stringify(freshDemo));
    setDemoSecondsRemaining(600);
    setIsDemoExpiredModalOpen(false);
    setCurrentView('dashboard');
    setActiveTab('groups');
    setScoreNotification('Fresh 10-minute demo session started!');
    setTimeout(() => setScoreNotification(null), 3000);
  };

  // Team Groups & Join Requests State
  const [teamGroups, setTeamGroups] = useState<TeamGroup[]>(() => {
    const saved = localStorage.getItem('teamforge_groups');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_TEAM_GROUPS;
  });

  const saveTeamGroups = (updated: TeamGroup[]) => {
    setTeamGroups(updated);
    localStorage.setItem('teamforge_groups', JSON.stringify(updated));
  };

  const handleSendJoinRequest = (
    groupId: string,
    requestData: Omit<TeamGroupRequest, 'id' | 'timestamp' | 'status'>
  ) => {
    const newRequest: TeamGroupRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      timestamp: 'Just now',
      status: 'pending',
    };

    const updated = teamGroups.map(g => {
      if (g.id === groupId) {
        const filtered = g.requests.filter(r => r.userEmail.toLowerCase() !== requestData.userEmail.toLowerCase());
        return {
          ...g,
          requests: [newRequest, ...filtered],
        };
      }
      return g;
    });

    saveTeamGroups(updated);
    const targetGroup = teamGroups.find(g => g.id === groupId);
    setScoreNotification(`Join request sent to ${targetGroup?.leadName} (Team Head of ${targetGroup?.name})!`);
    setTimeout(() => setScoreNotification(null), 4000);
  };

  const handleAcceptRequest = (groupId: string, requestId: string) => {
    const group = teamGroups.find(g => g.id === groupId);
    const req = group?.requests.find(r => r.id === requestId);
    if (!group || !req) return;

    const newMember = {
      id: req.userId,
      name: req.userName,
      email: req.userEmail,
      avatar: req.userAvatar,
      role: req.requestedRole,
      isLead: false,
      joinedAt: 'Just now',
      skills: req.skills,
      university: req.userUniversity,
    };

    const updated = teamGroups.map(g => {
      if (g.id === groupId) {
        const alreadyIn = g.members.some(m => m.id === req.userId || m.email?.toLowerCase() === req.userEmail.toLowerCase());
        const updatedMembers = alreadyIn ? g.members : [...g.members, newMember];
        const updatedRequests = g.requests.map(r => r.id === requestId ? { ...r, status: 'accepted' as const } : r);
        return {
          ...g,
          members: updatedMembers,
          requests: updatedRequests,
          status: updatedMembers.length >= g.maxMembers ? ('full' as const) : g.status,
        };
      }
      return g;
    });

    saveTeamGroups(updated);
    setScoreNotification(`Accepted ${req.userName} into ${group.name}! Roster updated.`);
    setTimeout(() => setScoreNotification(null), 4000);
  };

  const handleRejectRequest = (groupId: string, requestId: string, reason?: string) => {
    const group = teamGroups.find(g => g.id === groupId);
    const req = group?.requests.find(r => r.id === requestId);
    if (!group || !req) return;

    const updated = teamGroups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          requests: g.requests.map(r => r.id === requestId ? { ...r, status: 'rejected' as const, rejectionReason: reason } : r),
        };
      }
      return g;
    });

    saveTeamGroups(updated);
    setScoreNotification(`Declined join request from ${req.userName}.`);
    setTimeout(() => setScoreNotification(null), 3000);
  };

  const handleCreateGroup = (newGroupData: Omit<TeamGroup, 'id' | 'createdAt' | 'requests' | 'members'>) => {
    const newGroup: TeamGroup = {
      ...newGroupData,
      id: `group-${Date.now()}`,
      createdAt: 'Just now',
      requests: [],
      members: [
        {
          id: newGroupData.leadId,
          name: newGroupData.leadName,
          email: newGroupData.leadEmail,
          avatar: newGroupData.leadAvatar,
          role: newGroupData.leadRole,
          isLead: true,
          joinedAt: 'Just now',
          skills: currentUser?.skills.map(s => s.name) || ['System Architecture', 'Leadership'],
          university: currentUser?.university || 'University Student',
        }
      ],
    };

    const updated = [newGroup, ...teamGroups];
    saveTeamGroups(updated);
    setActiveTab('groups');
    setScoreNotification(`Created squad "${newGroup.name}"! You are the Team Head.`);
    setTimeout(() => setScoreNotification(null), 4000);
  };

  // Active Project & Match State
  const [allProjects, setAllProjects] = useState<ProjectDNA[]>([FLAGSHIP_PROJECT, ...PRESET_PROJECTS]);
  const [projectDNA, setProjectDNA] = useState<ProjectDNA>(FLAGSHIP_PROJECT);
  const [matchResult, setMatchResult] = useState<TeamMatchResult>(() => buildOptimalTeam(FLAGSHIP_PROJECT, MOCK_STUDENTS, 4));
  const [activeSquad, setActiveSquad] = useState<StudentProfile[]>(matchResult.team);
  const [originalMetrics, setOriginalMetrics] = useState<TeamMetrics>(matchResult.metrics);

  // UI Modals & Drawers
  const [isStudentPoolOpen, setIsStudentPoolOpen] = useState(false);
  const [inspectedStudent, setInspectedStudent] = useState<StudentProfile | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [scoreNotification, setScoreNotification] = useState<string | null>(null);

  // Metrics & Risks
  const currentMetrics = calculateTeamMetrics(activeSquad, projectDNA);
  const { breakdown, gaps } = calculateSkillCoverage(activeSquad, projectDNA);
  const currentRisk: ProjectRiskInfo = calculateProjectRisk(activeSquad, projectDNA, breakdown);

  const memberReasons: Record<string, any> = {};
  for (const member of activeSquad) {
    memberReasons[member.id] = generateMemberSelectionReason(member, projectDNA, activeSquad);
  }

  // Handle Login / Registration success
  const handleAuthSuccess = (user: UserProfile) => {
    if (user.isDemo) {
      const newExpires = Date.now() + 10 * 60 * 1000;
      setDemoExpiresAt(newExpires);
      localStorage.setItem('teamforge_demo_expires_at', newExpires.toString());
      setDemoSecondsRemaining(600);
    } else {
      localStorage.removeItem('teamforge_demo_expires_at');
      setDemoExpiresAt(null);
      setDemoSecondsRemaining(null);
    }

    setCurrentUser(user);
    localStorage.setItem('projectmatch_user', JSON.stringify(user));
    setIsAuthModalOpen(false);
    setCurrentView('dashboard');
    setActiveTab('groups');
    setScoreNotification(`Welcome, ${user.fullName}! Your TeamForge workspace & Squad Desk are ready.`);
    setTimeout(() => setScoreNotification(null), 4000);
    if (!user.teamDNA || (user.completionPercentage || 0) < 60) {
      setIsOnboardingModalOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('projectmatch_user');
    localStorage.removeItem('teamforge_demo_expires_at');
    setDemoExpiresAt(null);
    setDemoSecondsRemaining(null);
    setCurrentUser(null);
    setCurrentView('landing');
    setActiveTab('groups');
    setScoreNotification('You have been signed out securely. All session credentials removed.');
    setTimeout(() => setScoreNotification(null), 3000);
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setCurrentUser(updatedProfile);
    localStorage.setItem('projectmatch_user', JSON.stringify(updatedProfile));
    setScoreNotification(`Profile & Team DNA updated for ${updatedProfile.fullName}!`);
    setTimeout(() => setScoreNotification(null), 4000);
  };

  const handleSaveOnboardingProfile = (updatedProfile: UserProfile) => {
    setCurrentUser(updatedProfile);
    localStorage.setItem('projectmatch_user', JSON.stringify(updatedProfile));
    setIsOnboardingModalOpen(false);
    setScoreNotification('Profile and Team DNA successfully calibrated!');
    setTimeout(() => setScoreNotification(null), 4000);
  };

  // Launch Flagship Demo
  const handleTryDemo = () => {
    const newExpires = Date.now() + 10 * 60 * 1000;
    setDemoExpiresAt(newExpires);
    localStorage.setItem('teamforge_demo_expires_at', newExpires.toString());
    const freshDemo = { ...DEMO_USER, isDemo: true };
    setCurrentUser(freshDemo);
    localStorage.setItem('projectmatch_user', JSON.stringify(freshDemo));
    setDemoSecondsRemaining(600);

    const result = buildOptimalTeam(FLAGSHIP_PROJECT, MOCK_STUDENTS, 4);
    setProjectDNA(FLAGSHIP_PROJECT);
    setMatchResult(result);
    setActiveSquad(result.team);
    setOriginalMetrics(result.metrics);
    setActiveTab('squad');
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch Active Project
  const handleSelectProject = (proj: ProjectDNA) => {
    setProjectDNA(proj);
    const result = buildOptimalTeam(proj, MOCK_STUDENTS, proj.targetTeamSize || 4);
    setMatchResult(result);
    setActiveSquad(result.team);
    setOriginalMetrics(result.metrics);
  };

  // Change Team Target Size
  const handleTargetSizeChange = (newSize: number) => {
    const updatedDNA = { ...projectDNA, targetTeamSize: newSize };
    setProjectDNA(updatedDNA);
    const result = buildOptimalTeam(updatedDNA, MOCK_STUDENTS, newSize);
    setActiveSquad(result.team);
    setOriginalMetrics(result.metrics);
    setScoreNotification(`Optimized squad for target team size of ${newSize} members (${result.metrics.overallScore}%)`);
    setTimeout(() => setScoreNotification(null), 4000);
  };

  // Analyze Custom Project Idea
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
            importance: Math.max(65, 95 - i * 6),
            category: i % 2 === 0 ? 'AI & ML' : 'Backend & Cloud',
            description: `Core execution requirement for ${s}`,
          })),
          domainTags: projectInput.customSkills.slice(0, 4),
          keyChallenges: ['Cross-functional technical coordination and rapid milestone delivery'],
        };
      }

      setAllProjects(prev => [analyzedDNA, ...prev]);
      setProjectDNA(analyzedDNA);
      const result = buildOptimalTeam(analyzedDNA, MOCK_STUDENTS, analyzedDNA.targetTeamSize);
      setMatchResult(result);
      setActiveSquad(result.team);
      setOriginalMetrics(result.metrics);
      setActiveTab('squad');
      setCurrentView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.warn('API call fallback:', err);
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

  // Replace Member in Stress Test
  const handleApplyReplacement = (oldMemberId: string, newMember: StudentProfile) => {
    const updated = activeSquad.map(m => m.id === oldMemberId ? newMember : m);
    setActiveSquad(updated);
    const newMetrics = calculateTeamMetrics(updated, projectDNA);
    setScoreNotification(`Team Score updated to ${newMetrics.overallScore}%!`);
    setTimeout(() => setScoreNotification(null), 4000);
  };

  // Adopt Alternative Squad
  const handleAdoptPlanBTeam = (newTeam: StudentProfile[]) => {
    setActiveSquad(newTeam);
    const newMetrics = calculateTeamMetrics(newTeam, projectDNA);
    setScoreNotification(`Adopted alternative formation! Team Score is ${newMetrics.overallScore}%.`);
    setTimeout(() => setScoreNotification(null), 4000);
  };

  // Reset Squad
  const handleResetSquad = () => {
    const result = buildOptimalTeam(projectDNA, MOCK_STUDENTS, projectDNA.targetTeamSize || 4);
    setActiveSquad(result.team);
    setOriginalMetrics(result.metrics);
    setScoreNotification(`Squad reset to optimal recommendation (${result.metrics.overallScore}%)`);
    setTimeout(() => setScoreNotification(null), 4000);
  };

  // Add Specialist to Active Squad
  const handleAddBenchMember = (student: StudentProfile) => {
    if (activeSquad.some(m => m.id === student.id)) return;
    const updated = [...activeSquad, student];
    setActiveSquad(updated);
    const newMetrics = calculateTeamMetrics(updated, projectDNA);
    setScoreNotification(`Added ${student.name} to active squad! Team Score is now ${newMetrics.overallScore}%.`);
    setTimeout(() => setScoreNotification(null), 4000);
  };

  // Swap Candidate
  const handleSwapCandidate = (newCandidate: StudentProfile, oldMemberId?: string) => {
    if (activeSquad.some(m => m.id === newCandidate.id)) return;
    
    let updated: StudentProfile[];
    if (oldMemberId) {
      updated = activeSquad.map(m => m.id === oldMemberId ? newCandidate : m);
    } else if (activeSquad.length >= (projectDNA.targetTeamSize || 4)) {
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
    <div className={`min-h-screen bg-[#0B1020] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#38BDF8]/30 selection:text-[#38BDF8] ${currentView === 'dashboard' ? 'h-screen overflow-hidden' : ''}`}>
      
      {/* View 1: Public Landing Hero */}
      {currentView === 'landing' && (
        <div className="flex-1 flex flex-col justify-between">
          <header className="px-6 py-4 border-b border-[#263550] bg-[#11182B]/60 backdrop-blur-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#38BDF8] to-[#8B5CF6] p-[1.5px] shadow-sm">
                <div className="w-full h-full bg-[#11182B] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                </div>
              </div>
              <span className="text-sm font-bold text-[#F8FAFC]">
                TeamForge <span className="text-[#38BDF8]">AI</span>
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  setAuthModalMode('signin');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#CBD5E1] hover:text-[#F8FAFC] bg-[#17213A] border border-[#263550] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={handleTryDemo}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#0B1020] bg-gradient-to-r from-[#38BDF8] to-[#22D3EE] hover:opacity-95 transition-all shadow-md shadow-[#38BDF8]/20"
              >
                Launch Studio
              </button>
            </div>
          </header>

          <LandingHero
            onTryDemo={handleTryDemo}
            onOpenAuth={(mode) => {
              setAuthModalMode(mode);
              setIsAuthModalOpen(true);
            }}
          />

          <footer className="border-t border-[#263550] py-6 px-6 text-center text-xs text-[#94A3B8] bg-[#0B1020]">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="font-semibold text-[#CBD5E1]">
                TeamForge AI • "Don't find the best people. Build the best team."
              </div>
              <div className="text-[11px] text-[#94A3B8]">
                Midnight Aurora Design System • Synthetic Profiles for Hackathons & Innovation
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* View 2: Project DNA Creator Form */}
      {currentView === 'create' && (
        <div className="flex-1 flex flex-col">
          <header className="px-6 py-4 border-b border-[#263550] bg-[#11182B] flex items-center justify-between">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-2 text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Workspace</span>
            </button>
            <span className="text-xs font-bold text-[#F8FAFC]">Deconstruct New Project DNA</span>
            <div className="w-12" />
          </header>

          <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
            <ProjectCreator
              onAnalyzeProject={handleAnalyzeProject}
              isLoading={isLoadingAnalysis}
              onSelectPreset={(preset) => {
                setProjectDNA(preset);
                const res = buildOptimalTeam(preset, MOCK_STUDENTS, preset.targetTeamSize);
                setMatchResult(res);
                setActiveSquad(res.team);
                setOriginalMetrics(res.metrics);
                setCurrentView('dashboard');
              }}
            />
          </div>
        </div>
      )}

      {/* View 3: SaaS Studio Workspace */}
      {currentView === 'dashboard' && (
        <div className="flex-1 flex h-screen w-full overflow-hidden">
          
          {/* Left Sidebar (Fixed & Non-moving on the left) */}
          <div className={`${isMobileMenuOpen ? 'block fixed inset-0 z-40' : 'hidden md:block'} shrink-0 h-screen sticky top-0 left-0`}>
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }}
              currentUser={currentUser}
              activeProject={projectDNA}
              onOpenAuth={() => {
                setAuthModalMode('signin');
                setIsAuthModalOpen(true);
              }}
              onOpenProfile={() => {
                if (currentUser) setIsUserProfileViewOpen(true);
                else setIsAuthModalOpen(true);
              }}
              onLogout={handleLogout}
              demoSecondsRemaining={demoSecondsRemaining}
              isDemoSession={isDemoSession}
            />
          </div>

          {/* Right Main Canvas (Only this part moves and scrolls) */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#0B1020] h-screen overflow-hidden">
            
            {/* Topbar Header (Fixed top bar on the right canvas) */}
            <div className="shrink-0 z-20 sticky top-0">
              <Topbar
                currentUser={currentUser}
                activeProject={projectDNA}
                allProjects={allProjects}
                onSelectProject={handleSelectProject}
                onOpenAuth={() => {
                  setAuthModalMode('signin');
                  setIsAuthModalOpen(true);
                }}
                onOpenProfile={() => {
                  if (currentUser) setIsUserProfileViewOpen(true);
                  else setIsAuthModalOpen(true);
                }}
                onFastTrackDemo={handleTryDemo}
                onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                demoSecondsRemaining={demoSecondsRemaining}
                isDemoSession={isDemoSession}
                onRestartDemo={handleRestartDemo}
              />
            </div>

            {/* Notification Toast */}
            {scoreNotification && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-[#17213A] border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in shrink-0">
                <Sparkles className="w-4 h-4 text-[#22D3EE] shrink-0" />
                <span>{scoreNotification}</span>
              </div>
            )}

            {/* Scrollable View Content (The only scrolling area) */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 overscroll-contain">
              
              {/* View: Open Squads, Groups & Team Lead Desk */}
              {activeTab === 'groups' && (
                <GroupsView
                  groups={teamGroups}
                  currentUser={currentUser}
                  onSendJoinRequest={handleSendJoinRequest}
                  onAcceptRequest={handleAcceptRequest}
                  onRejectRequest={handleRejectRequest}
                  onCreateGroup={handleCreateGroup}
                  onOpenAuthModal={() => {
                    setAuthModalMode('signin');
                    setIsAuthModalOpen(true);
                  }}
                />
              )}

              {/* View: Member Hub (Default view after sign-in) */}
              {activeTab === 'member-hub' && currentUser && (
                <MemberHubView
                  currentUser={currentUser}
                  activeProject={projectDNA}
                  activeSquad={activeSquad}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onSelectProject={handleSelectProject}
                  allProjects={allProjects}
                />
              )}

              {/* View: Dedicated Edit Profile Window / Screen */}
              {activeTab === 'edit-profile' && currentUser && (
                <EditProfileView
                  currentUser={currentUser}
                  onSaveProfile={handleSaveProfile}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {/* Top Overview Cards on Dashboard/Squad View */}
              {(activeTab === 'squad' || activeTab === 'dashboard') && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-6">
                    <TeamScoreGauge
                      metrics={currentMetrics}
                      isStressTested={activeSquad.length < (projectDNA.targetTeamSize || 4)}
                      riskInfo={currentRisk}
                    />
                  </div>
                  <div className="lg:col-span-6">
                    <ProjectDNAPanel
                      projectDNA={projectDNA}
                      onEditProject={() => setCurrentView('create')}
                    />
                  </div>
                </div>
              )}

              {/* View Routing */}
              {(activeTab === 'squad' || activeTab === 'dashboard') && (
                <TeamSquadView
                  team={activeSquad}
                  projectDNA={projectDNA}
                  memberReasons={memberReasons}
                  onInspectStudent={(s) => setInspectedStudent(s)}
                  onRemoveMember={(s) => {
                    setActiveTab('stress');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onSwapMember={(s) => {
                    setActiveTab('stress');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onTargetSizeChange={handleTargetSizeChange}
                  onNavigateTab={(t) => setActiveTab(t)}
                />
              )}

              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-[#F8FAFC]">Project DNA Architecture</h2>
                    <button
                      onClick={() => setCurrentView('create')}
                      className="px-4 py-2 rounded-xl bg-[#38BDF8] text-[#0B1020] text-xs font-bold hover:bg-[#22D3EE] transition-colors"
                    >
                      + Deconstruct New Project
                    </button>
                  </div>
                  <ProjectDNAPanel
                    projectDNA={projectDNA}
                    onEditProject={() => setCurrentView('create')}
                  />
                </div>
              )}

              {activeTab === 'pool' && (
                <TalentPoolView
                  activeProjectDNA={projectDNA}
                  activeTeam={activeSquad}
                  onSelectStudent={(s) => setInspectedStudent(s)}
                  onAddSpecialistToTeam={handleAddBenchMember}
                  onCompareStudent={(s) => {
                    setActiveTab('compare');
                  }}
                />
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

              {activeTab === 'skills' && (
                <SkillCoverageMatrix
                  breakdown={breakdown}
                  gaps={gaps}
                  riskInfo={currentRisk}
                  onAddBenchMember={handleAddBenchMember}
                  onInspectStudent={(s) => setInspectedStudent(s)}
                />
              )}

              {activeTab === 'health' && (
                <RiskRadar
                  projectDNA={projectDNA}
                  team={activeSquad}
                  onSelectStudent={(s) => setInspectedStudent(s)}
                  onSimulateDropout={(studentId) => {
                    setActiveTab('stress');
                  }}
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

              {activeTab === 'risk' && (
                <RiskRadar
                  projectDNA={projectDNA}
                  team={activeSquad}
                  onSelectStudent={(s) => setInspectedStudent(s)}
                  onSimulateDropout={(studentId) => {
                    setActiveTab('stress');
                  }}
                />
              )}

              {activeTab === 'report' && (
                <FinalTeamReport
                  projectDNA={projectDNA}
                  team={activeSquad}
                  metrics={currentMetrics}
                />
              )}

            </div>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />

      <ProfileOnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        currentUser={currentUser || DEMO_USER}
        onSaveProfile={handleSaveOnboardingProfile}
      />

      {currentUser && (
        <UserProfileView
          isOpen={isUserProfileViewOpen}
          onClose={() => setIsUserProfileViewOpen(false)}
          currentUser={currentUser}
          onUpdateAvatar={(newAvatar) => {
            const updated = { ...currentUser, avatar: newAvatar };
            setCurrentUser(updated);
            localStorage.setItem('projectmatch_user', JSON.stringify(updated));
            setScoreNotification('Profile picture updated successfully!');
            setTimeout(() => setScoreNotification(null), 3000);
          }}
          onEditProfile={() => {
            setIsUserProfileViewOpen(false);
            setCurrentView('dashboard');
            setActiveTab('edit-profile');
          }}
        />
      )}

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

      <StudentProfileDrawer
        student={inspectedStudent}
        onClose={() => setInspectedStudent(null)}
        activeProjectDNA={projectDNA}
      />

      {/* 10-Minute Demo Expiration Modal */}
      <DemoSessionModal
        isOpen={isDemoExpiredModalOpen}
        onClose={() => setIsDemoExpiredModalOpen(false)}
        onOpenSignUp={() => {
          setAuthModalMode('signup');
          setIsAuthModalOpen(true);
        }}
        onOpenSignIn={() => {
          setAuthModalMode('signin');
          setIsAuthModalOpen(true);
        }}
        onRestartDemo={handleRestartDemo}
        onGoToLanding={() => {
          setCurrentView('landing');
        }}
      />

    </div>
  );
}
