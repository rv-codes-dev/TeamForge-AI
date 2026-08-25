import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Sparkles, 
  Award, 
  Clock, 
  Globe, 
  Github, 
  Linkedin, 
  ShieldCheck, 
  Sliders, 
  Plus, 
  Trash2, 
  Check, 
  Save, 
  ArrowRight,
  RefreshCw,
  Camera,
  CheckCircle2,
  Calendar,
  Layers,
  Zap,
  Target,
  Search,
  Code2,
  Terminal,
  Cpu,
  Database,
  Server
} from 'lucide-react';
import { UserProfile, StudentSkill, TeamDNAStats } from '../types';
import { CATEGORIZED_SKILLS, DOMAIN_INTERESTS, PREFERRED_ROLES, SKILL_CATEGORIES } from '../data/skillsCatalog';
import { AvatarUpload } from './AvatarUpload';

interface EditProfileViewProps {
  currentUser: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  onNavigateTab: (tab: string) => void;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
];

export const EditProfileView: React.FC<EditProfileViewProps> = ({
  currentUser,
  onSaveProfile,
  onNavigateTab,
}) => {
  const [activeSection, setActiveSection] = useState<'basic' | 'skills' | 'dna' | 'availability' | 'roles'>('basic');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State initialized from currentUser
  const [fullName, setFullName] = useState(currentUser.fullName || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || AVATAR_OPTIONS[0]);
  const [university, setUniversity] = useState(currentUser.university || '');
  const [department, setDepartment] = useState(currentUser.department || '');
  const [year, setYear] = useState(currentUser.year || 'Senior (Year 4)');
  const [bio, setBio] = useState(currentUser.bio || '');
  
  // Social Links
  const [githubUrl, setGithubUrl] = useState(currentUser.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(currentUser.linkedinUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(currentUser.portfolioUrl || '');
  const [hackathonsWon, setHackathonsWon] = useState(currentUser.hackathonsWon || 0);

  // Skills State
  const [skills, setSkills] = useState<StudentSkill[]>(currentUser.skills || [
    { name: 'Python', level: 90, interest: 95, category: 'AI / ML', verified: true },
    { name: 'TypeScript / React', level: 88, interest: 90, category: 'Frontend', verified: true },
    { name: 'FastAPI', level: 85, interest: 88, category: 'Backend', verified: true }
  ]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Frontend');
  const [newSkillLevel, setNewSkillLevel] = useState(80);
  const [techCatalogFilter, setTechCatalogFilter] = useState<string>('All');
  const [techSearchQuery, setTechSearchQuery] = useState('');

  // Team DNA Stats
  const [teamDNA, setTeamDNA] = useState<TeamDNAStats>(currentUser.teamDNA || {
    technicalStrength: 90,
    design: 70,
    research: 85,
    leadership: 80,
    collaboration: 92
  });

  // Availability & Timezone
  const [hoursPerWeek, setHoursPerWeek] = useState(currentUser.availability?.hoursPerWeek || 25);
  const [preferredTimezone, setPreferredTimezone] = useState(currentUser.availability?.preferredTimezone || 'UTC-8 (PST)');
  const [weekendAvailability, setWeekendAvailability] = useState(currentUser.availability?.weekendAvailability ?? true);

  // Roles & Interests
  const [preferredRoles, setPreferredRoles] = useState<string[]>(currentUser.preferredRoles || ['Full Stack Developer', 'AI/ML Engineer']);
  const [interests, setInterests] = useState<string[]>(currentUser.interests || ['AI / ML', 'Hackathons', 'Startups']);

  useEffect(() => {
    setFullName(currentUser.fullName || '');
    setEmail(currentUser.email || '');
    setAvatar(currentUser.avatar || AVATAR_OPTIONS[0]);
    setUniversity(currentUser.university || '');
    setDepartment(currentUser.department || '');
    setYear(currentUser.year || 'Senior (Year 4)');
    setBio(currentUser.bio || '');
    setGithubUrl(currentUser.githubUrl || '');
    setLinkedinUrl(currentUser.linkedinUrl || '');
    setPortfolioUrl(currentUser.portfolioUrl || '');
    setHackathonsWon(currentUser.hackathonsWon || 0);
    if (currentUser.skills) setSkills(currentUser.skills);
    if (currentUser.teamDNA) setTeamDNA(currentUser.teamDNA);
    if (currentUser.availability) {
      setHoursPerWeek(currentUser.availability.hoursPerWeek || 25);
      setPreferredTimezone(currentUser.availability.preferredTimezone || 'UTC-8 (PST)');
      setWeekendAvailability(currentUser.availability.weekendAvailability ?? true);
    }
    if (currentUser.preferredRoles) setPreferredRoles(currentUser.preferredRoles);
    if (currentUser.interests) setInterests(currentUser.interests);
  }, [currentUser]);

  // Skill Helpers
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    const exists = skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase());
    if (exists) return;

    setSkills(prev => [
      ...prev,
      {
        name: newSkillName.trim(),
        category: newSkillCategory,
        level: newSkillLevel,
        interest: Math.min(100, newSkillLevel + 5),
        verified: true
      }
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setSkills(prev => prev.filter(s => s.name !== skillName));
  };

  const handleUpdateSkillLevel = (skillName: string, level: number) => {
    setSkills(prev => prev.map(s => s.name === skillName ? { ...s, level } : s));
  };

  const toggleRole = (role: string) => {
    setPreferredRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const toggleInterest = (item: string) => {
    setInterests(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleSave = () => {
    // Calculate completeness
    let filled = 0;
    if (fullName) filled += 20;
    if (email) filled += 15;
    if (university) filled += 15;
    if (skills.length >= 3) filled += 25;
    if (bio) filled += 15;
    if (githubUrl || linkedinUrl) filled += 10;
    const completionPercentage = Math.min(100, Math.max(50, filled));

    const updatedProfile: UserProfile = {
      ...currentUser,
      fullName: fullName.trim() || 'TeamForge Member',
      email: email.trim(),
      avatar,
      university: university.trim() || 'Stanford University',
      department: department.trim() || 'Computer Science',
      year,
      bio: bio.trim(),
      githubUrl: githubUrl.trim(),
      linkedinUrl: linkedinUrl.trim(),
      portfolioUrl: portfolioUrl.trim(),
      hackathonsWon: Number(hackathonsWon) || 0,
      skills,
      teamDNA,
      availability: {
        hoursPerWeek: Number(hoursPerWeek) || 25,
        preferredTimezone,
        weekendAvailability,
        customHoursPerWeek: Number(hoursPerWeek) || 25
      },
      preferredRoles,
      interests,
      completionPercentage,
      isRealUser: true
    };

    onSaveProfile(updatedProfile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Top Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#17213A] via-[#11182B] to-[#17213A] border border-[#263550] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={avatar}
              alt={fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#38BDF8] shadow-md shadow-[#38BDF8]/20"
            />
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#38BDF8] text-[#0B1020] shadow">
              <Camera className="w-3 h-3" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-[#F8FAFC] tracking-tight">{fullName || 'Your Profile'}</h1>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                ACTIVE MEMBER
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              {department || 'Computer Science'} • {university || 'University'} ({year})
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-[#CBD5E1]">
              <span className="flex items-center gap-1 text-[#22D3EE] font-mono text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                Team DNA Readiness: {currentUser.completionPercentage || 94}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigateTab('member-hub')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#CBD5E1] bg-[#1D2942] hover:bg-[#263550] border border-[#263550] transition-colors cursor-pointer"
          >
            Go to Member Hub
          </button>
          <button
            id="save-profile-btn"
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-bold text-[#0B1020] bg-gradient-to-r from-[#38BDF8] to-[#22D3EE] hover:opacity-95 active:scale-[0.98] transition-all shadow-md shadow-[#38BDF8]/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">Profile & Team DNA preferences successfully saved and synchronized!</span>
          </div>
          <button
            onClick={() => onNavigateTab('squad')}
            className="text-xs font-bold text-emerald-200 underline flex items-center gap-1 cursor-pointer"
          >
            View Live Match Analysis →
          </button>
        </div>
      )}

      {/* Main Section Navigation Bar */}
      <div className="flex items-center gap-1.5 border-b border-[#263550] pb-1 overflow-x-auto">
        {[
          { id: 'basic', label: '1. Basic & Academic', icon: User },
          { id: 'skills', label: '2. Skills & Proficiencies', icon: ShieldCheck, count: skills.length },
          { id: 'dna', label: '3. Team DNA Vectors', icon: Sliders },
          { id: 'availability', label: '4. Availability & Schedule', icon: Clock },
          { id: 'roles', label: '5. Roles & Portfolios', icon: Target },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#17213A]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#38BDF8]' : 'text-[#94A3B8]'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#1D2942] text-[#CBD5E1]">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Basic & Academic Details */}
      {activeSection === 'basic' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-6 rounded-2xl bg-[#11182B] border border-[#263550] space-y-5">
            <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
              <User className="w-4 h-4 text-[#38BDF8]" />
              Personal & Academic Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                  Full Name <span className="text-[#38BDF8]">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rohinish Verma"
                  className="w-full px-3.5 py-2.5 bg-[#0B1020] border border-[#263550] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                  Email Address <span className="text-[#38BDF8]">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@university.edu"
                  className="w-full px-3.5 py-2.5 bg-[#0B1020] border border-[#263550] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                  University / Institution
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. Stanford University"
                  className="w-full px-3.5 py-2.5 bg-[#0B1020] border border-[#263550] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                  Department / Major
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science & AI"
                  className="w-full px-3.5 py-2.5 bg-[#0B1020] border border-[#263550] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                Academic Standing / Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B1020] border border-[#263550] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="Freshman (Year 1)">Freshman (Year 1)</option>
                <option value="Sophomore (Year 2)">Sophomore (Year 2)</option>
                <option value="Junior (Year 3)">Junior (Year 3)</option>
                <option value="Senior (Year 4)">Senior (Year 4)</option>
                <option value="Master's Student">Master's Student</option>
                <option value="PhD Candidate">PhD Candidate</option>
                <option value="Recent Graduate">Recent Graduate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                Bio & Engineering Philosophy
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your technical passions, preferred project domains, hackathon interests, and what kind of teams you thrive in..."
                className="w-full px-3.5 py-2.5 bg-[#0B1020] border border-[#263550] rounded-xl text-sm text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-5">
            <AvatarUpload
              currentAvatar={avatar}
              onAvatarChange={setAvatar}
              userName={fullName}
            />

            <div className="p-4 rounded-2xl bg-[#17213A]/60 border border-[#263550] text-xs text-[#94A3B8] space-y-2">
              <div className="flex items-center gap-2 text-[#CBD5E1] font-semibold">
                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                <span>Profile Tip</span>
              </div>
              <p>
                Keep your profile up to date. The TeamForge AI matching engine weights academic discipline, skill recency, and availability to calculate exact team synergy.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Skills & Proficiencies */}
      {activeSection === 'skills' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#11182B] border border-[#263550] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                  Your Skill Inventory & Proficiency
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Adjust sliders to calibrate your mastery score. These directly power the 5-factor matching engine.
                </p>
              </div>

              {/* Add New Skill Inline Form */}
              <form onSubmit={handleAddSkill} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Add skill (e.g. Next.js, PyTorch)..."
                  className="px-3 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8] w-48 sm:w-56"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-[#38BDF8] text-[#0B1020] text-xs font-bold hover:bg-[#22D3EE] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>
            </div>

            {/* Current Skills List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className="p-4 rounded-xl bg-[#0B1020] border border-[#263550] space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#F8FAFC]">{skill.name}</span>
                        {skill.verified && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            VERIFIED
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#94A3B8]">{skill.category}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-black text-[#38BDF8]">
                        {skill.level}%
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill.name)}
                        className="p-1 rounded-lg text-[#94A3B8] hover:text-rose-400 hover:bg-[#1D2942] transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Level Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-[#94A3B8]">
                      <span>Proficiency</span>
                      <span>{skill.level >= 90 ? 'Expert' : skill.level >= 75 ? 'Advanced' : skill.level >= 55 ? 'Intermediate' : 'Working'}</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={skill.level}
                      onChange={(e) => handleUpdateSkillLevel(skill.name, Number(e.target.value))}
                      className="w-full accent-[#38BDF8] bg-[#17213A] rounded-lg h-2 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Rich Searchable Tech Stack Catalog */}
            <div className="p-5 rounded-2xl bg-[#17213A]/50 border border-[#263550] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#38BDF8]" />
                  <h3 className="text-xs font-bold text-[#F8FAFC]">
                    Tech Stack Explorer & Quick-Add Library
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1D2942] text-[#38BDF8] font-mono">
                    100+ Technologies
                  </span>
                </div>

                {/* Tech Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={techSearchQuery}
                    onChange={(e) => setTechSearchQuery(e.target.value)}
                    placeholder="Search any tech (e.g. Next.js, Rust, Docker)..."
                    className="w-full pl-8 pr-3 py-1.5 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
                  />
                  {techSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setTechSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#94A3B8] hover:text-[#F8FAFC]"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                <button
                  type="button"
                  onClick={() => setTechCatalogFilter('All')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold shrink-0 cursor-pointer transition-colors ${
                    techCatalogFilter === 'All'
                      ? 'bg-[#38BDF8] text-[#0B1020]'
                      : 'bg-[#0B1020] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#263550]'
                  }`}
                >
                  All Stacks
                </button>
                {SKILL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setTechCatalogFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 cursor-pointer transition-colors ${
                      techCatalogFilter === cat
                        ? 'bg-[#38BDF8] text-[#0B1020]'
                        : 'bg-[#0B1020] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#263550]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Filtered Technology Badges */}
              <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
                {Object.entries(CATEGORIZED_SKILLS)
                  .filter(([cat]) => techCatalogFilter === 'All' || techCatalogFilter === cat)
                  .flatMap(([cat, techList]) => techList.map(tech => ({ tech, category: cat })))
                  .filter(({ tech, category }) => {
                    if (!techSearchQuery.trim()) return true;
                    const q = techSearchQuery.toLowerCase();
                    return tech.toLowerCase().includes(q) || category.toLowerCase().includes(q);
                  })
                  .map(({ tech, category }) => {
                    const alreadyHas = skills.some(s => s.name.toLowerCase() === tech.toLowerCase());
                    return (
                      <button
                        key={`${category}-${tech}`}
                        type="button"
                        onClick={() => {
                          if (alreadyHas) {
                            handleRemoveSkill(tech);
                          } else {
                            setSkills(prev => [
                              ...prev,
                              {
                                name: tech,
                                level: 82,
                                interest: 88,
                                category: category,
                                verified: true
                              }
                            ]);
                          }
                        }}
                        className={`group px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                          alreadyHas
                            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                            : 'bg-[#0B1020] hover:bg-[#263550] border border-[#263550] text-[#CBD5E1] hover:text-[#38BDF8]'
                        }`}
                        title={alreadyHas ? 'Click to remove from your skills' : `Click to add ${tech} (${category})`}
                      >
                        {alreadyHas ? (
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        ) : (
                          <Plus className="w-3 h-3 text-[#94A3B8] group-hover:text-[#38BDF8] shrink-0" />
                        )}
                        <span>{tech}</span>
                        <span className={`text-[9px] px-1 py-0.2 rounded ${alreadyHas ? 'bg-emerald-500/30 text-emerald-200' : 'bg-[#17213A] text-[#94A3B8]'}`}>
                          {category}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Team DNA Vector Calibration */}
      {activeSection === 'dna' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-6 rounded-2xl bg-[#11182B] border border-[#263550] space-y-6">
            <div>
              <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#38BDF8]" />
                5-Vector AI Team DNA Calibration
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Calibrate how your strengths balance with other squad members. Our matching engine pairs complementary styles to avoid single points of failure.
              </p>
            </div>

            <div className="space-y-5">
              {[
                { 
                  key: 'technicalStrength', 
                  label: 'Technical Depth & Engineering', 
                  desc: 'System architecture, backend pipelines, algorithm design, and core implementation.',
                  color: 'accent-[#38BDF8]'
                },
                { 
                  key: 'design', 
                  label: 'UI/UX & Visual Experience', 
                  desc: 'Component polish, interactive design, visual aesthetics, user empathy.',
                  color: 'accent-[#8B5CF6]'
                },
                { 
                  key: 'research', 
                  label: 'Research & Domain Modeling', 
                  desc: 'Literature review, empirical validation, statistical modeling, data accuracy.',
                  color: 'accent-[#22D3EE]'
                },
                { 
                  key: 'leadership', 
                  label: 'Leadership & Pitch Polish', 
                  desc: 'Demo presentation, storytelling, roadmapping, sprint facilitation.',
                  color: 'accent-[#F59E0B]'
                },
                { 
                  key: 'collaboration', 
                  label: 'Async Collaboration & Speed', 
                  desc: 'Fast PR turnaround, transparent communication, rapid unblocking of teammates.',
                  color: 'accent-[#10B981]'
                },
              ].map(item => (
                <div key={item.key} className="p-4 rounded-xl bg-[#0B1020] border border-[#263550] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#F8FAFC]">{item.label}</span>
                      <p className="text-[10px] text-[#94A3B8]">{item.desc}</p>
                    </div>
                    <span className="font-mono text-sm font-black text-[#38BDF8]">
                      {(teamDNA as any)[item.key]}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={(teamDNA as any)[item.key]}
                    onChange={(e) => setTeamDNA(prev => ({ ...prev, [item.key]: Number(e.target.value) }))}
                    className={`w-full ${item.color} bg-[#17213A] rounded-lg h-2 cursor-pointer`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className="p-6 rounded-2xl bg-[#11182B] border border-[#263550] space-y-4">
              <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                DNA Vector Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-2.5 rounded-lg bg-[#0B1020]">
                  <span className="text-[#CBD5E1]">Primary Strength</span>
                  <span className="font-bold text-[#38BDF8]">
                    {teamDNA.technicalStrength >= 88 ? 'Technical Lead' : teamDNA.design >= 80 ? 'Product Designer' : 'Research Architect'}
                  </span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-[#0B1020]">
                  <span className="text-[#CBD5E1]">Synergy Index</span>
                  <span className="font-bold text-emerald-400">
                    {Math.round((teamDNA.technicalStrength + teamDNA.collaboration + teamDNA.research) / 3)}%
                  </span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-[#0B1020]">
                  <span className="text-[#CBD5E1]">Hackathon Speed</span>
                  <span className="font-bold text-[#22D3EE]">Ultra-Fast (Sprint Ready)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Availability & Schedule */}
      {activeSection === 'availability' && (
        <div className="p-6 rounded-2xl bg-[#11182B] border border-[#263550] space-y-6">
          <div>
            <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#38BDF8]" />
              Weekly Bandwidth & Timezone Calibration
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Accurate bandwidth matching ensures hackathon sprints stay on track without burnout.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-[#0B1020] border border-[#263550] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#CBD5E1]">
                  Committed Hours Per Week
                </label>
                <span className="font-mono text-sm font-black text-[#38BDF8]">{hoursPerWeek} hrs/wk</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="w-full accent-[#38BDF8] bg-[#17213A] rounded-lg h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#94A3B8]">
                <span>10 hrs (Light)</span>
                <span>25-30 hrs (Standard Hackathon)</span>
                <span>50 hrs (All In)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1020] border border-[#263550] space-y-3">
              <label className="block text-xs font-bold text-[#CBD5E1]">
                Preferred Timezone
              </label>
              <select
                value={preferredTimezone}
                onChange={(e) => setPreferredTimezone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#17213A] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="UTC-8 (PST)">UTC-8 (PST - US West)</option>
                <option value="UTC-5 (EST)">UTC-5 (EST - US East)</option>
                <option value="UTC+0 (GMT)">UTC+0 (GMT - London/Europe)</option>
                <option value="UTC+5:30 (IST)">UTC+5:30 (IST - India)</option>
                <option value="UTC+8 (SGT/CST)">UTC+8 (SGT/CST - Asia East)</option>
                <option value="UTC+9 (JST)">UTC+9 (JST - Tokyo)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0B1020] border border-[#263550] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#F8FAFC]">Weekend Sprint Availability</span>
              <p className="text-[10px] text-[#94A3B8]">Available for 24-48 hour weekend hackathons</p>
            </div>
            <button
              type="button"
              onClick={() => setWeekendAvailability(!weekendAvailability)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                weekendAvailability 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-[#1D2942] text-[#94A3B8]'
              }`}
            >
              {weekendAvailability ? '✓ Weekend Active' : 'Weekdays Only'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Roles, Interests & Portfolio */}
      {activeSection === 'roles' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#11182B] border border-[#263550] space-y-5">
            <div>
              <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#38BDF8]" />
                Preferred Squad Roles
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Select the roles you are most eager to take in upcoming projects.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {PREFERRED_ROLES.map(role => {
                const isSelected = preferredRoles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#38BDF8] text-[#0B1020] font-bold shadow-md shadow-[#38BDF8]/20'
                        : 'bg-[#0B1020] text-[#CBD5E1] border border-[#263550] hover:border-[#38BDF8]/40'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{role}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#11182B] border border-[#263550] space-y-5">
            <div>
              <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#38BDF8]" />
                Portfolio Links & Hackathon Track Record
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Profile</span>
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/your-handle"
                  className="w-full px-3.5 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5 flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn Profile</span>
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/your-handle"
                  className="w-full px-3.5 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Personal Portfolio / Blog</span>
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourportfolio.dev"
                  className="w-full px-3.5 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hackathons Won / Podiums</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={hackathonsWon}
                  onChange={(e) => setHackathonsWon(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-[#0B1020] border border-[#263550] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Save Bar */}
      <div className="p-4 rounded-2xl bg-[#17213A]/90 border border-[#263550] flex items-center justify-between sticky bottom-4 shadow-2xl backdrop-blur-md">
        <div className="text-xs text-[#94A3B8]">
          Editing as <span className="font-bold text-[#F8FAFC]">{fullName || 'Member'}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigateTab('member-hub')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#CBD5E1] hover:text-[#F8FAFC] bg-[#1D2942] transition-colors cursor-pointer"
          >
            Cancel / Back to Hub
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 rounded-xl text-xs font-bold text-[#0B1020] bg-gradient-to-r from-[#38BDF8] to-[#22D3EE] hover:opacity-95 active:scale-[0.98] transition-all shadow-md shadow-[#38BDF8]/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>

    </div>
  );
};
