export type SkillCategory = 
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'AI / ML'
  | 'Cloud / DevOps'
  | 'Design'
  | 'Cybersecurity'
  | 'Data'
  | 'Mobile'
  | 'Product / Business';

export type SkillProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface StudentSkill {
  name: string;
  level: number; // 0 - 100
  interest?: number; // 0 - 100
  yearsOfExperience?: number;
  category: SkillCategory | string;
  highlight?: boolean;
  verified?: boolean;
}

export interface UserExperienceProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  role: string;
}

export interface WeeklyAvailability {
  days?: {
    [key: string]: { // 'Monday', 'Tuesday', etc.
      morning: boolean;
      afternoon: boolean;
      evening: boolean;
      night: boolean;
    };
  };
  customHoursPerWeek?: number;
  hoursPerWeek?: number;
  preferredTimezone?: string;
  weekendAvailability?: boolean;
}

export interface TeamDNAStats {
  technicalStrength: number; // 0-100
  design: number;
  research: number;
  leadership: number;
  collaboration: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  age?: number;
  university: string;
  department: string;
  year: string; // e.g. "Junior", "Senior", "Master's", "PhD"
  bio: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  skills: StudentSkill[];
  interests?: string[]; // Domain interests
  preferredRoles?: string[];
  projects?: UserExperienceProject[];
  hackathonsWon?: number;
  certifications?: string[];
  achievements?: string[];
  yearsOfExperience?: number;
  availability?: WeeklyAvailability;
  completionPercentage?: number;
  teamDNA?: TeamDNAStats;
  isRealUser?: boolean;
  isDemo?: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  role: string;
  major: string;
  university: string;
  year: string; // e.g. "Senior", "Junior", "Grad Student"
  bio: string;
  skills: StudentSkill[];
  primarySkills: string[];
  interests: string[];
  experience: {
    years: number;
    hackathonsWon: number;
    highlightProject: string;
  };
  availability: {
    hoursPerWeek: number;
    status: 'High (30+ hrs/wk)' | 'Moderate (20-25 hrs/wk)' | 'Flexible (15+ hrs/wk)';
    timezone: string;
  };
  projectInterests: string[]; // e.g. ["Agriculture", "AI / ML", "Sustainability", "Cloud / DevOps"]
  collaborationStyle: 'Architect & Lead' | 'Rapid Prototyper' | 'Detail & Polish' | 'Research & Validation';
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  preferredRoles?: string[];
  isSynthetic?: boolean;
}

export interface ProjectSkillRequirement {
  name: string;
  importance: number; // percentage e.g. 94
  category: SkillCategory | string;
  description: string;
}

export interface ProjectDNA {
  id: string;
  title: string;
  description: string;
  category: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced' | 'Moonshot';
  targetTeamSize: number;
  summary: string;
  requiredSkills: ProjectSkillRequirement[];
  domainTags: string[];
  keyChallenges: string[];
  whyTheseSkills?: string[];
}

export interface MemberSelectionReason {
  studentId: string;
  primaryContribution: string;
  synergyHighlights: string[];
  individualMatchScore: number;
  needsVsProvides: {
    skill: string;
    requiredImportance: number;
    candidateProficiency: number;
    candidateInterest: number;
  }[];
  scoreBreakdown: {
    skillCoverage: number;
    complementarity: number;
    projectInterest: number;
    availability: number;
    experience: number;
  };
}

export interface SkillCoverageStatus {
  skill: string;
  importance: number;
  category: SkillCategory | string;
  coveredBy: {
    studentId: string;
    studentName: string;
    level: number;
  }[];
  effectiveCoverage: number; // 0 - 100
  status: 'optimal' | 'sufficient' | 'weak' | 'missing';
}

export interface SkillGap {
  skill: string;
  importance: number;
  category: SkillCategory | string;
  deficitDescription: string;
  recommendedStudentId?: string;
  severity: 'critical' | 'moderate' | 'minor';
}

