export type SkillCategory = 
  | 'AI & ML'
  | 'Frontend & UX'
  | 'Backend & Cloud'
  | 'Domain & Research'
  | 'Security & Systems'
  | 'Product & Management';

export interface StudentSkill {
  name: string;
  level: number; // 0 - 100
  category: SkillCategory;
  highlight?: boolean;
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
  projectInterests: string[]; // e.g. ["Agriculture", "Computer Vision", "Sustainability", "Edge AI"]
  collaborationStyle: 'Architect & Lead' | 'Rapid Prototyper' | 'Detail & Polish' | 'Research & Validation';
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface ProjectSkillRequirement {
  name: string;
  importance: number; // percentage e.g. 94
  category: SkillCategory;
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
}

export interface MemberSelectionReason {
  studentId: string;
  primaryContribution: string;
  synergyHighlights: string[];
  individualMatchScore: number;
}

export interface SkillCoverageStatus {
  skill: string;
  importance: number;
  category: SkillCategory;
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
  category: SkillCategory;
  deficitDescription: string;
  recommendedStudentId?: string;
  severity: 'critical' | 'moderate' | 'minor';
}

export interface TeamMetrics {
  overallScore: number; // Weighted composite: Coverage(50%) + Complementarity(20%) + Interest(15%) + Availability(15%)
  skillCoverage: number;
  complementarity: number;
  projectInterest: number;
  availability: number;
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
