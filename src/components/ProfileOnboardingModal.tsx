import React, { useState } from 'react';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Globe, 
  Github, 
  Linkedin, 
  Clock, 
  Award, 
  Briefcase, 
  Sparkles, 
  Zap, 
  ShieldAlert, 
  Search,
  BookOpen
} from 'lucide-react';
import { 
  CATEGORIZED_SKILLS, 
  SKILL_CATEGORIES, 
  DOMAIN_INTERESTS, 
  PREFERRED_ROLES 
} from '../data/skillsCatalog';
import { UserProfile, StudentSkill, UserExperienceProject, WeeklyAvailability } from '../types';
import { AvatarUpload } from './AvatarUpload';

interface ProfileOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const ProfileOnboardingModal: React.FC<ProfileOnboardingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
}) => {
  const [step, setStep] = useState(1);

  // Step 1: Basic Info
  const [fullName, setFullName] = useState(currentUser.fullName || '');
  const [university, setUniversity] = useState(currentUser.university || '');
  const [department, setDepartment] = useState(currentUser.department || '');
  const [year, setYear] = useState(currentUser.year || 'Senior');
  const [age, setAge] = useState<number>(currentUser.age || 21);

  // Step 2: Profile & Links
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  const [githubUrl, setGithubUrl] = useState(currentUser.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(currentUser.linkedinUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(currentUser.portfolioUrl || '');

  // Step 3: Categorized Skills System
  const [skills, setSkills] = useState<StudentSkill[]>(
    currentUser.skills?.length > 0 
      ? currentUser.skills 
      : [
          { name: 'Python', level: 90, interest: 95, yearsOfExperience: 3, category: 'Backend' },
          { name: 'Computer Vision', level: 94, interest: 95, yearsOfExperience: 2, category: 'AI / ML', highlight: true },
          { name: 'React', level: 80, interest: 75, yearsOfExperience: 2, category: 'Frontend' },
        ]
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [skillSearch, setSkillSearch] = useState<string>('');
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillCategory, setCustomSkillCategory] = useState('Frontend');

  // Step 4: Interests & Roles
  const [interests, setInterests] = useState<string[]>(currentUser.interests || ['AI / ML', 'Agriculture', 'Sustainability']);
  const [preferredRoles, setPreferredRoles] = useState<string[]>(currentUser.preferredRoles || ['AI/ML Engineer', 'Full Stack Developer']);

  // Step 5: Projects & Experience
  const [projects, setProjects] = useState<UserExperienceProject[]>(
    currentUser.projects?.length > 0 
      ? currentUser.projects 
      : [
          {
            id: 'p1',
            name: 'AgriVision Edge',
            description: 'Embedded leaf disease classifier using PyTorch Mobile on IoT cameras.',
            technologies: ['PyTorch', 'Python', 'OpenCV', 'FastAPI'],
            role: 'Lead ML Engineer'
          }
        ]
  );
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectTech, setNewProjectTech] = useState('');
  const [newProjectRole, setNewProjectRole] = useState('');
  const [hackathonsWon, setHackathonsWon] = useState<number>(currentUser.hackathonsWon || 2);
  const [certificationsText, setCertificationsText] = useState(currentUser.certifications?.join(', ') || 'AWS Certified Machine Learning');
  const [achievementsText, setAchievementsText] = useState(currentUser.achievements?.join(', ') || '1st Place Hackathon 2024');

  // Step 6: Weekly Availability Matrix
  const [availability, setAvailability] = useState<WeeklyAvailability>(
    currentUser.availability || {
      days: {
        Monday: { morning: true, afternoon: true, evening: true, night: false },
        Tuesday: { morning: false, afternoon: true, evening: true, night: true },
        Wednesday: { morning: true, afternoon: true, evening: true, night: false },
        Thursday: { morning: false, afternoon: true, evening: true, night: true },
        Friday: { morning: true, afternoon: true, evening: true, night: true },
        Saturday: { morning: true, afternoon: true, evening: true, night: true },
        Sunday: { morning: false, afternoon: true, evening: true, night: false },
      },
      customHoursPerWeek: 30
    }
  );

  if (!isOpen) return null;

  // Toggle availability slot
  const toggleSlot = (day: string, slot: 'morning' | 'afternoon' | 'evening' | 'night') => {
    setAvailability(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          [slot]: !prev.days[day]?.[slot]
        }
      }
    }));
  };

  // Add skill helper
  const addSkill = (name: string, category: string) => {
    if (skills.some(s => s.name.toLowerCase() === name.toLowerCase())) return;
    setSkills(prev => [
      ...prev,
      {
        name,
        category,
        level: 75,
        interest: 85,
        yearsOfExperience: 1,
      }
    ]);
  };

  const removeSkill = (name: string) => {
    setSkills(prev => prev.filter(s => s.name !== name));
  };

  const updateSkill = (name: string, field: 'level' | 'interest' | 'yearsOfExperience', value: number) => {
    setSkills(prev => prev.map(s => s.name === name ? { ...s, [field]: value } : s));
  };

  // Add Project
  const handleAddProject = () => {
    if (!newProjectName.trim()) return;
    setProjects(prev => [
      ...prev,
      {
        id: `proj-${Date.now()}`,
        name: newProjectName.trim(),
        description: newProjectDesc.trim() || 'Key technical project demonstrating system development.',
        technologies: newProjectTech.split(',').map(t => t.trim()).filter(Boolean),
        role: newProjectRole.trim() || 'Core Contributor'
      }
    ]);
    setNewProjectName('');
    setNewProjectDesc('');
    setNewProjectTech('');
    setNewProjectRole('');
  };

  const handleRemoveProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Calculate DNA Stats
  const calculateDNA = () => {
    const techSkills = skills.filter(s => ['AI / ML', 'Backend', 'Frontend', 'Database', 'Cloud / DevOps', 'Cybersecurity', 'Data'].includes(s.category as string));
    const designSkills = skills.filter(s => s.category === 'Design' || s.name.includes('UX') || s.name.includes('UI'));
    
    const avgTech = techSkills.length ? Math.round(techSkills.reduce((acc, s) => acc + s.level, 0) / techSkills.length) : 75;
    const avgDesign = designSkills.length ? Math.round(designSkills.reduce((acc, s) => acc + s.level, 0) / designSkills.length) : (skills.some(s => s.name.toLowerCase().includes('react')) ? 70 : 55);
    
    const researchScore = Math.min(100, (interests.includes('AI / ML') ? 85 : 70) + (skills.some(s => s.level >= 90) ? 10 : 0));
    const leadershipScore = Math.min(100, 65 + (hackathonsWon * 8) + (projects.length * 4));
    const collabScore = Math.min(100, Math.round((availability.customHoursPerWeek / 35) * 95));

    return {
      technicalStrength: Math.min(98, Math.max(60, avgTech)),
      design: Math.min(95, Math.max(45, avgDesign)),
      research: Math.min(95, Math.max(50, researchScore)),
      leadership: Math.min(95, Math.max(55, leadershipScore)),
      collaboration: Math.min(98, Math.max(60, collabScore))
    };
  };

  // Calculate Profile Completion %
  const calculateCompletion = () => {
    let score = 0;
    if (fullName) score += 15;
    if (university && department) score += 15;
    if (bio && bio.length > 20) score += 15;
    if (skills.length >= 3) score += 20;
    if (interests.length >= 2) score += 10;
    if (projects.length >= 1) score += 15;
    if (availability.customHoursPerWeek > 0) score += 10;
    return Math.min(100, score);
  };

  const handleFinish = () => {
    const dna = calculateDNA();
    const completion = calculateCompletion();

    const updatedProfile: UserProfile = {
      ...currentUser,
      fullName,
      university,
      department,
      year,
      age,
      avatar,
      bio,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      skills,
      interests,
      preferredRoles,
      projects,
      hackathonsWon,
      certifications: certificationsText.split(',').map(c => c.trim()).filter(Boolean),
      achievements: achievementsText.split(',').map(a => a.trim()).filter(Boolean),
      availability,
      completionPercentage: completion,
      teamDNA: dna,
      isRealUser: true
    };

    onSaveProfile(updatedProfile);
    onClose();
  };

  const stepsList = [
    'Basic Info',
    'Profile & Links',
    'Skills System',
    'Interests & Roles',
    'Projects',
    'Availability',
    'Team DNA'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/85 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#11182B] border border-[#263550] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#17213A]/80 border-b border-[#263550] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              </div>
              <h2 className="text-base font-bold text-[#F8FAFC]">
                Multi-Step Profile Onboarding & Team DNA
              </h2>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Step {step} of 7 — {stepsList[step - 1]}
            </p>
          </div>
          
          <div className="flex items-center gap-3 text-right">
            <button
              type="button"
              onClick={handleFinish}
              className="text-xs text-[#38BDF8] hover:underline font-semibold cursor-pointer"
            >
              Skip to Workspace →
            </button>
            <span className="text-xs font-mono text-[#38BDF8] font-bold bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/20">
              {Math.round((step / 7) * 100)}%
            </span>
          </div>
        </div>

        {/* Interactive Step Progress Bar */}
        <div className="w-full bg-[#0B1020] h-1.5 border-b border-[#263550]">
          <div 
            className="h-full bg-gradient-to-r from-[#38BDF8] via-[#8B5CF6] to-[#22D3EE] transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>

        {/* Step Navigation Tabs */}
        <div className="flex items-center justify-between px-6 py-2 bg-[#0B1020]/60 border-b border-[#263550] overflow-x-auto text-[11px] no-scrollbar">
          {stepsList.map((sName, idx) => {
            const stepNum = idx + 1;
            const isCurrent = step === stepNum;
            const isDone = step > stepNum;
            return (
              <button
                key={sName}
                onClick={() => setStep(stepNum)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  isCurrent 
                    ? 'bg-[#38BDF8]/15 text-[#38BDF8] font-semibold border border-[#38BDF8]/30' 
                    : isDone 
                    ? 'text-emerald-400 font-medium' 
                    : 'text-[#94A3B8] hover:text-[#CBD5E1]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isCurrent ? 'bg-[#38BDF8] text-[#0B1020] font-bold' : isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-[#1D2942] text-[#94A3B8]'
                }`}>
                  {isDone ? <Check className="w-2.5 h-2.5" /> : stepNum}
                </div>
                <span>{sName}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-[#1D2942]/60 rounded-xl border border-[#263550] flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold text-[#F8FAFC]">Academic & Identity Verification</span>
                  <p className="text-[#94A3B8] mt-0.5">
                    Your name and academic affiliation help verify university status and match with compatible project partners.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full px-3.5 py-2.5 bg-[#0B1020] border border-[#263550] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">College / University *</label>
                  <input
                    type="text"
                    required
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="UC Berkeley, Stanford, CMU..."
                    className="w-full px-3.5 py-2.5 bg-[#0B1020] border border-[#263550] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">Department / Major *</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Computer Science, HCI, Electrical Engineering..."
                    className="w-full px-3.5 py-2.5 bg-[#0B1020] border border-[#263550] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">Current Academic Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0B1020] border border-[#263550] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                  >
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Master's Student">Master's Student</option>
                    <option value="PhD Candidate">PhD Candidate</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#CBD5E1]">Age</label>
                    <span className="text-[11px] text-[#94A3B8] italic">
                      Non-matching metadata (privacy safeguarded)
                    </span>
                  </div>
                  <input
                    type="number"
                    min={16}
                    max={99}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#0B1020] border border-[#263550] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Profile & Links */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                  Bio / Summary (2-3 sentences)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Passionate about lightweight edge ML, full-stack prototyping, and agile hackathons. Looking for a serious team targeting the top prize."
                  className="w-full px-3.5 py-2.5 bg-[#0B1020] border border-[#263550] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8] resize-none"
                />
              </div>

              <div>
                <AvatarUpload
                  currentAvatar={avatar}
                  onAvatarChange={setAvatar}
                  userName={fullName}
                  size="sm"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-[#CBD5E1]">
                  Verified Portfolio & Code Repositories
                </label>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#17213A] border border-[#263550] flex items-center justify-center shrink-0">
                    <Github className="w-4 h-4 text-[#CBD5E1]" />
                  </div>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="flex-1 px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#17213A] border border-[#263550] flex items-center justify-center shrink-0">
                    <Linkedin className="w-4 h-4 text-[#38BDF8]" />
                  </div>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="flex-1 px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#17213A] border border-[#263550] flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-[#22D3EE]" />
                  </div>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://myportfolio.dev"
                    className="flex-1 px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Categorized Skills System */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-3 bg-[#1D2942]/60 rounded-xl border border-[#263550] flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#22D3EE] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold text-[#F8FAFC]">Dual-Vector Skill Valuation</span>
                  <p className="text-[#94A3B8] mt-0.5">
                    We distinguish between <strong>Proficiency</strong> (what you can build) and <strong>Interest</strong> (what you want to build). This ensures teams have high morale without forced role burnout.
                  </p>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === 'All' 
                      ? 'bg-[#38BDF8] text-[#0B1020] font-bold' 
                      : 'bg-[#17213A] text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  All Categories
                </button>
                {SKILL_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat 
                        ? 'bg-[#38BDF8] text-[#0B1020] font-bold' 
                        : 'bg-[#17213A] text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search & Predefined Quick Add */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  placeholder="Search skills (e.g. PyTorch, React, Docker, Figma, OpenCV)..."
                  className="w-full pl-9 pr-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              {/* Skills Catalog Quick Pick */}
              <div className="p-3 bg-[#0B1020] border border-[#263550] rounded-xl">
                <div className="text-[11px] font-semibold text-[#CBD5E1] mb-2">
                  Click to add to your profile:
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {Object.entries(CATEGORIZED_SKILLS)
                    .filter(([cat]) => selectedCategory === 'All' || selectedCategory === cat)
                    .flatMap(([cat, skillNames]) => 
                      skillNames
                        .filter(name => !skillSearch || name.toLowerCase().includes(skillSearch.toLowerCase()))
                        .map(name => {
                          const isAdded = skills.some(s => s.name.toLowerCase() === name.toLowerCase());
                          return (
                            <button
                              key={name}
                              disabled={isAdded}
                              onClick={() => addSkill(name, cat)}
                              className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-all ${
                                isAdded
                                  ? 'bg-[#17213A] text-[#94A3B8]/60 cursor-not-allowed border border-transparent'
                                  : 'bg-[#1D2942] text-[#CBD5E1] hover:text-[#38BDF8] hover:border-[#38BDF8]/40 border border-[#263550]'
                              }`}
                            >
                              <span>{name}</span>
                              {isAdded ? <Check className="w-3 h-3 text-emerald-400" /> : <Plus className="w-3 h-3" />}
                            </button>
                          );
                        })
                    )}
                </div>
              </div>

              {/* Custom Skill Add Form */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={customSkillName}
                  onChange={(e) => setCustomSkillName(e.target.value)}
                  placeholder="Or enter custom technology name..."
                  className="flex-1 px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                />
                <select
                  value={customSkillCategory}
                  onChange={(e) => setCustomSkillCategory(e.target.value)}
                  className="px-2.5 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                >
                  {SKILL_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    if (customSkillName.trim()) {
                      addSkill(customSkillName.trim(), customSkillCategory);
                      setCustomSkillName('');
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-[#38BDF8]/20 hover:bg-[#38BDF8]/30 text-[#38BDF8] text-xs font-semibold border border-[#38BDF8]/30 transition-colors"
                >
                  Add Custom
                </button>
              </div>

              {/* Active Profile Skills with Sliders */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F8FAFC]">
                    Your Configured Skills ({skills.length})
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">
                    Adjust Proficiency, Interest & Experience
                  </span>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {skills.map(s => (
                    <div 
                      key={s.name}
                      className="p-3 bg-[#17213A]/70 border border-[#263550] rounded-xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#F8FAFC]">{s.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#1D2942] text-[#38BDF8] border border-[#263550]">
                            {s.category}
                          </span>
                        </div>
                        <button
                          onClick={() => removeSkill(s.name)}
                          className="p-1 rounded text-[#94A3B8] hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px]">
                        <div>
                          <div className="flex items-center justify-between text-[#CBD5E1] mb-1">
                            <span>Proficiency</span>
                            <span className="font-mono text-[#38BDF8] font-bold">{s.level}%</span>
                          </div>
                          <input
                            type="range"
                            min={20}
                            max={100}
                            value={s.level}
                            onChange={(e) => updateSkill(s.name, 'level', Number(e.target.value))}
                            className="w-full accent-[#38BDF8] h-1.5 bg-[#0B1020] rounded-lg cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-[#CBD5E1] mb-1">
                            <span>Project Interest</span>
                            <span className="font-mono text-[#8B5CF6] font-bold">{s.interest || 80}%</span>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={100}
                            value={s.interest || 80}
                            onChange={(e) => updateSkill(s.name, 'interest', Number(e.target.value))}
                            className="w-full accent-[#8B5CF6] h-1.5 bg-[#0B1020] rounded-lg cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-[#CBD5E1] mb-1">
                            <span>Years Exp</span>
                            <span className="font-mono text-[#22D3EE] font-bold">{s.yearsOfExperience || 1} yr</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={8}
                            step={0.5}
                            value={s.yearsOfExperience || 1}
                            onChange={(e) => updateSkill(s.name, 'yearsOfExperience', Number(e.target.value))}
                            className="w-full accent-[#22D3EE] h-1.5 bg-[#0B1020] rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Domain Interests & Preferred Roles */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-2">
                  Select Domain Interests (Pick at least 2)
                </label>
                <div className="flex flex-wrap gap-2">
                  {DOMAIN_INTERESTS.map(dom => {
                    const isSelected = interests.includes(dom);
                    return (
                      <button
                        key={dom}
                        onClick={() => {
                          if (isSelected) {
                            setInterests(prev => prev.filter(i => i !== dom));
                          } else {
                            setInterests(prev => [...prev, dom]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#38BDF8] text-[#0B1020] font-bold shadow-md shadow-[#38BDF8]/20'
                            : 'bg-[#17213A] text-[#CBD5E1] hover:bg-[#1D2942] border border-[#263550]'
                        }`}
                      >
                        {dom}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-2">
                  Preferred Team Roles (What roles do you excel at?)
                </label>
                <div className="flex flex-wrap gap-2">
                  {PREFERRED_ROLES.map(role => {
                    const isSelected = preferredRoles.includes(role);
                    return (
                      <button
                        key={role}
                        onClick={() => {
                          if (isSelected) {
                            setPreferredRoles(prev => prev.filter(r => r !== role));
                          } else {
                            setPreferredRoles(prev => [...prev, role]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#8B5CF6] text-[#F8FAFC] font-bold shadow-md shadow-[#8B5CF6]/20'
                            : 'bg-[#17213A] text-[#CBD5E1] hover:bg-[#1D2942] border border-[#263550]'
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Experience & Projects */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                    Hackathons Won / Top 3 Finishes
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#17213A] border border-[#263550] flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4 text-amber-400" />
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={hackathonsWon}
                      onChange={(e) => setHackathonsWon(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                    Certifications & Specializations
                  </label>
                  <input
                    type="text"
                    value={certificationsText}
                    onChange={(e) => setCertificationsText(e.target.value)}
                    placeholder="AWS ML Specialty, TensorFlow Developer..."
                    className="w-full px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
              </div>

              {/* Projects List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F8FAFC]">
                    Featured Projects ({projects.length})
                  </span>
                </div>

                <div className="space-y-2">
                  {projects.map(p => (
                    <div key={p.id} className="p-3 bg-[#17213A]/70 border border-[#263550] rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-[#38BDF8]" />
                          <span className="text-xs font-bold text-[#F8FAFC]">{p.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#1D2942] text-[#CBD5E1]">
                            {p.role}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveProject(p.id)}
                          className="text-[#94A3B8] hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] mt-1">{p.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.technologies.map(t => (
                          <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-[#0B1020] text-[#38BDF8]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Project Subform */}
                <div className="p-3 bg-[#0B1020] border border-[#263550] rounded-xl space-y-2">
                  <span className="text-[11px] font-semibold text-[#CBD5E1]">Add New Project</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Project Name (e.g. AgriVision Lite)"
                      className="px-3 py-1.5 bg-[#17213A] border border-[#263550] rounded-lg text-xs text-[#F8FAFC] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={newProjectRole}
                      onChange={(e) => setNewProjectRole(e.target.value)}
                      placeholder="Your Role (e.g. ML Lead)"
                      className="px-3 py-1.5 bg-[#17213A] border border-[#263550] rounded-lg text-xs text-[#F8FAFC] focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    value={newProjectTech}
                    onChange={(e) => setNewProjectTech(e.target.value)}
                    placeholder="Technologies (comma-separated: Python, PyTorch, React)"
                    className="w-full px-3 py-1.5 bg-[#17213A] border border-[#263550] rounded-lg text-xs text-[#F8FAFC] focus:outline-none"
                  />
                  <textarea
                    rows={2}
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    placeholder="Brief description of what was built and impact..."
                    className="w-full px-3 py-1.5 bg-[#17213A] border border-[#263550] rounded-lg text-xs text-[#F8FAFC] focus:outline-none resize-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="w-full py-1.5 rounded-lg bg-[#38BDF8]/20 hover:bg-[#38BDF8]/30 text-[#38BDF8] text-xs font-semibold transition-colors"
                  >
                    + Save Project
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Visual Weekly Availability Selector */}
          {step === 6 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between p-3 bg-[#1D2942]/60 rounded-xl border border-[#263550]">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#38BDF8]" />
                  <div>
                    <span className="text-xs font-semibold text-[#F8FAFC]">Weekly Commitment Target</span>
                    <p className="text-[11px] text-[#94A3B8]">How many hours can you reliably commit?</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-mono font-bold text-[#38BDF8]">
                    {availability.customHoursPerWeek} hrs/week
                  </span>
                </div>
              </div>

              <div>
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={5}
                  value={availability.customHoursPerWeek}
                  onChange={(e) => setAvailability(prev => ({ ...prev, customHoursPerWeek: Number(e.target.value) }))}
                  className="w-full accent-[#38BDF8] h-2 bg-[#0B1020] rounded-lg cursor-pointer"
                />
              </div>

              {/* Day x Slot Grid */}
              <div className="pt-2">
                <span className="block text-xs font-semibold text-[#CBD5E1] mb-2">
                  Weekly Schedule Heatmap (Click slots to toggle availability)
                </span>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#263550] text-[#94A3B8]">
                        <th className="py-2 px-2">Day</th>
                        <th className="py-2 px-2 text-center">Morning (8-12)</th>
                        <th className="py-2 px-2 text-center">Afternoon (12-5)</th>
                        <th className="py-2 px-2 text-center">Evening (5-9)</th>
                        <th className="py-2 px-2 text-center">Night (9-12)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                        const daySlots = availability.days[day] || { morning: false, afternoon: false, evening: false, night: false };
                        return (
                          <tr key={day} className="border-b border-[#263550]/50 hover:bg-[#17213A]/40">
                            <td className="py-2 px-2 font-medium text-[#F8FAFC]">{day.slice(0, 3)}</td>
                            {(['morning', 'afternoon', 'evening', 'night'] as const).map(slot => {
                              const active = daySlots[slot];
                              return (
                                <td key={slot} className="py-2 px-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => toggleSlot(day, slot)}
                                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                                      active 
                                        ? 'bg-[#38BDF8] text-[#0B1020] font-bold shadow-sm shadow-[#38BDF8]/20' 
                                        : 'bg-[#0B1020] text-[#94A3B8] border border-[#263550] hover:border-[#38BDF8]/40'
                                    }`}
                                  >
                                    {active ? <Check className="w-3.5 h-3.5 mx-auto" /> : '—'}
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Profile Completion Preview & Team DNA */}
          {step === 7 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Profile Completion Card */}
              <div className="p-4 bg-[#17213A] border border-[#263550] rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F8FAFC]">Profile Completion Readiness</span>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    Profiles with &gt;85% completion achieve 3.4x faster optimal team formation.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-lg font-mono font-bold text-[#34D399]">
                      {calculateCompletion()}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Generated Team DNA Card */}
              <div className="p-4 bg-[#0B1020] border border-[#263550] rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                    <span className="text-xs font-bold text-[#F8FAFC]">Your Generated Team DNA</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#8B5CF6]/20 text-[#8B5CF6] font-semibold">
                    AI Synergy Vector
                  </span>
                </div>

                {(() => {
                  const dna = calculateDNA();
                  return (
                    <div className="space-y-2.5 pt-1">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[#CBD5E1]">Technical Strength</span>
                          <span className="font-mono text-[#38BDF8] font-bold">{dna.technicalStrength}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#17213A] rounded-full overflow-hidden">
                          <div className="h-full bg-[#38BDF8]" style={{ width: `${dna.technicalStrength}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[#CBD5E1]">Design & UI/UX</span>
                          <span className="font-mono text-[#8B5CF6] font-bold">{dna.design}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#17213A] rounded-full overflow-hidden">
                          <div className="h-full bg-[#8B5CF6]" style={{ width: `${dna.design}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[#CBD5E1]">Research & Domain Depth</span>
                          <span className="font-mono text-[#22D3EE] font-bold">{dna.research}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#17213A] rounded-full overflow-hidden">
                          <div className="h-full bg-[#22D3EE]" style={{ width: `${dna.research}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[#CBD5E1]">Leadership & Hackathon Velocity</span>
                          <span className="font-mono text-amber-400 font-bold">{dna.leadership}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#17213A] rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400" style={{ width: `${dna.leadership}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[#CBD5E1]">Collaboration & Availability</span>
                          <span className="font-mono text-emerald-400 font-bold">{dna.collaboration}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#17213A] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400" style={{ width: `${dna.collaboration}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-6 py-4 bg-[#17213A]/80 border-t border-[#263550] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep(prev => Math.max(1, prev - 1))}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#CBD5E1] bg-[#1D2942] hover:bg-[#263550] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              type="button"
              onClick={handleFinish}
              className="px-3 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1D2942] transition-colors cursor-pointer"
            >
              Save & Skip Later Steps
            </button>
          </div>

          {step < 7 ? (
            <button
              type="button"
              onClick={() => setStep(prev => Math.min(7, prev + 1))}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-[#0B1020] bg-gradient-to-r from-[#38BDF8] to-[#22D3EE] hover:opacity-95 transition-all flex items-center gap-1.5 shadow-md shadow-[#38BDF8]/10"
            >
              <span>Next: {stepsList[step]}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2 rounded-xl text-xs font-bold text-[#0B1020] bg-gradient-to-r from-[#34D399] to-[#22D3EE] hover:opacity-95 transition-all flex items-center gap-1.5 shadow-lg shadow-[#34D399]/20"
            >
              <Check className="w-4 h-4" />
              <span>Save Profile & Enter Workspace</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