export interface TeamMetrics {
  overallScore: number; // Composite: Coverage(40%) + Complementarity(25%) + Interest(15%) + Availability(10%) + Experience(10%)
  skillCoverage: number;
  complementarity: number;
  projectInterest: number;
  availability: number;
  experience: number;
  resilienceScore: number; // 0-100
  readinessStatus: 'READY TO BUILD' | 'NEEDS IMPROVEMENT' | 'HIGH RISK';
}

export interface TeamMatchResult {
  projectDNA: ProjectDNA;
  team: StudentProfile[];
  metrics: TeamMetrics;
  memberReasons: Record<string, MemberSelectionReason>;
  skillBreakdown: SkillCoverageStatus[];
  skillGaps: SkillGap[];
  replacementSuggestions?: Record<string, StudentProfile[]>;
}

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface ProjectTask {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  requiredSkills: string[];
  assignedMemberId?: string;
  assignedMemberName?: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  estimatedHours: number;
  phase: string;
  status: 'Ready' | 'In Progress' | 'Complete' | 'Blocked';
  isCapabilityGap?: boolean;
}

export interface SinglePointOfFailureInfo {
  skill: string;
  category: SkillCategory;
  dependentMember: StudentProfile;
  memberSkillLevel: number;
  nextBestLevel: number;
  nextBestMemberName?: string;
  riskSeverity: 'Critical' | 'High' | 'Moderate';
  impactDescription: string;
  mitigationRecommendation: string;
}

export interface PlanBTeamOption {
  id: string;
  name: string;
  badge: string;
  focusTheme: string;
  team: StudentProfile[];
  metrics: TeamMetrics;
  strengths: string[];
  tradeoffs: string[];
  recommendedReason: string;
  rank: number;
}

export interface CandidateComparisonData {
  candidateA: StudentProfile;
  candidateB: StudentProfile;
  candidateC?: StudentProfile;
  skillDeltas: {
    category: string;
    scoreA: number;
    scoreB: number;
    scoreC?: number;
    advantage: 'A' | 'B' | 'C' | 'Equal';
  }[];
  verdict: {
    winnerId: string;
    headline: string;
    rationale: string;
  };
}

export interface ProjectRiskInfo {
  level: RiskLevel;
  headline: string;
  uncoveredCriticalSkills: string[];
  reasons: string[];
  recommendation: string;
  spofItems?: SinglePointOfFailureInfo[];
  riskVectors?: {
    name: string;
    score: number; // 0-100 (higher = safer)
    riskLevel: RiskLevel;
    description: string;
  }[];
}

export interface StressTestState {
  isStressTesting: boolean;
  removedMember: StudentProfile | null;
  degradedMetrics: TeamMetrics | null;
  lostCapabilities: string[];
  impactSummary: string;
  replacementCandidates: {
    student: StudentProfile;
    replacementMatch: number; // e.g. 93%
    projectedTeamScore: number; // e.g. 92%
    restoredCapabilities: string[];
    tradeoffSummary: string;
  }[];
  activeReplacement: StudentProfile | null;
}

export interface TeamGroupRequest {
  id: string;
  groupId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  userRole: string;
  userUniversity?: string;
  matchScore: number; // e.g. 94%
  skills: string[];
  requestedRole: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
  rejectionReason?: string;
}

export interface TeamGroupMember {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  role: string;
  isLead: boolean;
  joinedAt: string;
  skills: string[];
  university?: string;
}

export interface TeamGroup {
  id: string;
  name: string;
  tagline: string;
  description: string;
  projectCategory: string;
  targetHackathonOrGoal: string;
  leadId: string;
  leadName: string;
  leadEmail: string;
  leadAvatar: string;
  leadRole: string;
  maxMembers: number;
  members: TeamGroupMember[];
  lookingForRoles: string[];
  requiredTechStack: string[];
  status: 'recruiting' | 'full' | 'in_progress';
  createdAt: string;
  requests: TeamGroupRequest[];
  bannerGradient?: string;
}

